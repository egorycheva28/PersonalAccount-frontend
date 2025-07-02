import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./userById.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByIdThunkCreator } from '../../../reducers/administrationReducer';
import { getFileThunkCreator } from '../../../reducers/filesReducer';

function UserById() {
    const { t } = useTranslation();
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [profile, setProfile] = useState();
    const [avatar, setAvatar] = useState();

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');
    const usersPage = () => navigate('/admin/users');

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getUserByIdThunkCreator(id));
            if (getProfile && getProfile.error === 401) {
                navigate('/error401');
            }
            else if (getProfile && getProfile.error === 403) {
                navigate('/error403');
            }
            else if (getProfile && getProfile.error === 500) {
                navigate('/error500');
            }

            setProfile(getProfile);
            if (getProfile.avatar) {
                const getAvatar = await dispatch(getFileThunkCreator(getProfile.avatar.id));
                const imageObjectURL = URL.createObjectURL(getAvatar);
                setAvatar(imageObjectURL);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage} onClick={usersPage}>{t('users')} / </span>
                <span className={styles.linkPage2}>{profile?.lastName} {profile?.firstName} {profile?.patronymic}</span>
            </div>
            <div className={styles.title}>
                <span>{profile?.lastName} {profile?.firstName} {profile?.patronymic}</span>
            </div>
            <div className={styles.info}>
                <div className={styles.avatarBlock}>
                    {avatar ? (
                        <img src={avatar} className={styles.avatar} />
                    ) : (
                        null
                    )}
                </div>
                <div className={styles.rowColumn}>
                    <div className={styles.individualData}>
                        <div className={styles.header}>{t('individualData')}</div>
                        <div className={styles.body}>
                            <div className={styles.form}>
                                <span className={styles.text}>{t('gender')}</span>
                                <span className={styles.answer}>{profile?.gender}</span>
                            </div>
                            <div className={styles.line}></div>
                            <div className={styles.form}>
                                <span className={styles.text}>{t('birthDate')}</span>
                                <span className={styles.answer}>{formatDate(profile?.birthDate)}</span>
                            </div>
                            <div className={styles.line}></div>
                            <div className={styles.form}>
                                <span className={styles.text}>Email</span>
                                <span className={styles.answer}>{profile?.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contacts}>
                        <div className={styles.header}>{t('contacts')}</div>
                        <div className={styles.body}>
                            <div className={styles.form}>
                                <span className={styles.text}>{t('phone')}</span>
                                {profile?.contacts.length > 0 ? (
                                    <span className={styles.answer}>{profile?.contacts[0].value}</span>
                                ) : (
                                    null
                                )}
                            </div>
                            <div className={styles.line}></div>
                            <div className={styles.form}>
                                <span className={styles.text}>{t('phone2')}</span>
                                <span className={styles.answer}>-</span>
                            </div>
                            <div className={styles.line}></div>
                            <div className={styles.form}>
                                <span className={styles.text}>{t('addEmail')}</span>
                                <span className={styles.answer}>-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UserById;