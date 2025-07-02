import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventByIdAdmin.module.css";
import { useTranslation } from "react-i18next";
import { getFileThunkCreator } from '../../../reducers/filesReducer';

const InternalParticipant = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (props.user) {
                const getAvatar = await dispatch(getFileThunkCreator(props.user.avatar.id));
                if (getAvatar != null) {
                    const imageObjectURL = URL.createObjectURL(getAvatar); // Создаем URL для изображения
                    setAvatar(imageObjectURL);
                }
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            {(props.chosenParticipant && props.participantType == "Inner") ? (
                <div className={styles.participantItem1}>
                    <div className={styles.avatarParticipant}>
                        <img src={avatar} className={styles.avatarParticipant} />
                    </div>
                    <div className={styles.participantForm}>
                        <span className={styles.nameParticipant}>{props.user.lastName} {props.user.firstName} {props.user.patronymic}</span>
                        <span className={styles.emailParticipant}>{props.user.email}</span>
                    </div>
                </div>
            ) : (
                null
            )}
            {(!props.chosenParticipant && props.participantType == "External") ? (
                <div className={styles.participantItem2}>
                    <div className={styles.form1}>
                        <span className={styles.nameParticipant}>{props.name}</span>
                        <span className={styles.emailParticipant}>{props.email}</span>
                        <span className={styles.emailParticipant}>{props.phone}</span>
                    </div>
                    {props.additionalInfo ? (
                        <div className={styles.form2}>
                            <span className={styles.emailParticipant}>{t('additionalInformation')}</span>
                            <span className={styles.emailParticipant2}>{props.additionalInfo}</span>
                        </div>
                    ) : (
                        null
                    )}
                </div>
            ) : (
                null
            )}
        </div>
    );
};

export default InternalParticipant;