import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiGlobe, FiChevronDown, FiLogOut } from "react-icons/fi";
import logo from "../../assets/images/logo.png";
import { getAuthInfo } from "../../utils/auth";

const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

// Route onujayi navbar-er background color.
// Tailwind-er jonno class gulo pura static string hote hobe, tai alada alada lekha.
const getNavbarBg = (pathname: string) => {
  // Trailing slash soriye normalize (/login/ -> /login)
  const path = pathname.replace(/\/+$/, "") || "/";

  if (
    path === "/login" ||
    path === "/register" ||
    path === "/announcement/new"
  ) {
    return "bg-[#FAF9F7]";
  }

  if (path === "/pricing" || path === "/") {
    return "bg-[#FFFCF6]";
  }
  if(path === "/about"){
    return 'bg-[#FDFBF5]'
  }

  return "bg-white";
};

const Navbar = () => {
  const { t, i18n } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Login thakle user info, na thakle null
  const [userInfo, setUserInfo] = useState(getAuthInfo());

  const currentLanguage = i18n.language.split("-")[0];

  // Current route-er navbar background
  const navbarBg = getNavbarBg(location.pathname);
  //link come form common json
  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.pricing"), path: "/pricing" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.howItWorks"), path: "/how-work" },
    { name: t("navbar.rolse"), path: "/rolse" },
  ];

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language);
  };

  // Logout: localStorage theke user info remove kore home e pathabe
  const handleLogout = () => {
    try {
      localStorage.removeItem("authInfo");
    } catch {
      // localStorage access na pele ignore
    }
    setUserInfo(null);
    window.dispatchEvent(new Event("authChange"));
    setIsOpen(false);
    navigate("/");
  };

  // Login/logout hole ba onno tab e change hole navbar update hobe
  useEffect(() => {
    const syncAuth = () => setUserInfo(getAuthInfo());

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Scroll korle navbar-e shadow dekhabe
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);

    onScroll(); // page load e age thekei scroll kora thakle
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Close the mobile menu if the screen grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Desktop link: normal = primaryText, hover/active = myprimary.
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap  py-1.5 text-sm transition-colors duration-200 xl:text-base ${
      isActive
        ? "font-semibold text-myprimary"
        : "border-transparent font-medium text-primaryText hover:text-myprimary"
    }`;

  // Mobile link: normal = primaryText, active = myprimary text + left border
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block border-l-4 px-4 py-3 text-base transition-colors duration-200 ${
      isActive
        ? " bg-myprimary/5 font-semibold text-myprimary"
        : "border-transparent font-medium text-primaryText hover:bg-myprimary/5 hover:text-myprimary"
    }`;

  // Fixed-width language selector so changing language never shifts other items
  const LanguageSelect = ({ className = "" }: { className?: string }) => (
    <div
      className={`relative flex h-10 items-center rounded-lg border border-gray-200 bg-transparent transition-colors focus-within:border-myprimary focus-within:ring-2 focus-within:ring-myprimary/20 hover:border-myprimary ${className}`}
    >
      <FiGlobe className="pointer-events-none absolute left-3 text-base text-primaryText" />
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label={t("navbar.language")}
        className="h-full w-full cursor-pointer appearance-none bg-transparent pl-9 pr-8 text-sm text-primaryText outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 text-sm text-secondaryText" />
    </div>
  );

  // Login button: myprimary border + text, fills with myprimary on hover
  const loginClass =
    "inline-flex h-10 min-w-[84px] items-center justify-center whitespace-nowrap rounded-lg border border-myprimary px-4 text-sm font-medium text-myprimary transition hover:bg-myprimary hover:text-white active:scale-95 xl:text-base";

  // Register button: myprimary background
  const registerClass =
    "inline-flex h-10 min-w-[104px] items-center justify-center whitespace-nowrap rounded-lg border border-myprimary bg-myprimary px-5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-95 xl:text-base";

  // Logout button (desktop): myprimary background, icon + text
  const logoutClass =
    "inline-flex h-10 min-w-[104px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-myprimary bg-myprimary px-5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-95 xl:text-base";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${navbarBg} ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* 3 columns on desktop: logo | links (centered) | actions. */}
      <nav className="container flex items-center justify-between px-4 lg:px-10 py-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:py-4">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex shrink-0 items-center"
          aria-label="Home"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-7 w-auto object-contain sm:h-8"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={desktopLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <LanguageSelect className="w-[140px]" />

          {userInfo ? (
            // Login kora thakle: shudhu Logout button
            <button type="button" onClick={handleLogout} className={logoutClass}>
              <FiLogOut className="text-base" />
              <span>{t("navbar.logout")}</span>
            </button>
          ) : (
            // Login kora na thakle: Login + Register
            <>
              <NavLink to="/login" className={loginClass}>
                {t("navbar.login")}
              </NavLink>

              <NavLink to="/register" className={registerClass}>
                {t("navbar.register")}
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-primaryText transition-colors hover:bg-myprimary/10 hover:text-myprimary focus:outline-none focus-visible:ring-2 focus-visible:ring-myprimary/40 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          {/* Backdrop: tap outside to close */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-[57px] z-40 bg-black/30 lg:hidden"
          />

          <div
            id="mobile-menu"
            className={`relative z-50 max-h-[calc(100vh-57px)] overflow-y-auto border-t border-gray-100 px-4 py-4 shadow-lg sm:px-6 lg:hidden ${navbarBg}`}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="my-4 border-t border-gray-100" />

            {/* Mobile Language Selector */}
            <LanguageSelect className="w-full" />

            {userInfo ? (
              // Login kora thakle: shudhu Logout button
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-myprimary bg-myprimary px-4 text-center text-sm font-medium text-white transition hover:opacity-90 active:scale-95 sm:text-base"
                >
                  <FiLogOut className="text-base" />
                  <span>{t("navbar.logout")}</span>
                </button>
              </div>
            ) : (
              // Login kora na thakle: Login + Register
              <div className="mt-4 grid grid-cols-2 gap-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-myprimary px-4 text-center text-sm font-medium text-myprimary transition hover:bg-myprimary hover:text-white sm:text-base"
                >
                  {t("navbar.login")}
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-myprimary bg-myprimary px-4 text-center text-sm font-medium text-white transition hover:opacity-90 active:scale-95 sm:text-base"
                >
                  {t("navbar.register")}
                </NavLink>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;