import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./certificates.module.css";
import { useTranslation } from "react-i18next";
import { getTextFileThunkCreator } from '../../reducers/filesReducer';

function CertificateItem(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [statusCertificateStyle, setStatusCertificateStyle] = useState('');

    const reverseTimeAndDate = (date) => {
        const parts = date.split('T');
        if (parts.length !== 2) {
            throw new Error("Неправильный формат даты и времени");
        }

        const dateParts = parts[0].split('-');
        if (dateParts.length !== 3) {
            throw new Error("Неправильный формат даты");
        }

        const timeParts = parts[1].split('.')[0].split(':');
        if (timeParts.length !== 3) {
            throw new Error("Неправильный формат времени");
        }

        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        const hours = timeParts[0];
        const minutes = timeParts[1];
        const secunds = timeParts[2];

        return `${day}.${month}.${year} ${hours}:${minutes}:${secunds}`;
    };

    const chooseStatus = (value) => {
        switch (value) {
            case "Created":
                setStatusCertificateStyle(styles.created);
                break;
            case "InProcess":
                setStatusCertificateStyle(styles.inProcess);
                break;
            case "Finished":
                setStatusCertificateStyle(styles.finished);
                break;
        }
    };

    const signature = () => {
        dispatch(getTextFileThunkCreator(props.signatureFile.id, 'Подпись'));
    };

    const certificate = () => {
        dispatch(getTextFileThunkCreator(props.certificateFile.id, 'Справка'));
    };

    useEffect(() => {
        const fetchData = async () => {
            chooseStatus(props.status);
        };

        fetchData();
    }, []);

    return (
        <div className={props.status == "Finished" ? styles.certificateItem1 : styles.certificateItem2}>
            <div className={styles.content}>
                <div className={styles.content2}>
                    <span className={styles.textHeader}>{t('certificateFrom')} </span>
                    <span className={styles.text}>{t('typeCertificate')}: {props.typeEnumDto ? props.typeEnumDto.displayName : null}</span>
                    {props.status == "Finished" ? (
                        <span className={styles.text}>{t('dateTimeCertificate')}: {reverseTimeAndDate(props.dateOfForming)}</span>
                    ) : null
                    }
                    <span className={styles.text}>{t('typeOfCertificate')}: {props.receiveTypeEnumDto.displayName}</span>
                </div>
                <div className={styles.buttonsFinished3}>
                    <span className={statusCertificateStyle}>{props.statusEnumDto.displayName}</span>
                </div>
            </div>
            <div className={styles.buttonsFinished2}>
                <div className={styles.signatureButton2} onClick={signature}>
                    <img src='./signature.png' className={styles.icon} />
                    <span className={styles.signatureText}>{t('signature')}</span>
                </div>
                <div className={styles.certificateButton2} onClick={certificate}>
                    <img src='./certificate.png' className={styles.icon} />
                    <span className={styles.certificateText}>{t('certificate')}</span>
                </div>
            </div>
            {(props.status == "Finished" && props.receiveType == "Electronic") ? (
                <div className={styles.buttonsFinished}>
                    <div className={styles.signatureButton} onClick={signature}>
                        <img src='./signature.png' className={styles.icon} />
                        <span className={styles.signatureText}>{t('signature')}</span>
                    </div>
                    <div className={styles.certificateButton} onClick={certificate}>
                        <img src='./certificate.png' className={styles.icon} />
                        <span className={styles.certificateText}>{t('certificate')}</span>
                    </div>
                    <span className={statusCertificateStyle}>{props.statusEnumDto.displayName}</span>
                </div>
            ) : (
                <div className={styles.buttonsFinished}>
                    <span className={statusCertificateStyle}>{props.statusEnumDto.displayName}</span>
                </div>
            )}
        </div >
    );
};

export default CertificateItem;