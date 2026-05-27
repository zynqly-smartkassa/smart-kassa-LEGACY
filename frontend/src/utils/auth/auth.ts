import axios, { AxiosError } from "axios";
import { AuthStorage } from "../secureStorage";
import type { AppDispatch } from "../../../redux/store";
import { getOrCreateDeviceId } from "./deviceId";
import { signInUser, signOutUser } from "../../../redux/slices/userSlice";
import { refreshAccessToken } from "./jwttokens";
import { setAuthenticated } from "../../../redux/slices/authSlice";
import { setLink } from "../../../redux/slices/footerLinksSlice";

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  fn: string,
  atu: string,
  dispatch: AppDispatch,
) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/register`,
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        password: password,
        fn: fn,
        atu: atu,
        device_id: await getOrCreateDeviceId(),
        user_agent: navigator.userAgent,
        device_name: navigator.platform + " " + navigator.appName,
      },
      { withCredentials: true }, // to set the refresh token in the Cookie
    );

    if (!data) {
      throw new Error("Response is Empty");
    }

    const accessToken = await data.accessToken;
    await AuthStorage.setAccessToken(accessToken);

    dispatch(
      signInUser({
        id: data.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      }),
    );

    dispatch(setAuthenticated());
    dispatch(setLink(1));

    return await data;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      // Network errors (no response from server)
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network Error");
      }

      // Timeout errors
      if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
        throw new Error("Timeout");
      }

      // Handle response status codes
      const status = error.response?.status;

      if (status === 400) {
        throw new Error("Missing Fields");
      } else if (status === 401) {
        throw new Error("Unauthorized");
      } else if (status === 409) {
        // Handle conflict errors (already exists)
        const errorMessage = error.response?.data.error;
        if (errorMessage === "User with this email already exists") {
          throw new Error("Email already exists");
        }
        if (
          errorMessage === `Ein Account mit der FN '${fn}' existiert bereits.`
        ) {
          throw new Error("FN already exists");
        }
        if (
          errorMessage ===
          `Ein Account mit der Telefonnumer '${phoneNumber}' existiert bereits.`
        ) {
          throw new Error("Phonenumber already exists");
        }
        if (
          errorMessage ===
          `Ein Account mit der ATU-Nummer '${atu}' existiert bereits.`
        ) {
          throw new Error("ATU already exists");
        }
        // Generic conflict error if specific error not matched
        throw new Error("Conflict");
      } else if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        throw new Error("Internal Server Error");
      } else {
        // Catch any other HTTP error codes
        throw new Error("Internal Server Error");
      }
    } else {
      // Non-axios errors
      throw new Error("Internal Server Error");
    }
  }
}

export async function login(
  email: string,
  password: string,
  dispatch: AppDispatch,
) {
  if (!email || !password) {
    throw new Error("Missing Fields");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`,
      {
        email: email,
        password: password,
        device_id: await getOrCreateDeviceId(),
        user_agent: navigator.userAgent,
        device_name: navigator.platform + " " + navigator.appName,
      },
      {
        withCredentials: true,
      },
    );
    const data = await response.data;
    const accessToken = await data.accessToken;

    if (!data) {
      throw new Error("Response is empty");
    }

    await AuthStorage.setAccessToken(accessToken);

    const user = data.user;
    dispatch(
      signInUser({
        id: user.userId,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1],
        email: user.email,
        phoneNumber: "phone number need implementation",
      }),
    );

    dispatch(setAuthenticated());
    dispatch(setLink(1));

    return await data;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      // Network errors (no response from server)
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network Error");
      }

      // Timeout errors
      if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
        throw new Error("Timeout");
      }

      // Handle response status codes
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error;

      if (status === 400) {
        // Check the specific error message from backend
        if (errorMessage === "User not found") {
          throw new Error("User Not Found");
        }
        if (errorMessage === "Missing required fields") {
          throw new Error("Missing Fields");
        }
        throw new Error("Missing Fields");
      } else if (status === 401) {
        // Wrong password
        throw new Error("Wrong Email or Password");
      } else if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        throw new Error("Internal Server Error");
      } else {
        // Catch any other HTTP error codes
        throw new Error("Internal Server Error");
      }
    } else {
      // Non-axios errors
      throw new Error("Internal Server Error");
    }
  }
}

export async function logOut(dispatch: AppDispatch, retry: boolean = true) {
  try {
    let accessToken: string | null;
    if (retry) {
      accessToken = await AuthStorage.getAccessToken();
    } else {
      accessToken = await refreshAccessToken();
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/logout`,
      {
        device_id: await getOrCreateDeviceId(),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      },
    );

    if (!response || !response.data) {
      throw new Error("Empty Response");
    }

    await AuthStorage.clearAccessToken();
    dispatch(signOutUser());
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      // Network errors (no response from server)
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network Error");
      }

      // Timeout errors
      if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
        throw new Error("Timeout");
      }

      // Handle response status codes
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error;
      const path = error.response?.data?.path;

      // Check for auth errors and retry with refreshed token
      const isAuthError =
        status === 403 || status === 401 || path === "auth middleware";

      if (isAuthError && retry) {
        return await logOut(dispatch, false);
      } else if (isAuthError && !retry) {
        throw new Error("Session Expired");
      }

      if (status === 400) {
        if (errorMessage === "Fields missing") {
          throw new Error("Missing Fields");
        }
        if (errorMessage === "User not found") {
          throw new Error("User Not Found");
        }
        throw new Error("Missing Fields");
      } else if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        throw new Error("Internal Server Error");
      } else {
        throw new Error("Logout Failed");
      }
    } else {
      throw new Error("Logout Failed");
    }
  }
}

export async function deleteAccount(
  password: string,
  dispatch: AppDispatch,
  retry: boolean = true,
) {
  try {
    let accessToken: string | null;
    if (retry) {
      accessToken = await AuthStorage.getAccessToken();
    } else {
      accessToken = await refreshAccessToken();
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/account`,
      {
        data: {
          password: password,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );

    if (!response || !response.data) {
      throw new Error("Empty Response");
    }

    await AuthStorage.clearAccessToken();
    dispatch(signOutUser());
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      // Network errors (no response from server)
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network Error");
      }

      // Timeout errors
      if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
        throw new Error("Timeout");
      }

      // Handle response status codes
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error;
      const path = error.response?.data?.path;

      // Check for auth errors (except invalid password) and retry with refreshed token
      const isAuthError =
        (status === 401 || path === "auth middleware") &&
        errorMessage !== "Invalid password";

      if (isAuthError && retry) {
        return await deleteAccount(password, dispatch, false);
      } else if (isAuthError && !retry) {
        throw new Error("Session Expired");
      }

      if (status === 400) {
        if (errorMessage === "Fields missing") {
          throw new Error("Missing Fields");
        }
        if (errorMessage === "User not found") {
          throw new Error("User Not Found");
        }
        throw new Error("Invalid Request");
      } else if (status === 401 && errorMessage === "Invalid password") {
        throw new Error("Invalid Password");
      } else if (status === 403) {
        throw new Error("Guest User can not delete Account");
      } else if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        throw new Error("Internal Server Error");
      } else {
        throw new Error("Delete Account Failed");
      }
    } else {
      throw new Error("Delete Account Failed");
    }
  }
}
