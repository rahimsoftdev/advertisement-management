import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import {
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import type { AuthInfo } from "../utils/auth";

/* Code ta ei value hole match hobe (demo) */
const DEMO_CODE = "123456";
const MIN_PASSWORD_LENGTH = 6;

/* Login page er moto same style */
const inputClass =
  "w-full h-10 sm:h-11 px-3.5 rounded-lg border border-[#E5E7EB] bg-white " +
  "text-base sm:text-sm text-[#222831] font-poppins " +
  "placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-myprimary/25 focus:border-myprimary " +
  "transition-all disabled:opacity-60 " +
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#fff]";

const labelClass =
  "block text-[13px] font-medium text-[#222831] font-poppins leading-normal";

const titleClass =
  "text-xl sm:text-2xl font-bold leading-snug tracking-tight text-[#2D3748]";

const subtitleClass =
  "text-[13px] sm:text-sm text-secondaryText font-poppins leading-relaxed";

/* "Suivant" button: fill na hole dhushor, fill hole primary green */
const nextButtonClass = (enabled: boolean) =>
  "h-10 sm:h-11 min-w-[150px] px-8 rounded-lg text-sm font-medium font-poppins transition-all " +
  (enabled
    ? "bg-myprimary text-white hover:bg-[#31695b] active:scale-[0.98] cursor-pointer"
    : "bg-[#D1D5DB] text-white cursor-not-allowed");

/* ex***@gmail.com */
const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
};

const Register: React.FC = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);

  /* Success hole 1.8s por home page e redirect */
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/"), 1800);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  /* authInfo localStorage e save + navbar ke janano */
  const saveAuthAndFinish = (authInfo: AuthInfo) => {
    try {
      localStorage.setItem("authInfo", JSON.stringify(authInfo));
      window.dispatchEvent(new Event("authChange"));
    } catch {
      setError(
        t("register.storageError", {
          defaultValue: "Impossible de sauvegarder la session.",
        })
      );
      return;
    }
    setSuccess(true);
  };

  /* Google diye register: direct success */
