import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventByIdAdmin.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { getEventByIdThunkCreator } from '../../../reducers/administrationReducer';
import { getFileThunkCreator } from '../../../reducers/filesReducer';
import Maps from '../../map/map';

const EventByIdOffline = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [event, setEvent] = useState();
    const [click, setClick] = useState(false);
    const [picture, setPicture] = useState();
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const translateRegistration = {
        "true": "Да",
        "false": "Нет"
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

    const handleClick = () => setClick(!click);

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    useEffect(() => {
        const fetchData = async () => {
            const getEvent = await dispatch(getEventByIdThunkCreator(id));
            if (getEvent && getEvent.error === 401) {
                navigate('/error401');
            }
            else if (getEvent && getEvent.error === 403) {
                navigate('/error403');
            }
            else if (getEvent && getEvent.error === 500) {
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

            setLatitude(getEvent.latitude);
            setLongitude(getEvent.longitude);
        };
        fetchData();

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    let style = {};

    if (windowWidth >= 500) {
        style = { width: '50%', height: 'auto' };
    } else {
        style = { width: '100%', height: 'auto' };
    }

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
            <div className={styles.line1}></div>
            <div className={styles.row2}>
                <div className={styles.registrationRequiredForm}>
                    <span className={styles.text}>{t('registrationRequired')}</span>
                    <span className={styles.answer}>{translateRegistration[event?.isRegistrationRequired]}</span>
                </div>
                {event?.isRegistrationRequired ? (
                    <div className={styles.line5}></div>
                ) : (
                    null
                )}
                {event?.isRegistrationRequired ?
                    (
                        <div className={styles.registrationEndDateForm}>
                            <span className={styles.text}>{t('registrationEndDate')}</span>
                            <span className={styles.answer}>{formatDate(event?.registrationLastDate)}</span>
                        </div>
                    ) : (
                        null
                    )}
            </div>
            <div className={styles.line1}></div>
            <div className={styles.row3}>
                <div className={styles.column}>
                    <div className={styles.row}>
                        <div className={styles.typeOfEventForm}>
                            <span className={styles.text}>{t('typeOfEvent')}</span>
                            <span className={styles.answer}>{translateType[event?.type]}</span>
                        </div>
                        <div className={styles.targetAudienceForm}>
                            <span className={styles.text}>{t('targetAudience')}</span>
                            <span className={styles.answer}>{translateAuditory[event?.auditory]}</span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                    <div className={styles.row5}>
                        <div className={styles.dateOfEventForm}>
                            <span className={styles.text}>{t('date(s)OfTheEvent')}</span>
                            {(event?.dateTimeTo && formatDate(event?.dateTimeFrom) != formatDate(event?.dateTimeTo)) ? (
                                <span className={styles.answer}>{formatDate(event?.dateTimeFrom)} - {formatDate(event?.dateTimeTo)}</span>
                            ) : (
                                <span className={styles.answer}>{formatDate(event?.dateTimeFrom)}</span>
                            )}
                        </div>
                        <div className={styles.line5}></div>
                        <div className={styles.formatOfTheEventsForm}>
                            <span className={styles.text}>{t('formatOfTheEvents')}</span>
                            <span className={styles.answer}>{translateFormat[event?.format]}</span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                    <div className={styles.row}>
                        <div className={styles.addressForm}>
                            <span className={styles.text}>{t('address')}</span>
                            <span className={styles.answer}>{event?.addressName}</span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                    <div className={styles.row}>
                        <div className={styles.longitudeForm}>
                            <span className={styles.text}>{t('longitude')}</span>
                            <span className={styles.answer}>{event?.longitude}</span>
                        </div>
                        <div className={styles.latitudeForm}>
                            <span className={styles.text}>{t('latitude')}</span>
                            <span className={styles.answer}>{event?.latitude}</span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                </div>
                <Maps longitude={longitude} latitude={latitude} style={style} />
            </div>
            <div className={styles.row1}>
                <span className={styles.text}>{t('includeEventsInDigest')}</span>
                <span className={styles.answer}>{translateRegistration[event?.isDigestNeeded]}</span>
            </div>
            {event?.isDigestNeeded ? (
                <div>
                    <div className={styles.line1}></div>
                    <div className={styles.row1}>
                        <span className={styles.text}>{t('digestText')}</span>
                        <span className={styles.answer}
                            dangerouslySetInnerHTML={{ __html: event?.digestText }}
                        />
                    </div>
                </div>
            ) : (
                null
            )}
            <div className={styles.line1}></div>
            <div className={styles.row1}>
                <span className={styles.text}>{t('createdEvent')}</span>
                <span className={styles.answer}>{event?.author.lastName} {event?.author.firstName} {event?.author.patronymic}</span>
            </div>
        </div>
    );
};

export default EventByIdOffline;