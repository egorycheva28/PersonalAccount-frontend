import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./events.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { getFileThunkCreator } from '../../../reducers/filesReducer';

function EventItem(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [picture, setPicture] = useState(null);
    const [dateFrom, setDateFrom] = useState();
    const [timeFrom, setTimeFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [timeTo, setTimeTo] = useState();

    const translateFormat = {
        "Online": "Онлайн",
        "Offline": "Офлайн"
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

    const detail = () => navigate(`/events/${props.id}`);

    useEffect(() => {
        const fetchData = async () => {
            if (props.picture != null) {
                const getPicture = await dispatch(getFileThunkCreator(props.picture.id));
                if (getPicture != null) {
                    const imageObjectURL = URL.createObjectURL(getPicture); // Создаем URL для изображения
                    setPicture(imageObjectURL);
                }
            }
            if (props.dateTimeFrom) {
                setDateFrom(formatDate(props.dateTimeFrom));
                setTimeFrom(formatTime(props.dateTimeFrom));
            }

            if (props.dateTimeTo) {
                setDateTo(formatDate(props.dateTimeTo));
                setTimeTo(formatTime(props.dateTimeTo));
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.eventItem} onClick={() => detail()}>
            {picture != null ? (
                <img src={picture} className={styles.picture} />
            ) : (
                <div className={styles.picture}></div>
            )}
            <div className={styles.content}>
                <span className={styles.title}>{props.title}</span>
                <div className={styles.body}>
                    <div className={styles.dateEventForm}>
                        <span className={styles.text}>{t('date(s)OfTheEvent')}</span>
                        <span className={styles.answer}>
                            {dateTo ? (
                                (dateFrom == dateTo) ? (dateFrom + " (" + timeFrom + " - " + timeTo + ")")
                                    :
                                    (dateFrom + " (" + timeFrom + ") - " + dateTo + " (" + timeTo + ")")
                            ) : (
                                dateFrom + " (" + timeFrom + ")"
                            )}
                        </span>
                    </div>
                    <div className={styles.formatForm}>
                        <span className={styles.text}>{t('formatOfTheEvents')}</span>
                        <span className={styles.answer}>{translateFormat[props.format]}</span>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EventItem;
