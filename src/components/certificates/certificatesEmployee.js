import { useEffect } from "react";
import styles from "./certificates.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileEmployeeThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";
import CertificateItem from "./certificateItem";
import { createCertificateThunkCreator, getCertificatesThunkCreator } from "../../reducers/certificatesReducer";
import { useNavigate } from "react-router-dom";

const CertificateEmployee = ({ clicks, setClicks, setNotification }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [click, setClick] = useState(true);
    const [profile, setProfile] = useState();
    const [postsCount, setPostsCount] = useState([]);
    const [certificatesCount, setCertificatesCount] = useState([]);
    const [type, setType] = useState(null);
    const [staffType, setStaffType] = useState('ForPlaceOfWork');
    const [userType, setUserType] = useState('Employee');
    const [employeePostId, setEmployeePostId] = useState('');
    const [receiveType, setReceiveType] = useState(null);
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
            const result = await dispatch(createCertificateThunkCreator(type, staffType, userType, null, employeePostId, receiveType));

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

            const getProfile = await dispatch(getProfileEmployeeThunkCreator());
            if (click) {
                await dispatch(getCertificatesThunkCreator(userType, getProfile.posts[0].id));
            }
            else {
                await dispatch(getCertificatesThunkCreator(userType, getProfile.posts[1].id));
            }

            setType("");
            setReceiveType("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getProfileEmployeeThunkCreator());
            setProfile(getProfile);

            if (getProfile) {
                setPostsCount(getProfile.posts);
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
                setEmployeePostId(getProfile.posts[0].id);
                const getCertificates = await dispatch(getCertificatesThunkCreator(userType, getProfile.posts[0].id));
                setCertificatesCount(getCertificates);
            }
            else if (getProfile) {
                setEmployeePostId(getProfile.posts[1].id);
                const getCertificates = await dispatch(getCertificatesThunkCreator(userType, getProfile.posts[1].id));
                setCertificatesCount(getCertificates);
            }
        };

        fetchData();
    }, [click]);

    return (
        <div>
            {postsCount.length == 1 ? (
                <div className={styles.headers}>
                    <div className={click ? styles.educationOn1 : styles.educationOff1} onClick={() => handleClick(true)}>
                        <span className={click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.posts[0].postName.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{profile?.posts[0].employmentType}</span>
                    </div>
                </div>
            ) : (
                <div className={styles.headers}>
                    <div className={click ? styles.educationOn1 : styles.educationOff1} onClick={() => handleClick(true)}>
                        <span className={click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.posts[0].postName.name}</span>
                        <span className={click ? styles.textHeaderOn : styles.textHeaderOff}>{profile?.posts[0].employmentType}</span>
                    </div>
                    <div className={!click ? styles.educationOn2 : styles.educationOff2} onClick={() => handleClick(false)}>
                        <span className={!click ? styles.educationHeaderOn : styles.educationHeaderOff} >{profile?.posts[1].postName.name}</span>
                        <span className={!click ? styles.textHeaderOn : styles.textHeaderOff}>{profile?.posts[1].employmentType}</span>
                    </div>
                </div>
            )}
            <div className={styles.personalDatas}>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('position')}</span>
                        {postsCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.posts[1].postName.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.posts[0].postName.name}</span>
                        )}
                    </div>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('rate')}</span>
                        {postsCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.posts[1].rate}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.posts[0].rate}</span>
                        )}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('placeWork')}</span>
                        {postsCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.posts[1].departments[0].name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.posts[0].departments[0].name}</span>
                        )}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.row}>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('typePosition')}</span>
                        {postsCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.posts[1].postType.name}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.posts[0].postType.name}</span>
                        )}
                    </div>
                    <div className={styles.form}>
                        <span className={styles.text}>{t('typeEmployment')}</span>
                        {postsCount.length == 2 && !click ? (
                            <span className={styles.answer}>{profile?.posts[1].employmentType}</span>
                        ) : (
                            <span className={styles.answer}>{profile?.posts[0].employmentType}</span>
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

export default CertificateEmployee;