import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

/* Tomar navbar-er asol height (px) ekhane dao. Navbar + login = exactly 100vh */
const NAVBAR_HEIGHT = 72;

type Role = 'admin' | 'user';

interface AuthInfo {
  email: string;
  name: string;
  userId: string;
  role: Role;
}

interface DemoUser extends AuthInfo {
  password: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    email: 'admin123@gmail.com',
    password: 'admin123',
    name: 'Admin',
    userId: 'admin-001',
    role: 'admin',
  },
  {
    email: 'rahim123@gmail.com',
    password: 'rahim4061',
    name: 'Rahim',
    userId: 'user-001',
    role: 'user',
  },
];

/* Input + button-er common style (height screen-er height onujayi chhoto hoy) */
const inputClass =
  'w-full h-10 sm:h-11 px-3.5 rounded-lg border border-[#E5E7EB] bg-white ' +
  'text-base sm:text-sm text-[#222831] font-poppins ' +
  'placeholder:text-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-myprimary/25 focus:border-myprimary ' +
  'transition-all disabled:opacity-60 ' +
  '[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#fff]';

const labelClass =
  'block text-[13px] font-medium text-[#222831] font-poppins leading-normal';

const Login: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Login successful hole 1.2s por home page e redirect
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate('/'), 1200);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const matchedUser = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      setError(
        t('login.invalidCredentials', {
          defaultValue: 'Email ou mot de passe incorrect.',
        })
      );
      return;
    }

    const authInfo: AuthInfo = {
      email: matchedUser.email,
      name: matchedUser.name,
      userId: matchedUser.userId,
      role: matchedUser.role,
    };

    try {
      localStorage.setItem('authInfo', JSON.stringify(authInfo));
      window.dispatchEvent(new Event('authChange'));
    } catch {
      setError(
        t('login.storageError', {
          defaultValue: 'Impossible de sauvegarder la session.',
        })
      );
      return;
    }

    setSuccess(true);
  };

  return (
    <section
      className="w-full bg-[#FAF9F7] flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6"
      style={{ minHeight: `calc(100dvh - ${NAVBAR_HEIGHT}px)` }}
    >
      {/* Card: shob device e alada white card, background er upor */}
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
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-[#2D3748]">
            {t('login.title')}
          </h1>
          <p className="text-[13px] sm:text-sm text-secondaryText font-poppins leading-relaxed">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Success / Error message */}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[13px] text-green-700 font-poppins"
          >
            <FiCheckCircle className="shrink-0 text-base" />
            <span>
              {t('login.success', {
                defaultValue: 'Connexion réussie ! Redirection...',
              })}
            </span>
          </div>
        )}

        {error && !success && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-600 font-poppins"
          >
            <FiAlertCircle className="shrink-0 text-base" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[clamp(0.625rem,1.8vh,1rem)]"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className={labelClass}>
              {t('login.emailLabel')}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={success}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="login-password" className={labelClass}>
                {t('login.passwordLabel')}
              </label>
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
                    ? t('login.hidePassword')
                    : t('login.showPassword')}
                </span>
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={success}
              className={inputClass}
            />
          </div>

          {/* Submit + Forgot password */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-1">
            <button
              type="submit"
              disabled={success}
              className="h-10 sm:h-11 min-w-[120px] px-6 rounded-lg bg-myprimary text-white text-sm font-medium font-poppins hover:bg-[#31695b] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {t('login.submitButton')}
            </button>

            <a
              href="#forgot"
              className="text-[13px] font-semibold text-[#222831] font-poppins hover:underline"
            >
              {t('login.forgotPassword')}
            </a>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-grow border-t border-[#E5E7EB]" />
          <span className="text-[13px] text-[#222831] font-poppins text-center">
            {t('login.orDivider')}
          </span>
          <div className="flex-grow border-t border-[#E5E7EB]" />
        </div>

        {/* Google button */}
        <button
          type="button"
          className="w-full h-10 sm:h-11 flex items-center justify-center gap-2.5 rounded-lg border border-[#9CA3AF] bg-white text-[#222831] text-sm font-medium font-poppins hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer"
        >
          <FcGoogle className="text-lg" />
          <span>{t('login.googleButton')}</span>
        </button>

        {/* Footer */}
        <div className="space-y-1 text-left">
          <p className="text-xs text-secondaryText font-poppins leading-relaxed">
            {t('login.noAccountText')}
          </p>
          <a
            href="#register"
            className="inline-block text-[13px] font-semibold text-myprimary font-poppins hover:underline"
          >
            {t('login.registerLink')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Login;