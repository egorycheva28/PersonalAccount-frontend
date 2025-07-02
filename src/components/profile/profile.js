import { useEffect, useRef } from "react";
import styles from "./profile.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { editAvatarThunkCreator, getProfileThunkCreator } from "../../reducers/profileReducer";
import { useTranslation } from "react-i18next";
import ProfileEmployee from "./profileEmployee";
import ProfileStudent from "./profileStudent";
import PersonalData from "./personalData";
import Contacts from "./contacts";
import { addFileThunkCreator, getFileThunkCreator } from "../../reducers/filesReducer";
import { useLocation, useNavigate } from "react-router-dom";
import AvatarEditor from 'react-avatar-editor';
import Notification from "../errors/notification";

const Profile = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = location.state || {};

    const [profile, setProfile] = useState();
    const [userRoles, setUserRoles] = useState([]);
    const [avatar, setAvatar] = useState();
    const [click, setClick] = useState(true);
    const [editAvatar, setEditAvatar] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);

    //добавление изображения с компа
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = async (event) => {
        setSelectedFile(null);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadCroppedImage = async () => {
        if (fileInputRef.current) {
            const canvas = fileInputRef.current.getImageScaledToCanvas();
            canvas.toBlob(async () => {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const id = await dispatch(addFileThunkCreator(formData));
                const result = await dispatch(editAvatarThunkCreator(id.id));
                setEditAvatar(!editAvatar);
                if (!result) {
                    setClicks(clicks + 1);
                    setNotification({ message: t('avatarChanged'), type: 'Success', show: true });
                }
                else {
                    setClicks(clicks + 1);
                    setNotification({ message: t('errorChangingAvatar'), type: 'Error', show: true });
                }
            });
        }
    };

    const handleClick = (value) => setClick(value);
    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    useEffect(() => {
        if (message && Object.keys(message).length !== 0) {
            setNotification({ message: message, type: 'Success', show: true });
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const getProfile = await dispatch(getProfileThunkCreator());
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
            setUserRoles(getProfile.userTypes);

            const getAvatar = await dispatch(getFileThunkCreator(getProfile.avatar.id));
            if (getAvatar && getAvatar.error === 401) {
                navigate('/error401');
            }
            else if (getAvatar && getAvatar.error === 403) {
                navigate('/error403');
            }
            else if (getAvatar && getAvatar.error === 500) {
                navigate('/error500');
            }

            localStorage.setItem('avatarId', getProfile.avatar.id);
            window.dispatchEvent(new Event('updateAvatarId'));
            const imageObjectURL = URL.createObjectURL(getAvatar);
            setAvatar(imageObjectURL);
        };

        fetchData();
    }, [editAvatar]);

    return (
        <div className={styles.profileContainer}>
            <div className={styles.headerPage}>
                <span>{t('profile')}</span>
            </div>
            <div className={styles.body}>
                <div className={styles.name2}>{profile?.lastName} {profile?.firstName} {profile?.patronymic}</div>
                <div className={styles.infoBody}>
                    <div className={styles.leftCol}>
                        <div className={styles.avatarBlock} onClick={handleButtonClick}>
                            <img src={avatar} className={styles.avatar} />
                            <input type="file" accept="image/*" id="fileInput" className={styles.inputFiles} ref={fileInputRef} onChange={handleFileChange} />
                            {imagePreview && (
                                <div className={styles.inputFiles}>
                                    <AvatarEditor ref={fileInputRef} image={imagePreview} width={250} height={250} border={50} scale={1.2} rotate={0}
                                        onImageReady={uploadCroppedImage} />
                                </div>
                            )}
                        </div>
                        <PersonalData />
                        <Contacts />
                    </div>
                    <div className={styles.rightCol}>
                        <div className={styles.name}>{profile?.lastName} {profile?.firstName} {profile?.patronymic}</div>
                        <div className={styles.info}>
                            {userRoles.length === 0 ? (
                                null
                            ) : (
                                <div>
                                    {
                                        userRoles.length === 2 ? (
                                            <div className={styles.headers}>
                                                <div className={click ? styles.educationOn : styles.educationOff} onClick={() => handleClick(true)}>
                                                    <span className={click ? styles.educationHeaderOn : styles.educationHeaderOff}>{t('education')}</span>
                                                </div>
                                                <div className={!click ? styles.workOn : styles.workOff} onClick={() => handleClick(false)}>
                                                    <span className={!click ? styles.workHeaderOn : styles.workHeaderOff}>{t('work')}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            userRoles[0] === 'Student' ? (
                                                <div className={styles.headers}>
                                                    <div className={styles.educationOn}>
                                                        <span className={styles.educationHeaderOn}>{t('education')}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.headers}>
                                                    <div className={styles.workOn}>
                                                        <span className={styles.workHeaderOn}>{t('work')}</span>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            )}
                            {userRoles.length === 0 ? (
                                null
                            ) : (
                                <div>
                                    {(click && userRoles[0] === 'Student') ? (
                                        <ProfileStudent />
                                    ) : (
                                        <ProfileEmployee />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default Profile;