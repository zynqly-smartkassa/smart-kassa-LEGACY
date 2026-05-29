import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useWarningToast } from "../../hooks/userfeedback/useToast";
import { register as registerUser } from "../../utils/auth/auth";
import { handleRegisterError } from "../../utils/errorHandling";
import FormField from "../../components/inputs/Inputs";
import FormPasswordField from "../../components/inputs/PasswordInputs";
import { useCheckForNews } from "../../hooks/userfeedback/useNews";
import { login } from "../../utils/auth/auth";
import { handleLoginError } from "../../utils/errorHandling";

const registerSchema = z
  .object({
    vorname: z.string().trim().min(1, "Bitten geben Sie ihren Vornamen ein"),
    nachname: z.string().trim().min(1, "Bitten geben Sie ihren Nachnamen ein"),
    email: z
      .string()
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      ),
    telefon: z
      .string()
      .min(7, "Bitte geben Sie eine gültige Telefonnummer ein (7-20 Zeichen)")
      .regex(
        /^[\d\s+()-]{7,20}$/,
        "Bitte geben Sie eine gültige Telefonnummer ein (7-20 Zeichen)",
      ),
    firmenbuchnummer: z
      .string()
      .regex(
        /^FN\d{6}[a-z]$/,
        "Bitte geben Sie eine gültige Firmenbuchnummer ein (Format:FN123456a)",
      ),
    atu: z
      .string()
      .transform((val) => val.trim().replace(/[\s/]/g, ""))
      .pipe(
        z
          .string()
          .regex(
            /^ATU\d{9}$/,
            "Bitte geben Sie eine gültige Umsatzsteuer-ID ein (Format: ATU123456789)",
          ),
      ),
    password: z
      .string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen enthalten")
      .regex(/[0-9]/, "Das Passwort muss mindestens eine Zahl enthalten")
      .regex(
        /[!@#$%^&*()§_+=[\]{};':"\\|,.<>/?-]/,
        "Das Passwort muss mindestens ein Sonderzeichen enthalten",
      ),
    confirmPassword: z.string().min(1, "Bitte bestätigen Sie Ihr Passwort"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register page — users create a new account.
 * Form state is managed by react-hook-form with Zod validation.
 */
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useCheckForNews(isRegistered);
  const navigator = useNavigate();

  const toastState = useSelector((state: RootState) => state.toastState);
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  useWarningToast(
    toastState.showWarning,
    "Hinweis: Sie müssen sich anmelden oder registrieren, bevor Sie unseren Service nutzen können.",
    dispatch,
  );

  const onSubmit = async (data: RegisterFormData) => {
    toast.promise(
      async () => {
        await registerUser(
          data.vorname,
          data.nachname,
          data.email,
          data.telefon,
          data.password,
          data.firmenbuchnummer,
          data.atu,
          dispatch,
        );
      },
      {
        loading: "Registrierung...",
        success: async () => {
          await navigator("/");
          setIsRegistered(true);
          return "Erfolg: Registrierung erfolgreich! Sie werden jetzt weitergeleitet";
        },
        error: (err) => handleRegisterError(err),
        className: "mt-5 md:mt-0",
      },
    );
  };

  return (
    <main className="py-7 min-w-screen min-h-screen flex justify-center items-center bg-zinc-200 dark:bg-black overflow-y-auto scrollbar-hide pt-5 md:pt-2">
      <Card className="w-11/12 max-w-sm md:max-w-xl my-5 dark:bg-zinc-900 pt-4">
        <img
          src="Logo.webp"
          width={220}
          height={220}
          alt="Logo"
          className="mx-auto mb-2"
        />
        <CardHeader className="text-center">
          <CardTitle>Konto erstellen</CardTitle>
          <CardDescription>
            Bitte geben Sie Ihre Daten ein, um ein Konto zu erstellen
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="vorname"
                  {...register("vorname")}
                  label="Vorname"
                  type="text"
                  placeholder="Max"
                  error={errors.vorname?.message}
                  autoComplete="given-name"
                  data-testid="vorname"
                />
                <FormField
                  id="nachname"
                  {...register("nachname")}
                  label="Nachname"
                  type="text"
                  placeholder="Mustermann"
                  error={errors.nachname?.message}
                  autoComplete="family-name"
                  data-testid="nachname"
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="email"
                  {...register("email")}
                  label="E-Mail-Adresse"
                  type="email"
                  placeholder="beispiel@domain.at"
                  error={errors.email?.message}
                  autoComplete="email"
                  data-testid="email"
                />
                <FormField
                  id="Telefonnummer"
                  {...register("telefon")}
                  label="Telefonnummer"
                  type="tel"
                  placeholder="+43 660 1234567"
                  error={errors.telefon?.message}
                  autoComplete="tel"
                  data-testid="Telefonnummer"
                />
              </div>

              {/* Business */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="FirmenBuchNummer"
                  {...register("firmenbuchnummer")}
                  label="Firmenbuchnummer (FN)"
                  type="text"
                  placeholder="FN123456a"
                  error={errors.firmenbuchnummer?.message}
                  autoComplete="off"
                  data-testid="FirmenBuchNummer"
                />
                <FormField
                  id="ATU"
                  {...register("atu")}
                  label="Umsatzsteuer-ID (ATU)"
                  type="text"
                  placeholder="ATU123456789"
                  error={errors.atu?.message}
                  autoComplete="off"
                  data-testid="ATU"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormPasswordField
                  id="password"
                  {...register("password")}
                  label="Kennwort"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((p) => !p)}
                  placeholder="••••••••"
                  title="Über 6 Zeichen mit einer Zahl und einem Zeichen"
                  error={errors.password?.message}
                  autoComplete="new-password"
                  data-testid="password"
                />
                <FormPasswordField
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  label="Kennwort bestätigen"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword((p) => !p)}
                  placeholder="••••••••"
                  title="Über 6 Zeichen mit einer Zahl und einem Zeichen"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  data-testid="confirmPassword"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="btn-auth-submit"
              disabled={!isValid}
              data-testid="registerButton"
            >
              Jetzt registrieren
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              data-testid="login"
              onClick={() => {
                toast.promise(
                  async () => {
                    await login(
                      "guestaccount@gmail.com",
                      "Passwort#1",
                      dispatch,
                    );
                  },
                  {
                    loading: "Anmelden...",
                    success: async () => {
                      await navigator("/");
                      return "Erfolg: Login erfolgreich! Sie werden weitergeleitet...";
                    },
                    error: (err) => handleLoginError(err),
                    className: "mt-5 md:mt-0",
                  },
                );
              }}
            >
              Als Gast Fortfahren
            </Button>
            <div className="w-full flex justify-center mt-2 text-center">
              <div className="text-sm text-muted-foreground">
                <p>Bereits registriert?</p>
                <Link to="/login" className="auth-link" data-testid="loginLink">
                  Jetzt anmelden
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default Register;
