import styles from "./login.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginThunkCreator } from "../../reducers/loginReducer";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import Notification from "../errors/notification";
import { getProfileThunkCreator } from "../../reducers/profileReducer";

const Login = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [rememberMe, setRememberMe] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [click, setClick] = useState(1);
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};

        if (!email) newErrors.email = t('emailRequired');
        if (!password) newErrors.password = t('passwordRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const login = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            setClick(click + 1);
            setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
        }
        else {
            const result = await dispatch(loginThunkCreator(email, password, rememberMe));

            if (result && result.loginSucceeded == true) {
                const getProfile = await dispatch(getProfileThunkCreator());
                localStorage.setItem('roles', JSON.stringify(getProfile.userTypes));
                localStorage.setItem('avatarId', getProfile.avatar.id);
                const message = t('successfulLogin');
                navigate('/profile', { state: { message } });
            }
            else if (result && result.error) {
                setClick(click + 1);
                setNotification({ message: result.error, type: 'Error', show: true });
            }
            else {
                setClick(click + 1);
                setNotification({ message: t('incorrectlyEnteredData'), type: 'Error', show: true });
            }
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.picture}>
                <img src="/logins.png" />
            </div>
            <div className={styles.login}>
                <div className={styles.header}>{t('welcome')}</div>
                <form className={styles.loginForm}>
                    <div className={styles.emailForm}>
                        <label htmlFor="email">{t('email')}</label>
                        <input type="email" className={styles.emailInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.passwordForm}>
                        <label htmlFor="password">{t('password')}</label>
                        <input type="password" className={styles.passwordInput} value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>
                    <div className={styles.switchButton}>
                        <div className={styles.switchText}>
                            <label className={styles.switch}>
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                <span className={styles.slider}></span>
                            </label>
                            <div className={styles.text}>{t('remember')}</div>
                        </div>
                        <button type="submit" className={styles.loginButton} onClick={login}>{t('login')}</button>
                    </div>
                </form>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={click} />
        </div>
    );
};

export default Login;