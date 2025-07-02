import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventsAdmin.module.css";
import { useTranslation } from "react-i18next";
import { deleteEventThunkCreator, getEventsThunkCreator } from '../../../reducers/administrationReducer';
import { useNavigate } from 'react-router-dom';
import { getFileThunkCreator } from '../../../reducers/filesReducer';

function EventItem(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [picture, setPicture] = useState(null);
    const [statusEvent, setStatusEvent] = useState('');

    const translateStatus = {
        "Draft": "Черновик",
        "Actual": "Активное",
        "Archive": "Архив",
        "Finished": "Завершилоь"
    }

    const translateType = {
        "Open": "Открытое",
        "Close": "Закрытое"
    }

    const translateFormat = {
        "Online": "Онлайн",
        "Offline": "Офлайн"
    }

    const translateAuditory = {
        "All": "Общее",
        "Students": "Студенты",
        "Employees": "Преподаватели"
    }

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    const formatTime = (date) => {
        if (!date) return "Нет данных";

        const parts = date.split('T');
        if (parts.length !== 2) {
            throw new Error("Неправильный формат даты и времени");
        }

        const timeParts = parts[1].split(':');
        if (timeParts.length !== 3) {
            throw new Error("Неправильный формат времени");
        }

        const hours = timeParts[0];
        const minutes = timeParts[1];

        return `${hours}:${minutes}`;
    };

    const chooseStatus = (value) => {
        switch (value) {
            case "Draft":
                setStatusEvent(styles.draft);
                break;
            case "Actual":
                setStatusEvent(styles.actual);
                break;
            case "Archive":
                setStatusEvent(styles.archive);
                break;
            case "Finished":
                setStatusEvent(styles.finished);
                break;
        }
    };

    const detail = () => navigate(`/admin/event/${props.id}`);
    const editEvent = () => navigate(`/editEvent/${props.id}`);

    const deleteEvent = async () => {
        const result = await dispatch(deleteEventThunkCreator(props.id));
        if (!result) {
            props.setNotification({ message: t('eventRemoved'), type: 'Success', show: true });
        }
        else if (result.error === 401) {
            navigate('/error401');
        }
        else if (result.error === 403) {
            navigate('/error403');
        }
        else if (result.error === 500) {
            navigate('/error500');
        }

        await dispatch(getEventsThunkCreator(props.status2, props.eventType, props.name, props.format2, props.eventDate, 420, props.page, props.pageSize));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (props.picture != null) {
                const getPicture = await dispatch(getFileThunkCreator(props.picture.id));
                if (getPicture != null) {
                    const imageObjectURL = URL.createObjectURL(getPicture); // Создаем URL для изображения
                    setPicture(imageObjectURL);
                }
            }
            chooseStatus(props.status);
        };

        fetchData();
    }, []);

    return (
        <div className={props.filters ? styles.eventItemAdmin2 : styles.eventItemAdmin1} onClick={() => detail()}>
            <div className={styles.pictureForm}>
                {picture != null ? (
                    <img src={picture} className={styles.picture} />
                ) : (
                    <div className={styles.picture}></div>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.headerEvent}>
                    <div className={styles.titleForm}>
                        <span className={styles.title}>{props.title}</span>
                        <div className={styles.icons}>
                            <img src='/edit.png' className={styles.editIcon} onClick={(e) => {
                                e.stopPropagation();
                                editEvent();
                            }} />
                            <img src='/delete.png' className={styles.deleteIcon} onClick={(e) => {
                                e.stopPropagation();
                                deleteEvent();
                            }} />
                        </div>
                    </div>
                    <div className={statusEvent}>
                        <span>{translateStatus[props.status]}</span>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.typeOfEventForm}>
                        <span className={styles.text}>{t('typeOfEvent')}</span>
                        <span className={styles.answer}>{translateType[props.type]}</span>
                    </div>
                    <div className={styles.auditoryForm}>
                        <span className={styles.text}>{t('auditory')}</span>
                        <span className={styles.answer}>{translateAuditory[props.auditory]}</span>
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.row}>
                    <div className={styles.dateOfTheEventForm}>
                        <span className={styles.text}>{t('date(s)OfTheEvent')}</span>
                        {(props.dateTimeTo && formatDate(props.dateTimeFrom) != formatDate(props.dateTimeTo)) ? (
                            <span className={styles.answer}>{formatDate(props.dateTimeFrom)} - {formatDate(props.dateTimeTo)}</span>
                        ) : (
                            <span className={styles.answer}>{formatDate(props.dateTimeFrom)}</span>
                        )}
                    </div>

                    <div className={styles.formatOfTheEventsForm}>
                        <span className={styles.text}>{t('formatOfTheEvents')}</span>
                        <span className={styles.answer}>{translateFormat[props.format]}</span>
                    </div>
                </div>
                {(props.isTimeFromNeeded || props.isTimeToNeeded) ? (
                    <div>
                        <div className={styles.line}></div>
                        <div className={styles.row1}>
                            {props.isTimeFromNeeded ? (
                                <div className={styles.typeOfEventForm}>
                                    <span className={styles.text}>{t('startTime')}</span>
                                    <span className={styles.answer}>{formatTime(props.dateTimeFrom)}</span>
                                </div>
                            ) : (
                                null
                            )}
                            {props.isTimeToNeeded ? (
                                <div className={styles.auditoryForm}>
                                    <span className={styles.text}>{t('endTime')}</span>
                                    <span className={styles.answer}>{formatTime(props.dateTimeTo)}</span>
                                </div>
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                ) : (
                    null
                )}
            </div>
        </div >
    );
};

export default EventItem;