import { useEffect } from "react";
import styles from "./flag.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Flag = () => {
    const { i18n } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'Русский', flag: "/rusFlag.svg" });
    const languages = [
        { code: 'en', name: 'English', flag: "/engFlag.svg" },
        { code: 'ru', name: 'Русский', flag: "/rusFlag.svg" }
    ];

    const openMenu = () => setIsOpen(!isOpen);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setIsOpen(false);
        i18n.changeLanguage(language.code);
        localStorage.setItem('selectedLanguage', language.code);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
            const selectedLang = languages.find(lang => lang.code === savedLanguage);
            if (selectedLang) {
                setSelectedLanguage(selectedLang);
            }
        }

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <div className={styles.flagContainer}>
            <div className={windowWidth > 1200 ? styles.language : styles.languageSmall}>
                <div className={windowWidth > 1200 ? styles.selectTrigger : styles.selectTriggerSmall} onClick={openMenu}>
                    {windowWidth > 1200 ? selectedLanguage.name : null}<img src={selectedLanguage.flag} alt={selectedLanguage.name} className={styles.flag} />
                    <img src={isOpen ? "/strelkaUp.png" : "/strelkaDown.png"} className={styles.strelka} />
                </div>
                {isOpen && (
                    <div className={windowWidth > 1200 ? styles.selectOptions : styles.selectOptionsSmall}>
                        {languages.map((language, index) => (
                            <div key={language.code}>
                                <div className={styles.option} onClick={() => handleLanguageSelect(language)}>
                                    {windowWidth > 1200 ? language.name : null}
                                    <img src={language.flag} alt={language.name} className={styles.flags} />
                                </div>
                                {index < languages.length - 1 && <div className={styles.line}></div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flag;