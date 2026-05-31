import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { updateUser } from "../../../redux/slices/userSlice";
import { refreshAccessToken } from "../auth/jwttokens";
import { AuthStorage } from "../secureStorage";
import type { AppDispatch } from "../../../redux/store";

export async function updateProfile(
  retry: boolean = true,
  firstName: string,
  lastName: string,
  email: string,
  dispatch: AppDispatch,
) {
  let accessToken: string | null;
  if (retry) {
    accessToken = await AuthStorage.getAccessToken();
  } else {
    accessToken = await refreshAccessToken();
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/account/me`,
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    dispatch(
      updateUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    );

    toast.success("Profil erfolgreich aktualisiert");
  } catch (error) {
    if (error instanceof AxiosError) {
      const isAuthError =
        error.status === 401 ||
        error.response?.data?.path === "auth middleware";

      if (isAuthError && retry) {
        await updateProfile(false, firstName, lastName, email, dispatch);
      } else if (isAuthError && !retry) {
        // Second attempt failed - session expired
        throw new Error("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
      } else if (error.status === 409) {
        throw new Error(
          "Diese E-Mail-Adresse wird bereits verwendet. Bitte verwenden Sie eine andere E-Mail-Adresse.",
        );
      } else if (error.status === 400) {
        throw new Error(
          "Ungültige Eingabe. Bitte überprüfen Sie Ihre Angaben.",
        );
      } else if (error.status === 403) {
        throw new Error("Gast Nutzer kann sein Profil nicht verändern");
      } else {
        throw new Error(
          "Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
        );
      }
    } else {
      throw new Error(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      );
    }
  }
}
