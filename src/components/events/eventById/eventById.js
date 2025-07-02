import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from "react-redux";
import styles from "./eventById.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { getEventByIdThunkCreator, getEventIsParticipantThunkCreator, registerExternalParticipantThunkCreator, registerInnerParticipantThunkCreator } from '../../../reducers/eventsReducer';
import { useTranslation } from 'react-i18next';
import EventByIdOffline from './eventByIdOffline';
import EventByIdOnline from './eventByIdOnline';
import Notification from '../../errors/notification';

Modal.setAppElement('#root');

function EventById() {
    const { t } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [event, setEvent] = useState();
    const [auth, setAuth] = useState(false);
    const [is_participant, setIs_participant] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [additionalInformation, setAdditionalInformation] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [click, setClick] = useState(1);

    const openModal = () => setModalIsOpen(true);

    const closeModal = () => {
        setName('');
        setPhone('');
        setEmail('');
        setAdditionalInformation('');
        setModalIsOpen(false);
    }

    const registerInnerParticipant = async () => {
        const currentDate = new Date();
        if (new Date(event?.registrationLastDate) < currentDate) {
            setClick(click + 1);
            setNotification({ message: t('registrationClosed'), type: 'Error', show: true });
        }
        else {
            const result = await dispatch(registerInnerParticipantThunkCreator(id));
            setNotification({ message: t('successfulRegistration'), type: 'Success', show: true });
        }
    };

    const registerExternalParticipant = async () => {
        const currentDate = new Date();
        if (new Date(event?.registrationLastDate) < currentDate) {
            setClick(click + 1);
            setNotification({ message: t('registrationClosed'), type: 'Error', show: true });
        }
        else {
            if (name && (phone || email)) {
                const result = await dispatch(registerExternalParticipantThunkCreator(id, name, email, phone, additionalInformation));
                setNotification({ message: t('successfulRegistration'), type: 'Success', show: true });
                setName('');
                setPhone('');
                setEmail('');
                setAdditionalInformation('');
                setModalIsOpen(false);
            }
            else {
                setClick(click + 1);
                setNotification({ message: t('registrationData'), type: 'Error', show: true });
            }
        }
    };

    const cancel = () => {
        setName('');
        setPhone('');
        setEmail('');
        setAdditionalInformation('');
        setModalIsOpen(false);
    };

    const checkAuth = async () => {
        if (localStorage.getItem('token')) {
            setAuth(true);
            var is = await dispatch(getEventIsParticipantThunkCreator(id));
            setIs_participant(is);
        }
    };

    const mainPage = () => {
        navigate('/events');
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
            checkAuth();
        };

        fetchData();
    }, [notification]);

    return (
        <div className={styles.eventByIdContainer}>
            <div className={localStorage.getItem('token') ? styles.headerPage : styles.headerPage2}>
                <span>{t('events')}</span>
            </div>
            <div className={localStorage.getItem('token') ? styles.links : styles.links2}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage2}>{event?.title}</span>
            </div>
            <div className={localStorage.getItem('token') ? styles.eventsInformation : styles.eventsInformation2}>
                {!event?.isRegistrationRequired ? (
                    <div className={styles.header}>
                        <span className={styles.title}>{event?.title}</span>
                    </div>
                ) : (
                    is_participant ? (
                        <div className={styles.header}>
                            <span className={styles.title}>{event?.title}</span>
                            <button className={styles.participatingButton}>{t('IParticipating')}</button>
                        </div>
                    ) : (
                        <div className={styles.header}>
                            <span className={styles.title}>{event?.title}</span>
                            <button className={styles.participateButton} onClick={auth ? registerInnerParticipant : openModal}>{t('willParticipate')}</button>
                        </div>
                    )
                )}

                {event?.format == 'Offline' ? (
                    <EventByIdOffline />
                ) : (<EventByIdOnline />)}

                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className={styles.registrationModal}>
                    <div className={styles.contentModal}>
                        <span className={styles.registrationTitle}>{t('registrationForTheEvent')}</span>
                        <div className={styles.formsModal}>
                            <div className={styles.fullNameForm}>
                                <label htmlFor="fullName">{t('fullName')}</label>
                                <input type="text" className={styles.fullNameInput} value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className={styles.phoneForm}>
                                <label htmlFor="phone">{t('phone')}</label>
                                <input type="text" className={styles.phoneInput} value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className={styles.emailForm}>
                                <label htmlFor="email">Email</label>
                                <input type="text" className={styles.emailInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={styles.additionalInformationForm}>
                                <label htmlFor="additionalInformation">{t('additionalInformation')}</label>
                                <input type="text" className={styles.additionalInformationInput} value={additionalInformation} onChange={(e) => setAdditionalInformation(e.target.value)} />
                            </div>
                        </div>
                        <div className={styles.registrationButtons}>
                            <button className={styles.saveButton} onClick={registerExternalParticipant}>{t('save')}</button>
                            <button className={styles.cancelButton} onClick={cancel}>{t('cancel')}</button>
                        </div>
                        <img src="../close.png" className={styles.closeModalButton} onClick={closeModal} />
                    </div>
                </Modal>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={click} />
        </div >
    );
};

export default EventById;
