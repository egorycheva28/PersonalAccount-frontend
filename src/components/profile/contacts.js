import { useEffect } from "react";
import styles from "./profile.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";

const Contacts = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [profile, setProfile] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getProfileThunkCreator());
            setProfile(getProfile);
        };

        fetchData();
    }, []);

    return (
        <div className={profile?.contacts.length !== 0 ? styles.contacts : styles.contacts2}>
            <div className={styles.contactsHeader}>{t('contacts')}</div>
            < div className={styles.contactsForm}>
                <span className={styles.text}>{t('phone')}</span>
                <span className={styles.answer}>{profile?.contacts.length !== 0 ? (profile?.contacts[0].value) : (null)}</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.contactsForm}>
                <span className={styles.text}>{t('phone2')}</span>
                <span className={styles.answer}></span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.contactsForm}>
                <span className={styles.text}>{t('addEmail')}</span>
                <span className={styles.answer}></span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.contactsForm}>
                <span className={styles.text}>{t('address')}</span>
                <span className={styles.answer}>{profile?.address}</span>
            </div>
        </div>
    );
};

export default Contacts;