import { useEffect, useState } from 'react';
import styles from "./notification.module.css";
import { useTranslation } from 'react-i18next';

const Notification = ({ message, type, show, click }) => {
    const { t } = useTranslation();

    const [notifications, setNotifications] = useState([]);
    const [header, setHeader] = useState('');
    const [style, setStyle] = useState();
    const [icon, setIcon] = useState();
    const [closeIcon, setCloseIcon] = useState();

    const showNotification = () => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 3000);
    };

    const chooseType = () => {
        switch (type) {
            case 'Error':
                setHeader(t('error'));
                setStyle(styles.errorStatus);
                setIcon('/errorIcon.png');
                setCloseIcon('/errorCloseIcon.png');
                break;
            case 'Success':
                setHeader(t('success'));
                setStyle(styles.successStatus);
                setIcon('/successIcon.png');
                setCloseIcon('/successCloseIcon.png');
                break;
            case 'Information':
                setHeader(t('information'));
                setStyle(styles.informationStatus);
                setIcon('/informationIcon.png');
                setCloseIcon('/informationCloseIcon.png');
                break;
            case 'Warning':
                setHeader(t('warning'));
                setStyle(styles.warningStatus);
                setIcon('/warningIcon.png');
                setCloseIcon('/warningCloseIcon.png');
                break;
            default:
                break;
        }
    }

    const close = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (show) {
                await chooseType();
                await showNotification();
            }
        };

        fetchData();
    }, [message, type, show, click]);

    return (
        < div className={styles.notification} >
            {
                notifications.map(({ id }) => (
                    <div key={id} className={styles.notificationItem}>
                        <div className={style}>
                            <div className={styles.textIcon}>
                                <img src={icon} className={styles.icon} />
                                <span >{header}</span>
                            </div>
                            <div>
                                <img src={closeIcon} className={styles.closeIcon} onClick={() => close(id)} />
                            </div>
                        </div>
                        <div className={styles.messageBlock}>
                            {message}
                        </div>
                    </div>
                ))
            }
        </div >
    );
}

export default Notification;
