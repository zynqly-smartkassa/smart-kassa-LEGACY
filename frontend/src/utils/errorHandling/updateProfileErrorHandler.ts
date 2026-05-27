export function handleUpdateProfileError(error: unknown) {
  if (error instanceof Error) {
    console.log(error);
    return error.message;
  } else
    return "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
}
