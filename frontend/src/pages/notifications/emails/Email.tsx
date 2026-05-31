/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../../../../tailwind.config';

interface ZynqlyConfirmEmailProps {
  validationCode?: string;
}

// Change it to vercel when it's ready
// Video: https://www.youtube.com/watch?v=btZII7TXlhk
// ReSend at 10:30
const baseUrl = 'http://localhost:5173';

/**
 * Email template component for Zynqly account confirmation.
 * 
 * Renders a branded email with a validation code that users receive when signing up.
 * The email includes the Zynqly logo, confirmation instructions, social media links,
 * and footer information. Built with React Email components and styled using Tailwind CSS.
 * 
 * @param {ZynqlyConfirmEmailProps} props - The email template properties.
 * @param {string} props.validationCode - The validation code to display for account confirmation.
 * @returns {JSX.Element} A fully formatted HTML email template.
 */
export const Email = ({
  validationCode,
}: ZynqlyConfirmEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig as any}>
      <Body className="bg-white font-slack mx-auto my-0">
        <Preview>Bestätigen Sie Ihr Zynqly-Konto</Preview>
        <Container className="mx-auto my-0 py-0 px-5">
          <Section className="mt-8">
            <Img
              src={`${baseUrl}/Logo.webp`}
              width="180"
              height="100"
              alt="Zynqly"
            />
          </Section>
          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px]">
            Bestätigen Sie Ihr Zynqly-Konto
          </Heading>
          <Text className="text-xl mb-7.5">
            Danke für die Anmeldung! Verwenden Sie den unten stehenden Bestätigungscode, um Ihr Zynqly-Konto
             zu aktivieren und mit dem Fahren zu beginnen!
          </Text>

          <Section className="bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]">
            <Text className="text-3xl leading-[24px] text-center align-middle">
              {validationCode}
            </Text>
          </Section>

          <Text className="text-black text-sm leading-6">
            Wenn Sie kein Zynqly-Konto erstellt haben, können Sie diese E-Mail einfach ignorieren.
          </Text>

          <Section>
            <Row className="mb-8 pl-2 pr-2">
              <Column className="w-2/3">
                <Img
                  src={`${baseUrl}/Logo.webp`}
                  width="120"
                  height="70"
                  alt="Zynqly"
                />
              </Column>
              <Column align="right">
                <Link href="https://github.com/your-organization">
                  <Img
                    src={`${baseUrl}/email/github.png`}
                    width="32"
                    height="32"
                    alt="Github"
                    className="inline ml-2"
                  />
                </Link>
                <Link href="https://twitter.com/your-organization">
                  <Img
                    src={`${baseUrl}/email/x.png`}
                    width="32"
                    height="32"
                    alt="Twitter"
                    className="inline ml-2"
                  />
                </Link>
                <Link href="https://instagram.com/your-organization">
                  <Img
                    src={`${baseUrl}/email/instagram.png`}
                    width="32"
                    height="32"
                    alt="Instagram"
                    className="inline ml-2"
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          <Section>
            <Link
              className="text-[#b7b7b7] underline"
              href="https://zynqly.com/blog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://zynqly.com/legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Regeln
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://zynqly.com/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hilfezentrum
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://zynqly.com/community"
              target="_blank"
              rel="noopener noreferrer"
              data-auth="NotApplicable"
              data-linkindex="6"
            >
              Zynqly Community
            </Link>
            <Text className="text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7]">
              ©2025 Zynqly Inc. <br />
              Werk-VI-Straße 46, 8605 Kapfenberg <br />
              <br />
              Alle Rechte vorbehalten.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

Email.PreviewProps = {
  validationCode: 'ABC-123',
} as ZynqlyConfirmEmailProps;

export default Email;
