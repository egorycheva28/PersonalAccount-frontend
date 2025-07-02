import { useEffect } from "react";
import styles from "./profile.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileEmployeeThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProfileEmployee = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState();
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(true);
    const [isOpen3, setIsOpen3] = useState(true);
    const [commonLengthService, setCommonLengthService] = useState();
    const [pedagogicalLengthService, setPedagogicalLengthService] = useState();
    const [currentLengthService, setCurrentLengthService] = useState();

    const open1 = () => setIsOpen1(!isOpen1);
    const open2 = () => setIsOpen2(!isOpen2);
    const open3 = () => setIsOpen3(!isOpen3);

    const formatDate = (date) => {
        if (!date) return "Нет данных";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    const pluralFormMonth = (number, singular, less5, more4) => {
        if (number > 4) {
            return more4;
        }
        if (number == 1) {
            return singular;
        }
        if (number < 5 && number > 1) {
            return less5;
        }
        else {
            return more4;
        }
    };

    const pluralFormYear = (number, more4, singular, less5) => {
        if (number > 4 && number < 21) {
            return more4;
        }
        if (number % 10 == 1) {
            return singular;
        }
        if (number % 10 > 1 && number % 10 < 5) {
            return less5;
        }
        else {
            return more4;
        }
    };

    const lengthService = (value) => {
        switch (value.type) {
            case "Common":
                setCommonLengthService(value);
                break;
            case "Pedagogical":
                setPedagogicalLengthService(value);
                break;
            case "OnCurrentPlace":
                setCurrentLengthService(value);
                break;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const getEmployee = await dispatch(getProfileEmployeeThunkCreator());
            if (getEmployee && getEmployee.error === 401) {
                navigate('/error401');
            }
            else if (getEmployee && getEmployee.error === 403) {
                navigate('/error403');
            }
            else if (getEmployee && getEmployee.error === 500) {
                navigate('/error500');
            }
            setEmployee(getEmployee);
            lengthService(getEmployee?.experience[0]);
            lengthService(getEmployee?.experience[1]);
        };

        fetchData();
    }, []);

    return (
        <div className={styles.work}>
            <div className={styles.openBlock2}>
                <span className={styles.experience}>{t('lengthService')}</span>
                <img src={isOpen1 ? "/Chevron_Up.svg" : "/Chevron_Down.svg"} className={styles.click} onClick={open1} />
            </div>
            <div className={styles.divider1}></div>
            {isOpen1 ? (
                <div >
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('totalLengthService')}</span>
                            <span className={styles.answer}>{commonLengthService ? (commonLengthService.years + " " + pluralFormYear(commonLengthService.years, "лет", "год", "года") + " " + commonLengthService.months + " месяц" + pluralFormMonth(commonLengthService.months, "", "а", "ев")) : null}</span>
                        </div>
                        <div className={styles.employeeForm2}>
                            <span className={styles.text}>{t('teachingExperience')}</span>
                            <span className={styles.answer}>{pedagogicalLengthService ? (pedagogicalLengthService.years + " " + pluralFormYear(pedagogicalLengthService.years, "лет", "год", "года") + " " + pedagogicalLengthService.months + " месяц" + pluralFormMonth(pedagogicalLengthService.months, "", "а", "ев")) : null}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('currentLengthService')}</span>
                            <span className={styles.answer}>{currentLengthService ? (currentLengthService.years + " " + pluralFormYear(currentLengthService.years, "лет", "год", "года") + " " + currentLengthService.months + " месяц" + pluralFormMonth(currentLengthService.months, "", "а", "ев")) : null}</span>
                        </div>
                    </div>
                </div>) : (null)}
            <div className={styles.divider2}></div>
            <div className={styles.openBlock2}>
                <span className={styles.profession}>{employee?.posts[0].postName.name}</span>
                <img src={isOpen2 ? "/Chevron_Up.svg" : "/Chevron_Down.svg"} className={styles.click} onClick={open2} />
            </div>
            {isOpen2 ? (
                <div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('typeEmployment')}</span>
                            <span className={styles.answer}>{employee?.posts[0].employmentType}</span>
                        </div>
                        <div className={styles.employeeForm2}>
                            <span className={styles.text}>{t('rate')}</span>
                            <span className={styles.answer}>{employee?.posts[0].rate}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('placeWork')}</span>
                            <span className={styles.answer}>{employee?.posts[0].departments[0].name}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('typePosition')}</span>
                            <span className={styles.answer}>{employee?.posts[0].postType.name}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('direction')}</span>
                            <span className={styles.answer}></span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('dateHiring')}</span>
                            <span className={styles.answer}>{formatDate(employee?.posts[0].dateStart)}</span>
                        </div>
                        <div className={styles.employeeForm2}>
                            <span className={styles.text}>{t('dateDismissal')}</span>
                            <span className={styles.answer}>{formatDate(employee?.posts[0].dateEnd)}</span>
                        </div>
                    </div>
                </div>) : (null)}
            <div className={styles.divider2}></div>
            <div className={styles.openBlock2}>
                <span className={styles.profession}>{employee?.posts[1].postName.name}</span>
                <img src={isOpen3 ? "/Chevron_Up.svg" : "/Chevron_Down.svg"} className={styles.click} onClick={open3} />
            </div>
            {isOpen3 ? (
                <div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('typeEmployment')}</span>
                            <span className={styles.answer}>{employee?.posts[1].employmentType}</span>
                        </div>
                        <div className={styles.employeeForm2}>
                            <span className={styles.text}>{t('rate')}</span>
                            <span className={styles.answer}>{employee?.posts[1].rate}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('placeWork')}</span>
                            <span className={styles.answer}>{employee?.posts[1].departments[0].name}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('typePosition')}</span>
                            <span className={styles.answer}>{employee?.posts[1].postType.name}</span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('direction')}</span>
                            <span className={styles.answer}></span>
                        </div>
                    </div>
                    <div className={styles.employeeLine}></div>
                    <div className={styles.employeeRow}>
                        <div className={styles.employeeForm}>
                            <span className={styles.text}>{t('dateHiring')}</span>
                            <span className={styles.answer}>{formatDate(employee?.posts[1].dateStart)}</span>
                        </div>
                        <div className={styles.employeeForm2}>
                            <span className={styles.text}>{t('dateDismissal')}</span>
                            <span className={styles.answer}>{formatDate(employee?.posts[1].dateEnd)}</span>
                        </div>
                    </div>
                </div>) : (null)}
        </div>
    );
};

export default ProfileEmployee;