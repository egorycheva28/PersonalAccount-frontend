import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./eventByIdAdmin.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEventThunkCreator, editEventStatusThunkCreator, getEventByIdThunkCreator } from '../../../reducers/administrationReducer';
import EventByIdOffline from './eventByIdOffline';
import EventByIdOnline from './eventByIdOnline';
import { useTranslation } from 'react-i18next';
import Notification from '../../errors/notification';

function EventById() {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [event, setEvent] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [statusEvent, setStatusEvent] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);

    const statuses = [
        { code: '1', name: 'Черновик', style: styles.draft },
        { code: '2', name: 'Активное', style: styles.actual },
        { code: '3', name: 'Завершилось', style: styles.finished },
        { code: '4', name: 'Архив', style: styles.archive }
    ];

    const translateStatus = {
        "Draft": "Черновик",
        "Actual": "Активное",
        "Archive": "Архив",
        "Finished": "Завершилось"
    }

    const translateStatusBack = {
        "Черновик": "0",
        "Активное": "1",
        "Завершилось": "2",
        "Архив": "3"
    }

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

    const handleClick = () => setIsOpen(!isOpen);
    const editEvent = () => navigate(`/editEvent/${id}`);
    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');
    const eventsPage = () => navigate('/admin/events');

    const editStatusEvent = async (newStatus) => {
        const result = await dispatch(editEventStatusThunkCreator(id, translateStatusBack[newStatus]));
        if (!result) {
            setClicks(clicks + 1);
            setNotification({ message: t('statusChanged'), type: 'Success', show: true });
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
        else {
            setNotification({ message: t('failedChangedStatus'), type: 'Error', show: true });
        }
        setIsOpen(false);
        setCurrentStatus(newStatus);
    };

    const deleteEvent = async () => {
        const result = await dispatch(deleteEventThunkCreator(id));
        if (!result) {
            const message = t('eventRemoved');
            navigate('/admin/events', { state: { message } });
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
            setCurrentStatus(translateStatus[getEvent.status]);
            chooseStatus(getEvent.status);
        };

        fetchData();
    }, [currentStatus]);

    return (
        <div className={styles.eventByIdAdminContainer}>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage2} onClick={eventsPage}>{t('events')}</span>
            </div>
            <div className={styles.informationeventByIdAdmin}>
                <div className={styles.header}>
                    <span className={styles.title}>{event?.title}</span>
                    <div className={isOpen ? styles.iconsForm1 : styles.iconsForm2}>
                        <div>
                            <div className={statusEvent} onClick={handleClick}>
                                <span>{translateStatus[event?.status]}</span>
                                {isOpen ? (
                                    <img src='/CaretUp.png' className={styles.statusIcon} />
                                ) : (
                                    <img src='/CaretDown.png' className={styles.statusIcon} />
                                )}
                            </div>
                            {isOpen && (
                                <div className={styles.statuses}>
                                    {
                                        statuses
                                            .filter(status => status.name !== currentStatus).map((status) => (
                                                <div key={status.code}>
                                                    <div className={status.style} onClick={() => editStatusEvent(status.name)}>{status.name}</div>
                                                </div>
                                            ))
                                    }
                                </div>
                            )}
                        </div>
                        <div className={styles.icons}>
                            <img src='/edit.png' className={styles.editIcon} onClick={editEvent} />
                            <img src='/delete.png' className={styles.deleteIcon} onClick={deleteEvent} />
                        </div>
                    </div>
                </div>
                {event?.format == 'Offline' ? (
                    <EventByIdOffline />
                ) : (<EventByIdOnline />)}
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default EventById;