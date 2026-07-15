import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Facebook link read at build time from Vite env var with fallback
const FB_URL = import.meta.env.VITE_FACEBOOK_URL ?? "https://www.facebook.com/puuskulptuur";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="py-6 sm:py-10 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center">

        <div className="flex items-center justify-center sm:justify-start">
          <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="flex items-center justify-center w-8 h-8 rounded-md text-accent hover:brightness-120 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
              <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.2-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z" />
            </svg>
          </a>
        </div>

        <p className="font-body text-sm text-muted-foreground text-center">
          © 2026 Puuskulptuur. <span>{t("footer.rights")}</span>
        </p>

        <Link
            to="/admin/login"
            className="flex items-center justify-center sm:justify-end gap-1.5 font-body text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          <Lock className="w-3 h-3" />
          {t("footer.admin")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
