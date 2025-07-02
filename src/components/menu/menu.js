import { useEffect, useState } from 'react';
import styles from './menu.module.css';
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutThunkCreator } from '../../reducers/loginReducer';
import { getFileThunkCreator } from '../../reducers/filesReducer';

const Menu = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState(false);
    const [administration, setAdministration] = useState(false);
    const [certificates, setCertificates] = useState(false);
    const [usefulServices, setUsefulServices] = useState(false);
    const [events, setEvents] = useState(false);
    const [avatar, setAvatar] = useState();
    const [exit, setExit] = useState(false);
    const currentPath = location.pathname;
    
    const isActive = (route) => currentPath.startsWith(route);

    const openMenu = () => {
        setIsOpen(!isOpen);
        setExit(false);
    };

    const exitOpen = () => {
        setExit(!exit);
    };

    const profileClick = () => {
        setProfile(true);
        setAdministration(false);
        setCertificates(false);
        setUsefulServices(false);
        setEvents(false);
        setIsOpen(false);
        navigate('/profile');
    }

    const administrationClick = () => {
        setProfile(false);
        setAdministration(true);
        setCertificates(false);
        setUsefulServices(false);
        setEvents(false);
        setIsOpen(false);
        navigate('/admin');
    }

    const certificatesClick = () => {
        setProfile(false);
        setAdministration(false);
        setCertificates(true);
        setUsefulServices(false);
        setEvents(false);
        setIsOpen(false);
        navigate('/certificates');
    }

    const usefulServicesClick = () => {
        setProfile(false);
        setAdministration(false);
        setCertificates(false);
        setUsefulServices(true);
        setEvents(false);
        setIsOpen(false);
        navigate('/usefulServices');
    }

    const eventsClick = () => {
        setProfile(false);
        setAdministration(false);
        setCertificates(false);
        setUsefulServices(false);
        setEvents(true);
        setIsOpen(false);
        navigate('/events');
    }

    const logout = () => {
        dispatch(logoutThunkCreator());
        navigate('/events');
    };

    const currentUrl = (path) => {
        switch (path) {
            case '/profile':
                setProfile(true);
                setAdministration(false);
                setCertificates(false);
                setUsefulServices(false);
                setEvents(false);
                break;
            case '/admin':
                setProfile(false);
                setAdministration(true);
                setCertificates(false);
                setUsefulServices(false);
                setEvents(false);
                break;
            case '/certificates':
                setProfile(false);
                setAdministration(false);
                setCertificates(true);
                setUsefulServices(false);
                setEvents(false);
                break;
            case '/usefulServices':
                setProfile(false);
                setAdministration(false);
                setCertificates(false);
                setUsefulServices(true);
                setEvents(false);
                break;
            case '/events':
                setProfile(false);
                setAdministration(false);
                setCertificates(false);
                setUsefulServices(false);
                setEvents(true);
                break;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const id = localStorage.getItem('avatarId');
            const getAvatar = await dispatch(getFileThunkCreator(id));
            const imageObjectURL = URL.createObjectURL(getAvatar);
            setAvatar(imageObjectURL);

            currentUrl(currentPath);
            if (isActive('/admin') || isActive('/createEvent') || isActive('/editEvent')) {
                setProfile(false);
                setAdministration(true);
                setCertificates(false);
                setUsefulServices(false);
                setEvents(false);
            }
            if (isActive('/events')) {
                setProfile(false);
                setAdministration(false);
                setCertificates(false);
                setUsefulServices(false);
                setEvents(true);
            }
        };

        fetchData();

        const handleAvatarIdChange = () => {
            fetchData();
        };
        window.addEventListener('updateAvatarId', handleAvatarIdChange);
        return () => {
            window.removeEventListener('updateAvatarId', handleAvatarIdChange);
        };

    }, [currentPath]);

    return (
        <div className={styles.menuContainer}>
            {!isOpen && (
                <img src='../shortMenu.png' className={styles.shortMenu} onClick={openMenu}></img>
            )}
            <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={openMenu}></div>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.rounds} onClick={openMenu}>
                    <img
                        src={isOpen ? "/Chevron_Left_MD.svg" : "/Chevron_Right_MD.svg"}
                        alt={isOpen ? 'Open' : 'Closed'}
                        className={styles.menuIcon}
                    />
                </div>
                <img src={avatar} className={styles.avatar} onClick={exitOpen} />
                <div className={`${styles.exit} ${(exit && isOpen) ? null : styles.exit2}`} onClick={logout}>
                    <span>{t('exit')}</span>
                    <img src="/exit.png" className={styles.exitIcon} />
                </div>

                <nav className={styles.menu}>
                    <ul>
                        <li className={profile ? styles.colorMenu : null} onClick={profileClick} >
                            {profile ? (
                                <img src="/User.svg" className={styles.icon} />
                            ) : (
                                <img src="/UserBlack.svg" className={styles.icon} />
                            )}
                            {isOpen && <span>{t('profile')}</span>}
                        </li>
                        {JSON.parse(localStorage.getItem('roles')).length === 0 ? (
                            <li className={administration ? styles.colorMenu : null} onClick={administrationClick}>
                                {administration ? (
                                    <img src="/Administrator.svg" className={styles.icon} />
                                ) : (
                                    <img src="/AdministratorBlack.svg" className={styles.icon} />
                                )}
                                {isOpen && <span>{t('administration')}</span>}
                            </li>
                        ) : (
                            null
                        )}
                        <li className={certificates ? styles.colorMenu : null} onClick={certificatesClick}>
                            {certificates ? (
                                <img src="/References.png" className={styles.icon} />
                            ) : (
                                <img src="/ReferencesBlack.png" className={styles.icon} />
                            )}
                            {isOpen && <span>{t('certificates')}</span>}
                        </li>
                        <li className={usefulServices ? styles.colorMenu : null} onClick={usefulServicesClick}>
                            {usefulServices ? (
                                <img src="/UsefulServices.png" className={styles.icon} />
                            ) : (
                                <img src="/UsefulServicesBlack.png" className={styles.icon} />
                            )}
                            {isOpen && <span>{t('usefulServices')}</span>}
                        </li>
                        <li className={events ? styles.colorMenu : null} onClick={eventsClick}>
                            {events ? (
                                <img src="/Events.png" className={styles.icon} />
                            ) : (
                                <img src="/EventsBlack.png" className={styles.icon} />
                            )}
                            {isOpen && <span>{t('events')}</span>}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Menu;
