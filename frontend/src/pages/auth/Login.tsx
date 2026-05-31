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
import { useWarningToast } from "../../hooks/userfeedback/useToast";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { login } from "../../utils/auth/auth";
import { handleLoginError } from "../../utils/errorHandling";
import FormField from "../../components/inputs/Inputs";
import FormPasswordField from "../../components/inputs/PasswordInputs";

const loginSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    ),
  password: z.string().min(8, "Passwort braucht mindestens 8 Zeichen"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login page — users sign in with email and password.
 * Form state is managed by react-hook-form with Zod validation.
 */
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigator = useNavigate();

  const toastState = useSelector((state: RootState) => state.toastState);
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    toast.promise(
      async () => {
        await login(data.email, data.password, dispatch);
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
  };

  useWarningToast(
    toastState.showWarning,
    "Hinweis: Sie müssen sich anmelden oder registrieren, bevor Sie unseren Service nutzen können.",
    dispatch,
  );

  return (
    <main
      className="min-w-screen min-h-screen flex justify-center items-center bg-zinc-200
     dark:bg-black overflow-y-auto scrollbar-hide pt-5 md:pt-2"
    >
      <Card className="w-11/12 max-w-sm my-5 dark:bg-zinc-900 pt-4">
        <img
          src="Logo.webp"
          width={220}
          height={220}
          alt="Logo"
          className="mx-auto mb-2"
        />
        <CardHeader className="text-center">
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>
            Melden Sie sich mit Ihren Zugangsdaten an
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <FormField
                id="email"
                {...register("email")}
                label="E-Mail"
                type="email"
                placeholder="beispiel@domain.at"
                error={errors.email?.message}
                autoComplete="email"
                data-testid="email"
              />

              {/* Password with inline forgot-password link */}
              <div>
                <div className="flex items-center mb-2">
                  <label htmlFor="password" className="form-label">
                    Kennwort
                  </label>
                  <a href="#" className="auth-link-small">
                    Passwort vergessen?
                  </a>
                </div>
                <FormPasswordField
                  id="password"
                  {...register("password")}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((p) => !p)}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="current-password"
                  data-testid="password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="btn-auth-submit"
              variant="default"
              disabled={!isValid}
              data-testid="login"
            >
              Jetzt anmelden
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
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
                <p>Neu hier?</p>
                <Link
                  to="/register"
                  className="auth-link"
                  data-testid="registerLink"
                >
                  Konto erstellen
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default Login;
