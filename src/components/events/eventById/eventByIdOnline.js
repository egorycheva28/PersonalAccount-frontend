import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventById.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { getEventByIdThunkCreator } from '../../../reducers/eventsReducer';
import { getFileThunkCreator } from '../../../reducers/filesReducer';

const EventByIdOnline = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [click, setClick] = useState(false);
    const [event, setEvent] = useState();
    const [picture, setPicture] = useState();

    const translateFormat = {
        "Online": "Онлайн",
        "Offline": "Офлайн"
    }

    const handleClick = () => setClick(!click);

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    useEffect(() => {
        const fetchData = async () => {
            const getEvent = await dispatch(getEventByIdThunkCreator(id));
            if (getEvent && getEvent.error === 500) {
                navigate('/error500');
            }

            setEvent(getEvent);

            if (getEvent.picture != null) {
                const getPicture = await dispatch(getFileThunkCreator(getEvent.picture.id));
                if (getPicture != null) {
                    const imageObjectURL = URL.createObjectURL(getPicture); // Создаем URL для изображения
                    setPicture(imageObjectURL);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.row1}>
                <div className={styles.description}>
                    <span className={styles.descriptionHeader}>{t('description')}</span>
                    {click ? (
                        <img src='/strelkaUp.png' className={styles.openIcon} onClick={() => handleClick()} />
                    ) : (
                        <img src='/strelkaDown.png' className={styles.openIcon} onClick={() => handleClick()} />
                    )}
                </div>
                {click ? (
                    <div>
                        <span className={styles.descriptionText}
                            dangerouslySetInnerHTML={{ __html: event?.description }}
                        />
                    </div>
                ) : (
                    null
                )}
                <img src={picture} className={styles.picture} />
            </div>
            {event?.isRegistrationRequired ? (
                <div>
                    <div className={styles.line}></div>
                    <div className={styles.registrationEndDateForm}>
                        <span className={styles.text}>{t('registrationEndDate')}</span>
                        <span className={styles.answer}>{formatDate(event?.registrationLastDate)}</span>
                    </div>
                </div>
            ) : (
                null
            )}
            <div className={styles.line}></div>
            <div className={styles.row3}>
                <div className={styles.dateOfEventForm}>
                    <span className={styles.text}>{t('date(s)OfTheEvent')}</span>
                    {(event?.dateTimeTo && formatDate(event?.dateTimeFrom) != formatDate(event?.dateTimeTo)) ? (
                        <span className={styles.answer}>{formatDate(event?.dateTimeFrom)} - {formatDate(event?.dateTimeTo)}</span>
                    ) : (
                        <span className={styles.answer}>{formatDate(event?.dateTimeFrom)}</span>
                    )}
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.row3}>
                <div className={styles.formatOfTheEventsForm}>
                    <span className={styles.text}>{t('formatOfTheEvents')}</span>
                    <span className={styles.answer}>{translateFormat[event?.format]}</span>
                </div>
                <div className={styles.linkForm}>
                    <span className={styles.text}>{t('link')}</span>
                    <span className={styles.answer}>{event?.link}</span>
                </div>
            </div>
        </div>
    );
};

export default EventByIdOnline;