const handleGoogle = () => {
  const userInfo: AuthInfo = {
    email: "rahim1234@gmail.com",
    name: "rahim1234",
    userId: "user-google-001",
    role: "user",
    credit: 1,
  };

  saveAuthAndFinish(userInfo);
};

 

  const goNext = () => {
    setError("");
    setNotice("");
    setStep((prev) => prev + 1);
  };

  /* Step 1 -> 2 */
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    goNext();
  };

  /* Step 2 -> 3 */
  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    goNext();
  };

  /* Step 3 -> 4 : code 123456 hole-i jabe */
  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");

    if (code.trim() !== DEMO_CODE) {
      setError(
        t("register.step3.codeMismatch", {
          defaultValue: "Le code ne correspond pas. Veuillez réessayer.",
        })
      );
      return;
    }
    goNext();
  };

  const handleResend = () => {
    setError("");
    setCode("");
    setNotice(
      t("register.step3.codeResent", {
        defaultValue: "Un nouveau code a été envoyé.",
      })
    );
  };

  /* Step 4: final submit */
  const handleStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        t("register.step4.passwordTooShort", {
          defaultValue: "Le mot de passe doit contenir au moins 6 caractères.",
          count: MIN_PASSWORD_LENGTH,
        })
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        t("register.step4.passwordMismatch", {
          defaultValue: "Les mots de passe ne correspondent pas.",
        })
      );
      return;
    }

    saveAuthAndFinish({
      email: email.trim().toLowerCase(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      userId: `user-${Date.now()}`,
      role: "user",
      credit:1
    });
  };

  const canNext1 = firstName.trim() !== "" && lastName.trim() !== "";
  const canNext2 = email.trim() !== "";
  const canNext3 = code.trim() !== "";
  const canNext4 = password !== "" && confirmPassword !== "";

  /* Error / notice banner */
  const Banner = () => (
    <>
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-600 font-poppins"
        >
          <FiAlertCircle className="shrink-0 text-base" />
          <span>{error}</span>
        </div>
      )}
      {notice && !error && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[13px] text-green-700 font-poppins"
        >
          <FiCheckCircle className="shrink-0 text-base" />
          <span>{notice}</span>
        </div>
      )}
    </>
  );

  return (
    <section className="w-full bg-[#FAF9F7] flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 min-h-[calc(100dvh-64px)] lg:min-h-[calc(100dvh-72px)]">
      <div
        className="
          w-full max-w-[440px]
          flex flex-col
          gap-[clamp(0.75rem,2.2vh,1.25rem)]
          bg-white rounded-2xl border border-[#E5E7EB]
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          px-5 py-[clamp(1.25rem,3.5vh,2.25rem)]
          min-[400px]:px-6 sm:px-8
        "
      >
        {/* ================= SUCCESS ================= */}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center text-center gap-3 py-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <FiCheckCircle className="text-4xl text-myprimary" />
            </div>
            <h1 className={titleClass}>
              {t("register.success.title", {
                defaultValue: "Inscription réussie !",
              })}
            </h1>
            <p className={subtitleClass}>
              {t("register.success.subtitle", {
                defaultValue:
                  "Votre compte a été créé. Redirection vers l'accueil...",
              })}
            </p>
            <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-full origin-left animate-[grow_1.8s_linear] bg-myprimary" />
            </div>
            <style>{`@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
          </div>
        )}

        {/* ================= STEP 1: Name ================= */}
        {!success && step === 1 && (
          <>
            <div className="space-y-1">
              <h1 className={titleClass}>{t("register.step1.title")}</h1>
              <p className={subtitleClass}>{t("register.step1.subtitle")}</p>
            </div>

            <Banner />

            <form
              onSubmit={handleStep1}
              className="flex flex-col gap-[clamp(0.625rem,1.8vh,1rem)]"
            >
              <div className="space-y-1.5">
                <label htmlFor="reg-first" className={labelClass}>
                  {t("register.step1.firstNameLabel")}
                </label>
                <input
                  id="reg-first"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-last" className={labelClass}>
                  {t("register.step1.lastNameLabel")}
                </label>
                <input
                  id="reg-last"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={!canNext1}
                  className={nextButtonClass(canNext1)}
                >
                  {t("register.step1.nextButton")}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-grow border-t border-[#E5E7EB]" />
              <span className="text-[13px] text-[#222831] font-poppins text-center">
                {t("register.step1.orDivider")}
              </span>
              <div className="flex-grow border-t border-[#E5E7EB]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full h-10 sm:h-11 flex items-center justify-center gap-2.5 rounded-lg border border-[#9CA3AF] bg-white text-[#222831] text-sm font-medium font-poppins hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer"
            >
              <FcGoogle className="text-lg" />
              <span>{t("register.step1.googleButton")}</span>
            </button>

            {/* Login link */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-xs sm:text-[13px] font-semibold text-myprimary font-poppins hover:underline"
              >
                {t("register.step1.loginText")}
              </Link>
            </div>
          </>
        )}

        {/* ================= STEP 2: Email ================= */}
        {!success && step === 2 && (
          <>
            <div className="space-y-1">
              <h1 className={titleClass}>{t("register.step2.title")}</h1>
            </div>

            <Banner />

            <form
              onSubmit={handleStep2}
              className="flex flex-col gap-[clamp(0.625rem,1.8vh,1rem)]"
            >
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className={labelClass}>
                  {t("register.step2.emailLabel")}
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={!canNext2}
                  className={nextButtonClass(canNext2)}
                >
                  {t("register.step2.nextButton")}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ================= STEP 3: Code ================= */}
        {!success && step === 3 && (
          <>
            <div className="space-y-1">
              <h1 className={titleClass}>{t("register.step3.title")}</h1>
              <p className={subtitleClass}>
                {t("register.step3.subtitle", { email: maskEmail(email) })}
              </p>
            </div>

            <Banner />

            <form
              onSubmit={handleStep3}
              className="flex flex-col gap-[clamp(0.625rem,1.8vh,1rem)]"
            >
              <div className="space-y-1.5">
                <label htmlFor="reg-code" className={labelClass}>
                  {t("register.step3.codeLabel")}
                </label>
                <input
                  id="reg-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (error) setError("");
                  }}
                  className={inputClass}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[11px] text-secondaryText hover:text-[#222831] font-poppins cursor-pointer transition-colors"
                  >
                    {t("register.step3.resendLink")}
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={!canNext3}
                  className={nextButtonClass(canNext3)}
                >
                  {t("register.step3.nextButton")}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ================= STEP 4: Password ================= */}
        {!success && step === 4 && (
          <>
            <div className="space-y-1">
              <h1 className={titleClass}>{t("register.step4.title")}</h1>
              <p className={subtitleClass}>{t("register.step4.subtitle")}</p>
            </div>

            <Banner />

            <form
              onSubmit={handleStep4}
              className="flex flex-col gap-[clamp(0.625rem,1.8vh,1rem)]"
            >
              <div className="space-y-1.5">
                <label htmlFor="reg-pass" className={labelClass}>
                  {t("register.step4.passwordLabel")}
                </label>
                <input
                  id="reg-pass"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-confirm" className={labelClass}>
                  {t("register.step4.confirmPasswordLabel")}
                </label>
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className={inputClass}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex items-center gap-1 text-xs text-secondaryText hover:text-[#222831] font-poppins cursor-pointer transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-sm" />
                    ) : (
                      <FiEye className="text-sm" />
                    )}
                    <span>
                      {showPassword
                        ? t("register.step4.hidePassword")
                        : t("register.step4.showPassword")}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={!canNext4}
                  className={nextButtonClass(canNext4)}
                >
                  {t("register.step4.nextButton")}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Register;