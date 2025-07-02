import { useEffect } from "react";
import styles from "./certificates.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileStudentThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";
import { createCertificateThunkCreator, getCertificatesThunkCreator } from "../../reducers/certificatesReducer";
import CertificateItem from "./certificateItem";
import { useNavigate } from "react-router-dom";

const CertificateStudent = ({ clicks, setClicks, setNotification }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [click, setClick] = useState(true);
    const [profile, setProfile] = useState();
    const [educationEntriesCount, setEducationEntriesCount] = useState([]);
    const [certificatesCount, setCertificatesCount] = useState([]);
    const [type, setType] = useState('');
    const [staffType, setStaffType] = useState('ForExperience');
    const [userType, setUserType] = useState('Student');
    const [educationEntryId, setEducationEntryId] = useState('');
    const [receiveType, setReceiveType] = useState('');
    const [errors, setErrors] = useState({});

    const list = useSelector(state => state.certificatesPage.certificatesList);

    const handleClick = (value) => setClick(value);

    const validateFields = () => {
        const newErrors = {};

        if (type == null || type == "") newErrors.type = t('typeCertificateRequired');
        if (receiveType == null || receiveType == "") newErrors.receiveType = t('typeOfCertificateRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const order = async () => {
        if (!validateFields()) {
            setClicks(clicks + 1);
            setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
        }
        else {
            const result = await dispatch(createCertificateThunkCreator(type, staffType, userType, educationEntryId, null, receiveType));

            if (!result) {
                setNotification({ message: t('certificateOrdered'), type: 'Success', show: true });
            }
            else if (result.error === 400) {
                setClicks(clicks + 1);
                setNotification({ message: t('cerificateInProgress'), type: 'Information', show: true });
            }
            else if (result.error === 401) {
                navigate('/error401');
            }
            else if (result.error === 403) {
                navigate('/error403');
            }
            else if (result.error === 500) {
                navigate('/error500');
            }
            else {
                setClicks(clicks + 1);
                setNotification({ message: t('incorrectlyEnteredData'), type: 'Error', show: true });
            }

            const getProfile = await dispatch(getProfileStudentThunkCreator());
            if (click) {
                await dispatch(getCertificatesThunkCreator(userType, getProfile.educationEntries[0].id));
            }
            else {
                await dispatch(getCertificatesThunkCreator(userType, getProfile.educationEntries[1].id));
            }

            setType("");
            setReceiveType("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getProfileStudentThunkCreator());
            setProfile(getProfile);
            if (getProfile) {
                setEducationEntriesCount(getProfile.educationEntries);
            }

            if (getProfile && getProfile.error === 401) {
                navigate('/error401');
            }
            else if (getProfile && getProfile.error === 403) {
                navigate('/error403');
            }
            else if (getProfile && getProfile.error === 500) {
                navigate('/error500');
            }

            if (click && getProfile) {
                setEducationEntryId(getProfile.educationEntries[0].id);
                const getCertificates = await dispatch(getCertificatesThunkCreator(userType, getProfile.educationEntries[0].id));
                setCertificatesCount(getCertificates);
            }
            else if (getProfile) {
                setEducationEntryId(getProfile.educationEntries[1].id);
                const getCertificates = await dispatch(getCertificatesThunkCreator(userType, getProfile.educationEntries[1].id));
                setCertificatesCount(getCertificates);
            }
        };

        fetchData();
    }, [click]);

    return (
        <div>
            {educationEntriesCount.length == 1 ? (
                <div className={styles.headers}>
                    <div className={click ? styles.educationOn1 : styles.educationOff1} onClick={() => handleClick(true)}>
                        <span className={click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.educationEntries[0].faculty.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{t('levelOfEducation')}: {profile?.educationEntries[0].educationLevel.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{t('status')}: {profile?.educationEntries[0].educationStatus.name}</span>
                    </div>
                </div>
            ) : (
                <div className={styles.headers}>
                    <div className={click ? styles.educationOn1 : styles.educationOff1} onClick={() => handleClick(true)}>
                        <span className={click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.educationEntries[0].faculty.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{t('levelOfEducation')}: {profile?.educationEntries[0].educationLevel.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{t('status')}: {profile?.educationEntries[0].educationStatus.name}</span>
                    </div>
                    <div className={!click ? styles.educationOn2 : styles.educationOff2} onClick={() => handleClick(false)}>
                        <span className={!click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.educationEntries[1].faculty.name}</span>
                        <span className={!click ? styles.textHeaderOn : styles.textHeaderOff}>{t('levelOfEducation')}: {profile?.educationEntries[1].educationLevel.name}</span>
                        <span className={!click ? styles.textHeaderOn : styles.textHeaderOff}>{t('status')}: {profile?.educationEntries[1].educationStatus.name}</span>
                    </div>
                </div>
            )}
            <div className={styles.personalDatas}>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('levelOfEducation')}</span>
                        {educationEntriesCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.educationEntries[1].educationLevel.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.educationEntries[0].educationLevel.name}</span>
                        )}
                    </div>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('status')}</span>
                        {educationEntriesCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.educationEntries[1].educationStatus.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.educationEntries[0].educationStatus.name}</span>
                        )}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('faculty')}</span>
                        {educationEntriesCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.educationEntries[1].faculty.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.educationEntries[0].faculty.name}</span>
                        )}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('direction')}</span>
                        {educationEntriesCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.educationEntries[1].educationDirection.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.educationEntries[0].educationDirection.name}</span>
                        )}
                    </div>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('group')}</span>
                        {educationEntriesCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.educationEntries[1].group.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.educationEntries[0].group.name}</span>
                        )}
                    </div>
                </div>
                <div className={styles.line}></div>
            </div>

            <div className={styles.orderCertificate}>
                <div className={styles.header}>
                    <span className={styles.header}>{t('toOrderACertificate')}</span>
                </div>
                <div className={styles.orderCertificateForm}>
                    <div className={styles.certificateTypeForm}>
                        <label htmlFor="chooseType">{t('type')}</label>
                        <select className={styles.certificateType} id="chooseType" name="choosing" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">{t('choose')}</option>
                            <option value="ForPlaceWhereNeeded">{t('forPlaceWhereNeeded')}</option>
                            <option value="PensionForKazakhstan">{t('pensionForKazakhstan')}</option>
                        </select>
                        {errors.type && <span className={styles.error}>{errors.type}</span>}
                    </div>
                    <div className={styles.certificateViewForm}>
                        <label htmlFor="chooseView" >{t('typeOfCertificate')}</label>
                        <select className={styles.certificateView} id="chooseView" name="choosing" value={receiveType} onChange={(e) => setReceiveType(e.target.value)}>
                            <option value="">{t('choose')}</option>
                            <option value="Electronic">{t('electronic')}</option>
                            <option value="Paper">{t('paper')}</option>
                        </select>
                        {errors.receiveType && <span className={styles.error1}>{errors.receiveType}</span>}
                    </div>
                    <button className={styles.orderButton} type="submit" onClick={order}>{t('order')}</button>
                </div>
            </div>

            {certificatesCount.length == 0 ? (
                null
            ) : (
                <div className={styles.certificatesList}>
                    {list.map((value) => (
                        <CertificateItem type={value.type} certificateFile={value.certificateFile} dateOfForming={value.dateOfForming}
                            receiveType={value.receiveType} receiveTypeEnumDto={value.receiveTypeEnumDto} signatureFile={value.signatureFile}
                            staffType={value.staffType} staffTypeEnumDto={value.staffTypeEnumDto} status={value.status} statusEnumDto={value.statusEnumDto}
                            typeEnumDto={value.typeEnumDto} userType={value.userType} userTypeEnumDto={value.userTypeEnumDto} id={value.id} key={value.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CertificateStudent;