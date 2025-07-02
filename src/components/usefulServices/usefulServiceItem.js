import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./usefulServices.module.css";
import { useTranslation } from "react-i18next";
import { getFileThunkCreator } from '../../reducers/filesReducer';

function UsefulServiceItem(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [logo, setLogo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (props.logo != null) {
                const getLogo = await dispatch(getFileThunkCreator(props.logo.id));

                if (getLogo != null) {
                    const imageObjectURL = URL.createObjectURL(getLogo); // Создаем URL для изображения
                    setLogo(imageObjectURL);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.usefulServiceItem}>
            <div className={styles.header}>
                <div className={styles.title1}>
                    <span>{props.title}</span>
                </div>
                <div className={styles.linkButton1}>
                    <a href={props.link} target="_blank" rel="noopener noreferrer" className={styles.linkText}>{t('goToSite')}</a>
                    <img src={"./ArrowUpRight.png"} className={styles.icon} />
                </div>
            </div>
            <div className={styles.content1}>
                <div>
                    {logo != null ? (
                        <img src={logo} className={styles.logo} />
                    ) : (
                        <div className={styles.logo}></div>
                    )}
                </div>
                <div className={styles.body}>
                    <span className={styles.description}>{props.description}</span>
                    <span className={styles.text}>{t('termsOfDisctribution')}</span>
                    <span className={styles.answer}>{props.termsOfDisctribution}</span>
                </div>
            </div>
            <div className={styles.content2}>
                <div>
                    {logo != null ? (
                        <img src={logo} className={styles.logo} />
                    ) : (
                        <div className={styles.logo}></div>
                    )}
                </div>
                <div className={styles.title2}>
                    <span>{props.title}</span>
                </div>
                <div className={styles.body}>
                    <span className={styles.description}>{props.description}</span>
                    <span className={styles.text}>{t('termsOfDisctribution')}</span>
                    <span className={styles.answer}>{props.termsOfDisctribution}</span>
                </div>
                <div className={styles.linkButton2}>
                    <a href={props.link} target="_blank" rel="noopener noreferrer" className={styles.linkText}>{t('goToSite')}</a>
                    <img src={"./ArrowUpRight.png"} className={styles.icon} />
                </div>
            </div>
        </div>
    );
};

export default UsefulServiceItem;