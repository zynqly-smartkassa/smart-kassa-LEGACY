import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import invoicePDFService from "../services/invoicePDF.service.js";
import pool from "../db.js";
import { checkGuest } from "../middleware/isGuest.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// S3 Client für Railway Buckets
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false, // Railway uses virtual-hosted style
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * To get the .pdf files of the bills
 * The CORS.json file is used also for the data provided by this api endpoint, so the frontend can send a request to the url's, which results
 * in the frontend being able to take the blob values out of the response and create a way to being able to download the file (no download URL provided like in vercel storage)
 */
router.get("/invoices", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const company_id = req.user.companyId;
    const { token, limit } = req.query;

    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `Bills/${company_id}/${user_id}/`,
      ContinuationToken: token,
      MaxKeys: limit || 10,
    });

    const response = await s3Client.send(listCommand);
    let NextContinuationToken = null;
    if (response.IsTruncated) {
      NextContinuationToken = response.NextContinuationToken;
    }

    // Only actual files (no markers)
    const actualFiles = (response.Contents || []).filter(
      (item) => item.Size > 0,
    );

    // generate Presigned URLs (7 days for RKSV Compliance)
    const filesWithUrls = await Promise.all(
      actualFiles.map(async (file) => {
        const [url, downloadUrl] = await Promise.all([
          getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: file.Key,
              ResponseContentType: "application/pdf",
              ResponseContentDisposition: "inline",
            }),
            { expiresIn: 7 * 24 * 60 * 60 },
          ),
          getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: file.Key,
              ResponseContentType: "application/pdf",
              ResponseContentDisposition: `attachment; filename="${file.Key.split("/").pop()}"`,
            }),
            { expiresIn: 7 * 24 * 60 * 60 },
          ),
        ]);

        /**
         * @todo in the future, check if the driver/user is company owner or not (check role), so company owner sees
         * every invoice of company, employee only it's own
         */
        const driverDataResult = await pool.query(
          `SELECT first_name, last_name, email, phone_number from users where user_id = $1`,
          [user_id],
        );

        const driverData = driverDataResult.rows[0];

        const billing_id = file.Key.match(/_([^_]+)\.pdf$/)?.[1];
        const billingDataResult = await pool.query(
          `SELECT amount_net, tax_rate, amount_tax, amount_gross, tip_amount, payment_method, ride_id FROM billing WHERE billing_id = $1`,
          [billing_id],
        );
        const billingData = billingDataResult.rows[0];

        return {
          driverData: {
            name: `${driverData.first_name} ${driverData.last_name}`,
            email: driverData.email,
            phonenumber: driverData.phone_number,
          },
          billingData: {
            billing_id: billing_id,
            amount_net: billingData.amount_net,
            tax_rate: billingData.tax_rate,
            amount_tax: billingData.amount_tax,
            amount_gross: billingData.amount_gross,
            tip_amount: billingData.tip_amount,
            payment_method: billingData.payment_method,
            ride_id: billingData.ride_id,
          },
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
          url: url,
          downloadUrl: downloadUrl,
        };
      }),
    );

    res.status(200).send({
      files: filesWithUrls,
      count: filesWithUrls.length,
      nextContinuationToken: NextContinuationToken,
      message: "Fetched Invoices Successfully",
    });
  } catch (error) {
    console.error("Error fetching invoices from S3:", error);
    res.status(500).json({ error: "Internal Server Error", path: "invoices" });
  }
});

