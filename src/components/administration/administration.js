import styles from "./administration.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Administration = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navigation = (page) => {
        switch (page) {
            case 'users':
                navigate('/admin/users');
                break;
            case 'usefulServices':
                navigate('/admin/usefulservice');
                break;
            case 'events':
                navigate('/admin/events');
                break;
        }
    };

    const mainPage = () => {
        navigate('/events');
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage2}>{t('administration')}</span>
            </div>
            <div className={styles.cards}>
                <div className={styles.usersCard} onClick={() => navigation('users')}>
                    <div className={styles.header}>
                        <img src="/UsersBlack.png" className={styles.icon} />
                        <span className={styles.text}>{t('users')}</span>
                    </div>
                    <div className={styles.body}>{t('adminDescription')}</div>
                </div>
                <div className={styles.usefulServicesCard} onClick={() => navigation('usefulServices')}>
                    <div className={styles.header}>
                        <img src="/ServicesBlack.png" className={styles.icon} />
                        <span className={styles.text}>{t('usefulServices')}</span>
                    </div>
                    <div className={styles.body}>{t('adminDescription')}</div>
                </div>
                <div className={styles.eventsCard} onClick={() => navigation('events')}>
                    <div className={styles.header}>
                        <img src="/EventBlack.png" className={styles.icon} />
                        <span className={styles.text}>{t('events')}</span>
                    </div>
                    <div className={styles.body}>{t('adminDescription')}</div>
                </div>
            </div>
        </div>
    );
};

export default Administration;