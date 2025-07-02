import styles from "./errors.module.css";
import { useNavigate } from "react-router-dom";

const ErrorUnauthorized = () => {
    const navigate = useNavigate();

    const backToMain = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('roles');
        //localStorage.removeItem('avatarId');
        navigate('/events');
    };

    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.errorLine1}>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
            </div>
            <div className={styles.errorLine2}>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
                <span className={styles.errorText}>Ошибка</span>
            </div>
            <span className={styles.statusError}>401</span>
            <div className={styles.errorBlock}>
                <div className={styles.errorName}>
                    <span>You are unauthorized</span>
                    <span>Вы не авторизованы</span>
                </div>
                <button className={styles.buttonMain} onClick={backToMain}>ВЕРНУТЬСЯ НА ГЛАВНУЮ</button>
            </div>
            <div className={styles.errorDescription}>
                <span className={styles.errorQuestion}>Что случилось?</span>
                <span className={styles.errorAnswwer}>Вы не вошли в систему</span>
            </div>
        </div>
    );
};

export default ErrorUnauthorized;
