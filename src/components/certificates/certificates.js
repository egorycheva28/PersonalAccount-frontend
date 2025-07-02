import styles from "./certificates.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CertificateStudent from "./certificatesStudent";
import CertificateEmployee from "./certificatesEmployee";
import Notification from "../errors/notification";
import { useNavigate } from "react-router-dom";

const Certificates = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [click, setClick] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);

    const handleClick = (value) => setClick(value);
    const mainPage = () => navigate('/events');

    return (
        <div className={styles.certificatesContainer}>
            <div className={styles.headerPage}>
                <span>{t('certificates')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage2}>{t('certificates')}</span>
            </div>
            <div>
                <h4 className={styles.title}>{t('orderACertificate')}</h4>
            </div>
            <div className={styles.info1}>
                {(JSON.parse(localStorage.getItem('roles')).length === 1 && JSON.parse(localStorage.getItem('roles'))[0] == 'Student') ? (
                    <CertificateStudent clicks={clicks} setClicks={setClicks} setNotification={setNotification} />
                ) : (JSON.parse(localStorage.getItem('roles')).length === 1 && JSON.parse(localStorage.getItem('roles'))[0] == 'Employee') ? (
                    <CertificateEmployee clicks={clicks} setClicks={setClicks} setNotification={setNotification} />
                ) : (
                    <div>
                        <div className={styles.roles}>
                            <div className={click ? styles.roleOn : styles.roleOff} onClick={() => handleClick(true)}>
                                <span className={click ? styles.roleTextOn : styles.roleTextOff}>{t('student')}</span>
                            </div>
                            <div className={!click ? styles.roleOn : styles.roleOff} onClick={() => handleClick(false)}>
                                <span className={!click ? styles.roleTextOn : styles.roleTextOff}>{t('employee')}</span>
                            </div>
                        </div>
                        <div className={styles.roles2}>
                            <div className={styles.userTypeForm}>
                                <label htmlFor="chooseType">{t('userType')}</label>
                                <select className={styles.userType} id="chooseType" name="choosing" value={click ? 'true' : 'false'} onChange={(e) => setClick(e.target.value === 'true')}>
                                    <option value="true">{t('student')}</option>
                                    <option value="false">{t('employee')}</option>
                                </select>
                            </div>
                        </div>
                        {click ? (
                            <div className={styles.info2}>
                                <CertificateStudent clicks={clicks} setClicks={setClicks} setNotification={setNotification} />
                            </div>
                        ) : (
                            <div className={styles.info2}>
                                <CertificateEmployee clicks={clicks} setClicks={setClicks} setNotification={setNotification} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default Certificates;