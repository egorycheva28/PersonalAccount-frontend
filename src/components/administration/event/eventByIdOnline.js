import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventByIdAdmin.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { getEventByIdThunkCreator } from '../../../reducers/administrationReducer';
import InternalParticipant from './internalPaticipant';
import { getFileThunkCreator } from '../../../reducers/filesReducer';

const EventByIdOnline = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [click, setClick] = useState(false);
    const [event, setEvent] = useState();
    const [picture, setPicture] = useState();
    const [chosenParticipant, setChosenParticipant] = useState(true);
    const [internalParticipants, setInternalParticipants] = useState([]);
    const [externalParticipants, setExternalParticipants] = useState([]);

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
    const handleClick2 = (value) => setChosenParticipant(value);

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
            setInternalParticipants(getEvent?.participants.filter(p => p.participantType === "Inner"));
            setExternalParticipants(getEvent?.participants.filter(p => p.participantType === "External"));

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
            <div className={styles.line1}></div>
            <div className={styles.row6}>
                <div className={styles.typeOfEventForm2}>
                    <span className={styles.text}>{t('typeOfEvent')}</span>
                    <span className={styles.answer}>{translateType[event?.type]}</span>
                </div>
                <div className={styles.targetAudienceForm2}>
                    <span className={styles.text}>{t('targetAudience')}</span>
                    <span className={styles.answer}>{translateAuditory[event?.auditory]}</span>
                </div>
            </div>
            <div className={styles.line1}></div>
            <div className={styles.row6}>
                <div className={styles.dateOfEventForm2}>
                    <span className={styles.text}>{t('date(s)OfTheEvent')}</span>
                    {(event?.dateTimeTo && formatDate(event?.dateTimeFrom) != formatDate(event?.dateTimeTo)) ? (
                        <span className={styles.answer}>{formatDate(event?.dateTimeFrom)} - {formatDate(event?.dateTimeTo)}</span>
                    ) : (
                        <span className={styles.answer}>{formatDate(event?.dateTimeFrom)}</span>
                    )}
                </div>
                <div className={styles.formatOfTheEventsForm2}>
                    <span className={styles.text}>{t('formatOfTheEvents')}</span>
                    <span className={styles.answer}>{translateFormat[event?.format]}</span>
                </div>
            </div>
            <div className={styles.line1}></div>
            <div className={styles.row1}>
                <span className={styles.text}>{t('link')}</span>
                <span className={styles.answer}>{event?.link}</span>
            </div>
            <div className={styles.line1}></div>
            <div className={styles.row1}>
                <span className={styles.text}>{t('includeEventsInDigest')}</span>
                <span className={styles.answer}>{translateRegistration[event?.isDigestNeeded]}</span>
            </div>
            {event?.isDigestNeeded ? (
                <div>
                    <div className={styles.line3}></div>
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
            <div className={styles.line1}></div>
            <div className={styles.row2}>
                <div className={styles.registrationRequiredForm2}>
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
                        <div className={styles.registrationEndDateForm2}>
                            <span className={styles.text}>{t('registrationEndDate')}</span>
                            <span className={styles.answer}>{formatDate(event?.registrationLastDate)}</span>
                        </div>
                    ) : (
                        null
                    )}
            </div>
            {event?.isRegistrationRequired ?
                (
                    <div className={styles.participants}>
                        <div className={styles.headerParticipants}>
                            <div className={chosenParticipant ? styles.internalParticipantsOn : styles.internalParticipantsOff} onClick={() => handleClick2(true)}>
                                <span className={chosenParticipant ? styles.internalParticipantsHeaderOn : styles.internalParticipantsHeaderOff} >{t('internalParticipants')}</span>
                            </div>
                            <div className={!chosenParticipant ? styles.externalParticipantsOn : styles.externalParticipantsOff} onClick={() => handleClick2(false)}>
                                <span className={!chosenParticipant ? styles.externalParticipantsHeaderOn : styles.externalParticipantsHeaderOff} >{t('externalParticipants')}</span>
                            </div>
                        </div>
                        <div className={chosenParticipant ? styles.listParticipants1 : styles.listParticipants2}>
                            {chosenParticipant ?
                                (internalParticipants.map((value) => (
                                    <InternalParticipant additionalInfo={value.additionalInfo} email={value.email} name={value.name} phone={value.phone}
                                        participantType={value.participantType} user={value.user} id={value.id} key={value.id}
                                        chosenParticipant={chosenParticipant} />
                                ))
                                ) : (
                                    externalParticipants.map((value) => (
                                        <InternalParticipant additionalInfo={value.additionalInfo} email={value.email} name={value.name} phone={value.phone}
                                            participantType={value.participantType} user={value.user} id={value.id} key={value.id}
                                            chosenParticipant={chosenParticipant} />
                                    ))
                                )
                            }
                        </div>
                    </div>
                ) : (
                    null
                )}
        </div>
    );
};

export default EventByIdOnline;