import {useEffect, useLayoutEffect, useState} from "react";
import {Globe, Moon, Sun, Menu, X} from "lucide-react";
import {useLanguage, type Lang} from "@/lib/i18n";

interface NavbarProps {
    onNavigate: (section: string) => void;
}

// Facebook link read at build time from Vite env var with fallback
const FB_URL = import.meta.env.VITE_FACEBOOK_URL ?? "https://www.facebook.com/puuskulptuur";

const Navbar = ({onNavigate}: NavbarProps) => {
    const [langOpen, setLangOpen] = useState(false);
    const {lang, setLang, t} = useLanguage();

    const langs: { code: Lang; label: string }[] = [
        {code: "et", label: "ET"},
        {code: "en", label: "EN"},
    ];

    const [isDark, setIsDark] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    const navItems = [
        {id: "gallery", label: t("nav.gallery")},
        {id: "about", label: t("nav.about")},
        {id: "featured", label: t("nav.featured")},
        {id: "contact", label: t("nav.contact")},
    ];

    useEffect(() => {
        if (mobileOpen) {
            const previousOverflow = document.body.style.overflow;
            const previousPaddingRight = document.body.style.paddingRight;

            return () => {
                document.body.style.overflow = previousOverflow;
                document.body.style.paddingRight = previousPaddingRight;
            };
        }
    }, [mobileOpen]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-6">
                    <button type="button" onClick={() => onNavigate("hero")}
                            className="mb-0.5 font-display text-xl font-bold text-foreground hover:text-accent transition-colors pointer-events-auto">
                        Puuskulptuur
                    </button>
                    <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"
                       className="flex items-center justify-center w-8 h-8 rounded-md text-accent hover:brightness-120 transition-colors pointer-events-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"
                             fill="currentColor" aria-hidden>
                            <path
                                d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.2-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z"/>
                        </svg>
                    </a>
                </div>
                <div className="flex items-center gap-1 sm:gap-6">
                    {/* mobile menu button */}
                    <button type="button" onClick={() => setMobileOpen((v) => !v)}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden p-2 rounded-md text-foreground hover:bg-muted pointer-events-auto">
                        {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                    </button>
                    <div className="hidden sm:flex items-center gap-2">
                        {navItems.map((item) => (
                            <button key={item.id} onClick={() => onNavigate(item.id)}
                                    className="font-body text-sm font-medium text-foreground hover:text-accent transition-colors">
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Language switcher */}
                    <div className="relative">
                        <button onClick={() => setLangOpen((v) => !v)}
                                onBlur={() => setTimeout(() => setLangOpen(false), 150)} aria-label={t("lang.label")}
                                className="flex items-center gap-1 p-2 rounded-md text-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <Globe className="w-4 h-4"/>
                            <span className="font-body text-xs font-semibold uppercase">{lang}</span>
                        </button>
                        {langOpen && (
                            <div
                                className="absolute right-0 top-full z-40 mt-1 min-w-10 rounded-md border border-border bg-popover shadow-card overflow-hidden">
                                {langs.map((l) => (
                                    <button key={l.code} onMouseDown={(e) => {
                                        e.preventDefault();
                                        setLang(l.code);
                                        setLangOpen(false);
                                    }}
                                            className={`block w-full text-left px-3 py-2 font-body text-xs font-medium transition-colors ${
                                                lang === l.code
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-foreground hover:text-foreground hover:bg-muted"
                                            }`}>
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={toggleTheme} aria-label={t("theme.toggle")}
                            className="p-2 rounded-md text-foreground hover:text-accent hover:bg-muted transition-colors">
                        {isDark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                    </button>
                </div>
            </div>
            {/* mobile full screen menu: use an overlay + popover so colors stay readable in both themes */}
            {mobileOpen && (
                <div className="fixed inset-0 z-9000 sm:hidden pointer-events-none">
                    {/* dimming overlay (click to close) */}
                    <div
                        // don't cover the fixed header so the theme toggle and other header controls remain usable
                        className="absolute top-16 left-0 right-0 bottom-0 bg-foreground/90 backdrop-blur-sm z-8900 pointer-events-auto"
                        onClick={() => setMobileOpen(false)}/>

                    {/* centered popover sheet for menu items */}
                    <div className="relative z-9000 flex items-start justify-center pt-16 pointer-events-none">
                        <div
                            className="w-full max-w-lg mx-4 bg-popover/97 text-popover-foreground rounded-xl px-4 py-6 flex flex-col items-center gap-6 z-10000 pointer-events-auto shadow-md"
                            onClick={(e) => e.stopPropagation()}>
                            {navItems.map((item) => (
                                <button type="button" key={item.id} onClick={() => {
                                    onNavigate(item.id);
                                    setMobileOpen(false);
                                }}
                                        className="text-xl font-medium text-popover-foreground hover:text-accent transition-colors pointer-events-auto">
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