router.get("/invoices/:id", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const company_id = req.user.companyId;
    const id = req.params.id;

    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `Bills/${company_id}/${user_id}/`,
    });

    const response = await s3Client.send(listCommand);
    const suffix = `_${id}.pdf`;

    const actualFile = response.Contents?.find(
      (file) => file.Key.endsWith(suffix) && file.Size > 0,
    );

    if (!actualFile) {
      return res.status(404).json("Invoice not found");
    }

    const [url, downloadUrl] = await Promise.all([
      getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: actualFile.Key,
          ResponseContentType: "application/pdf",
          ResponseContentDisposition: "inline",
        }),
        { expiresIn: 7 * 24 * 60 * 60 },
      ),
      getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: actualFile.Key,
          ResponseContentType: "application/pdf",
          ResponseContentDisposition: `attachment; filename="${actualFile.Key.split("/").pop()}"`,
        }),
        { expiresIn: 7 * 24 * 60 * 60 },
      ),
    ]);

    /**
     * @todo in the future, check if the driver/user is company owner or not (check role), so company owner sees
     * every invoice of company, employee only it's own
     */
    const driverDataResult = await pool.query(
      `SELECT first_name, last_name, email, phone_number from users where user_id = $1`,
      [user_id],
    );

    const driverData = driverDataResult.rows[0];

    const billingDataResult = await pool.query(
      `SELECT amount_net, tax_rate, amount_tax, amount_gross, tip_amount, payment_method, ride_id FROM billing WHERE billing_id = $1`,
      [id],
    );
    const billingData = billingDataResult.rows[0];

    return res.status(200).json({
      driverData: {
        name: `${driverData.first_name} ${driverData.last_name}`,
        email: driverData.email,
        phonenumber: driverData.phone_number,
      },
      billingData: {
        billing_id: id,
        amount_net: billingData.amount_net,
        tax_rate: billingData.tax_rate,
        amount_tax: billingData.amount_tax,
        amount_gross: billingData.amount_gross,
        tip_amount: billingData.tip_amount,
        payment_method: billingData.payment_method,
        ride_id: billingData.ride_id,
      },
      key: actualFile.Key,
      size: actualFile.Size,
      lastModified: actualFile.LastModified,
      url: url,
      downloadUrl: downloadUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

router.get("/avatar", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `Profile_Picture/${user_id}/`,
    });

    const response = await s3Client.send(listCommand);
    const actualFiles = (response.Contents || []).filter(
      (item) => item.Size > 0,
    );

    // generate Presigned URLs (1 Hour for Avatars)
    const filesWithUrls = await Promise.all(
      actualFiles.map(async (file) => {
        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: file.Key,
          }),
          { expiresIn: 3600 }, // 1 Hour
        );

        return {
          key: file.Key,
          url: url,
        };
      }),
    );

    return res
      .status(200)
      .setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
      .send({
        files: filesWithUrls,
      });
  } catch (error) {
    console.error("Error fetching avatar from S3:", error);
    return res.status(500).send({ error: error.message });
  }
});

router.put(
  "/avatar",
  authenticateToken,
  checkGuest,
  upload.single("newAvatar"),
  async (req, res) => {
    try {
      const user_id = req.user.userId;
      const newAvatar = req.file;

      if (!newAvatar) {
        return res
          .status(400)
          .send({ error: "Keine Datei im Request gefunden." });
      }

      // fetching old avatars
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: `Profile_Picture/${user_id}/`,
      });

      const existingBlobs = await s3Client.send(listCommand);

      // deleting old avatars
      if (existingBlobs.Contents && existingBlobs.Contents.length > 0) {
        await Promise.all(
          existingBlobs.Contents.map(async (file) => {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: file.Key,
            });
            await s3Client.send(deleteCommand);
          }),
        );
      }

      const timeStamp = Date.now();
      const fileExtension = newAvatar.originalname
        .split(".")
        .pop()
        .toLowerCase();
      const filename = `Profile_Picture/${user_id}/avatar_${timeStamp}.${fileExtension}`;

      // Upload new Avatar
      const putCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: newAvatar.buffer,
        ContentType: newAvatar.mimetype,
      });

      await s3Client.send(putCommand);

      // generate Presigned URL
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filename,
        }),
        { expiresIn: 3600 },
      );

      return res.status(200).send({
        message: "Avatar uploaded successfully",
        url: url,
        key: filename,
      });
    } catch (error) {
      console.error("Error uploading avatar to S3:", error);
      return res
        .status(500)
        .send({ error: "Internal Server Error", details: error.message });
    }
  },
);

export default router;
