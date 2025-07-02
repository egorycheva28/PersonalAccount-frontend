import { useEffect } from "react";
import styles from "./profile.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileStudentThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProfileStudent = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [student, setStudent] = useState();
    const [educationLevel, setEducationLevel] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const open = () => setIsOpen(!isOpen);

    const chooseEducationLevel = (value) => {
        switch (value) {
            case "Бакалавриат":
                setEducationLevel('bachelor')
                break;
            case "Магистратура":
                setEducationLevel('master')
                break;
            case "Базовое высшее образование":
                setEducationLevel('basicHigherEducation')
                break;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const getStudent = await dispatch(getProfileStudentThunkCreator());
            if (getStudent && getStudent.error === 401) {
                navigate('/error401');
            }
            else if (getStudent && getStudent.error === 403) {
                navigate('/error403');
            }
            else if (getStudent && getStudent.error === 500) {
                navigate('/error500');
            }

            setStudent(getStudent);
            chooseEducationLevel(getStudent.educationEntries[0].educationLevel.name);
        };

        fetchData();
    }, []);

    return (
        <div className={styles.education}>
            <div className={styles.educationRow}>
                <span className={styles.educationLevel}>{t(educationLevel)}</span>
                {(student?.educationEntries[0].educationStatus.name == 'Является студентом') ? (
                    <div className={styles.openBlock1}>
                        <span className={styles.educationRole}>{t('student')}</span>
                        <img src={isOpen ? "/Chevron_Up.svg" : "/Chevron_Down.svg"} className={styles.click} onClick={open} />
                    </div>
                ) : (
                    <div className={styles.openBlock1}>
                        <span className={styles.educationRole}>{t('graduate')}</span>
                        <img src={isOpen ? "/Chevron_Up.svg" : "/Chevron_Down.svg"} className={styles.click} onClick={open} />
                    </div>
                )}
            </div>
            {(isOpen) ? (
                <div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('yearsStudy')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].educationYears.name}</span>
                        </div>
                        <div className={styles.educationForm2}>
                            <span className={styles.text}>{t('bookNumber')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].creditBooknumber}</span>
                        </div>
                    </div>
                    <div className={styles.educationLine}></div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('formStudy')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].educationForm.name}</span>
                        </div>
                    </div>
                    <div className={styles.educationLine}></div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('faculty')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].faculty.name}</span>
                        </div>
                    </div>
                    <div className={styles.educationLine}></div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('direction')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].educationDirection.name}</span>
                        </div>
                    </div>
                    <div className={styles.educationLine}></div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('profile')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].educationProfile.name}</span>
                        </div>
                    </div>
                    <div className={styles.educationLine}></div>
                    <div className={styles.educationRow}>
                        <div className={styles.educationForm}>
                            <span className={styles.text}>{t('course')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].course}</span>
                        </div>
                        <div className={styles.educationForm2}>
                            <span className={styles.text}>{t('group')}</span>
                            <span className={styles.answer}>{student?.educationEntries[0].group.name}</span>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </div>
    );
};

export default ProfileStudent;