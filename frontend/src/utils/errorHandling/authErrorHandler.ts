export function handleRegisterError(error: unknown): string {
  console.error(error);

  if (error instanceof Error) {
    if (error.message.startsWith("Empty Fields:")) {
      const fields = error.message.replace("Empty Fields: ", "");
      return `Fehler: Bitte füllen Sie alle erforderlichen Felder aus.\nFehlende Felder: ${fields}`;
    }

    switch (error.message) {
      case "Email already exists":
        return "Fehler: Diese Email wird bereits verwendet, Melden sie sich an oder Erstellen sie ein neues Konto mit einer anderen Email";
      case "FN already exists":
        return "Fehler: Diese Firmenbuchnummer wird bereits verwendet, Melden sie sich mit ihrer Email an";
      case "Phonenumber already exists":
        return "Fehler: Diese Telefonnumer wird bereits verwendet, Melden sie sich mit ihrer Email an oder geben sie eine neue Telefonnumer an ";
      case "ATU already exists":
        return "Fehler: Diese ATU-Nummer wird bereits verwendet, Melden sie sich mit ihrer Email an";
      case "Internal Server Error":
        return "Fehler: Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      case "Missing Fields":
        return "Fehler: Bitte füllen Sie alle erforderlichen Felder aus.";
      case "Network Error":
        return "Fehler: Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
      case "Timeout":
        return "Fehler: Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.";
      case "Response is Empty":
        return "Fehler: Der Server hat keine Antwort gesendet. Bitte versuchen Sie es erneut.";
      case "Conflict":
        return "Fehler: Ein Konflikt ist aufgetreten. Einige Ihrer Daten werden bereits verwendet.";
      default:
        return "Fehler: Registrierung fehlgeschlagen! Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.";
    }
  } else {
    return "Fehler: Registrierung fehlgeschlagen! Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.";
  }
}

export function handleLoginError(error: unknown): string {
  console.error(error);

  if (error instanceof Error) {
    switch (error.message) {
      case "User Not Found":
        return "Fehler: Kein Konto mit dieser E-Mail-Adresse gefunden. Bitte registrieren Sie sich oder überprüfen Sie Ihre E-Mail-Adresse.";
      case "Wrong Email or Password":
        return "Fehler: Ungültige E-Mail-Adresse oder falsches Passwort. Bitte versuchen Sie es erneut.";
      case "Internal Server Error":
        return "Fehler: Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      case "Missing Fields":
        return "Fehler: Bitte füllen Sie alle erforderlichen Felder aus.";
      case "Network Error":
        return "Fehler: Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
      case "Timeout":
        return "Fehler: Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.";
      case "Unauthorized":
        return "Fehler: Zugriff verweigert. Bitte überprüfen Sie Ihre Anmeldedaten.";
      default:
        return "Fehler: Login fehlgeschlagen! Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Kennwort.";
    }
  } else {
    return "Fehler: Login fehlgeschlagen! Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Kennwort.";
  }
}

export function handleLogoutError(error: unknown): string {
  console.error(error);

  if (error instanceof Error) {
    switch (error.message) {
      case "Missing Fields":
        return "Fehler: Fehlende Informationen. Bitte versuchen Sie es erneut.";
      case "User Not Found":
        return "Fehler: Benutzer nicht gefunden. Bitte melden Sie sich erneut an.";
      case "Internal Server Error":
        return "Fehler: Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      case "Network Error":
        return "Fehler: Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung.";
      case "Timeout":
        return "Fehler: Die Verbindung hat zu lange gedauert. Bitte versuchen Sie es erneut.";
      default:
        return "Fehler: Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.";
    }
  } else {
    return "Fehler: Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.";
  }
}

export function handleDeleteAccountError(error: unknown): string {
  console.error(error);

  if (error instanceof Error) {
    switch (error.message) {
      case "Invalid Password":
        return "Fehler: Falsches Passwort. Bitte versuchen Sie es erneut.";
      case "Missing Fields":
        return "Fehler: Fehlende Informationen. Bitte versuchen Sie es erneut.";
      case "User Not Found":
        return "Fehler: Benutzer nicht gefunden.";
      case "Unauthorized":
        return "Fehler: Nicht autorisiert. Bitte melden Sie sich an.";
      case "Internal Server Error":
        return "Fehler: Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      case "Network Error":
        return "Fehler: Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung.";
      case "Timeout":
        return "Fehler: Die Verbindung hat zu lange gedauert. Bitte versuchen Sie es erneut.";
      case "Guest User can not delete Account":
        return "Gast Nutzer kann sein Profil nicht löschen";
      default:
        return "Fehler: Konto konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.";
    }
  } else {
    return "Fehler: Konto konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.";
  }
}
