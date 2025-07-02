import styles from "./usersList.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function UserItem(props) {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const detail = () => navigate(`/admin/users/${props.id}`);

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    return (
        <div className={styles.userItem} onClick={() => detail()}>
            <div className={styles.header}>
                <span>{props.lastName} {props.firstName} {props.patronymic}</span>
            </div>
            <div>
                <span className={styles.text}>{t('birthDate')}: </span>
                <span className={styles.answer}>{formatDate(props.birthDate)}</span>
            </div>
            <div>
                <span className={styles.text}>Email: </span>
                <span className={styles.answer}>{props.email}</span>
            </div>
        </div>
    );
};

export default UserItem;