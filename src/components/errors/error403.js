import styles from "./errors.module.css";
import { useNavigate } from "react-router-dom";

const ErrorForbidden = () => {
    const navigate = useNavigate();

    const backToMain = () => {
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
            <span className={styles.statusError}>403</span>
            <div className={styles.errorBlock}>
                <div className={styles.errorName}>
                    <span>Access forbidden</span>
                    <span>Доступ запрещён</span>
                </div>
                <button className={styles.buttonMain} onClick={backToMain}>ВЕРНУТЬСЯ НА ГЛАВНУЮ</button>
            </div>
            <div className={styles.errorDescription}>
                <span className={styles.errorQuestion}>Что случилось?</span>
                <span className={styles.errorAnswwer}>Доступ к этой странице запрещен или у вас нет прав на просмотр контента</span>
            </div>
        </div>
    );
};

export default ErrorForbidden;
