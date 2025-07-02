import { useEffect } from "react";
import styles from "./profile.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";

const PersonalData = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [profile, setProfile] = useState();

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getProfileThunkCreator());
            setProfile(getProfile);
        };

        fetchData();
    }, []);

    return (
        <div className={styles.personalData}>
            <div className={styles.personalDataHeader}>{t('personalDate')}</div>
            <div className={styles.personalDataForm}>
                <span className={styles.text}>{t('gender')}</span>
                <span className={styles.answer}>{profile?.gender}</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.personalDataForm}>
                <span className={styles.text}>{t('birthDate')}</span>
                <span className={styles.answer}>{formatDate(profile?.birthDate)}</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.personalDataForm}>
                <span className={styles.text}>{t('citizenship')}</span>
                <span className={styles.answer}>{profile?.citizenship !== null ? profile?.citizenship.name : null}</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.personalDataForm}>
                <span className={styles.text}>{t('snils')}</span>
                <span className={styles.answer}></span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.personalDataForm}>
                <span className={styles.text}>Email</span>
                <span className={styles.answer}>{profile?.email}</span>
            </div>
        </div>
    );
};

export default PersonalData;