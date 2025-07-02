import { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "./createEvent.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { editEventThunkCreator, getEventByIdThunkCreator } from '../../../reducers/administrationReducer';
import { addFileThunkCreator, getFileThunkCreator } from '../../../reducers/filesReducer';
import Notification from '../../errors/notification';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AddressSuggestions } from 'react-dadata';

const EditEvent = () => {
    const { t } = useTranslation();
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [event, setEvent] = useState();
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [dateTimeFrom, setDateTimeFrom] = useState(null);
    const [isTimeFromNeeded, setIsTimeFromNeeded] = useState(true);
    const [dateTimeTo, setDateTimeTo] = useState(null);
    const [isTimeToNeeded, setIsTimeToNeeded] = useState(true);
    const [type, setType] = useState(null);
    const [auditory, setAuditory] = useState(0);
    const [isRegistrationRequired, setIsRegistrationRequired] = useState(true);
    const [registrationLastDate, setRegistrationLastDate] = useState(null);
    const [format, setFormat] = useState(null);
    const [link, setLink] = useState(null);
    const [addressName, setAddressName] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [isDigestNeeded, setIsDigestNeeded] = useState(true);
    const [digesText, setDigesText] = useState(null);
    const [notificationText, setNotificationText] = useState(null);
    const [picture, setPicture] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);
    const [errors, setErrors] = useState({});
    const [pictureid, setPictureid] = useState(null);

    const translateType = {
        "Open": 0,
        "Close": 1
    }

    const translateFormat = {
        "Online": 0,
        "Offline": 1
    }

    const translateAuditory = {
        "All": 0,
        "Students": 1,
        "Employees": 2
    }

    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState(t('uploadImage'));
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFileName(file.name);
        }
    };

    const handleAddressChange = (value) => {
        setAddressName(value.value);
        setLatitude(value.data.geo_lat);
        setLongitude(value.data.geo_lon);
    };

    const handleAddressSelect = (value) => {
        setLatitude(value.data.geo_lat);
        setLongitude(value.data.geo_lon);
    };

    const handleButtonClick = () => fileInputRef.current.click();
    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');
    const eventsPage = () => navigate('/admin/events');

    const deletePicture = () => {
        setFileName(t('uploadImage'));
        setPictureid(null);
    }

    const validateFields = () => {
        const newErrors = {};

        if (title == null) newErrors.title = t('eventNameRequired');
        if (description == null) newErrors.description = t('descriptionEventRequired');
        if (dateTimeFrom == null) newErrors.dateTimeFrom = t('startTimeRequired');
        if (dateTimeTo == null) newErrors.dateTimeTo = t('endTimeRequired');
        if (type == null) newErrors.type = t('eventTypeRequired');
        if (format == null) newErrors.format = t('eventFormatRequired');
        if (auditory == null) newErrors.auditory = t('eventAudienceRequired');
        if (latitude == null) newErrors.latitude = t('eventLatitudeRequired');
        if (longitude == null) newErrors.longitude = t('eventLongitudeRequired');
        if (digesText == null) newErrors.digesText = t('eventDigestTextRequired');
        if (addressName == null) newErrors.addressName = t('eventAddressRequired');
        if (registrationLastDate == null) newErrors.registrationLastDate = t('eventRegistrationDeadlineRequired');
        if (link == null) newErrors.link = t('eventLinkRequired');

        if (type == 0) {
            delete newErrors.auditory;
        }
        if (format == 1) {
            delete newErrors.link;
        }
        if (format == 0) {
            delete newErrors.latitude;
            delete newErrors.longitude;
            delete newErrors.addressName;
        }
        if (!isTimeToNeeded) {
            delete newErrors.dateTimeTo;
        }
        if (!isDigestNeeded) {
            delete newErrors.digesText;
        }
        if (!isRegistrationRequired) {
            delete newErrors.registrationLastDate;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatTime = (date) => {
        const parts = new Date(date.replace(' ', 'T'));

        if (isNaN(parts)) {
            console.error('Неправильный формат даты');
            return null;
        }

        parts.setHours(parts.getHours() + 7);

        const year = parts.getFullYear();
        const month = (parts.getMonth() + 1).toString().padStart(2, '0');
        const day = parts.getDate().toString().padStart(2, '0');
        const hours = parts.getHours().toString().padStart(2, '0');
        const minutes = parts.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const reverseDateFormat = (date) => {
        if (!date) return "Нет данных";

        const parts = date.split('T');
        if (parts.length !== 2) {
            throw new Error("Неправильный формат даты и времени");
        }

        const dateParts = parts[0].split('-');
        if (dateParts.length !== 3) {
            throw new Error("Неправильный формат даты");
        }

        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${year}-${month}-${day}`;
    };

    const reverseTimeFormat = (date) => {
        if (!date) return null;

        const parts = date.split('T');
        if (parts.length !== 2) {
            throw new Error("Неправильный формат даты и времени");
        }

        const dateParts = parts[0].split('-');
        if (dateParts.length !== 3) {
            throw new Error("Неправильный формат даты");
        }

        const timeParts = parts[1].split(':');
        if (timeParts.length !== 3) {
            throw new Error("Неправильный формат времени");
        }

        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        const hours = timeParts[0];
        const minutes = timeParts[1];

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const editEvent = async () => {
        if (selectedFile != null) {
            const pictureId = await dispatch(addFileThunkCreator(formData));
            if (!validateFields() && !type && !format) {
                setClicks(clicks + 1);
                setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
            }
            else {
                if (dateTimeTo && (dateTimeFrom > dateTimeTo)) {
                    setClicks(clicks + 1);
                    setNotification({ message: t('eventStartEndDates'), type: 'Warning', show: true });
                }
                else {
                    if (isTimeFromNeeded) {
                        var dateFrom = formatTime(dateTimeFrom);
                    }
                    else {
                        var dateFrom = dateTimeFrom;
                    }
                    if (isTimeToNeeded) {
                        var dateTo = formatTime(dateTimeTo);
                    }
                    else {
                        var dateTo = dateTimeTo;
                    }
                    const result = await dispatch(editEventThunkCreator(title, description, digesText, pictureId.id, isTimeFromNeeded, dateFrom,
                        isTimeToNeeded, dateTo, link, addressName, latitude, longitude, isRegistrationRequired, registrationLastDate,
                        isDigestNeeded, notificationText, type, format, auditory, id));
                    if (!result) {
                        const message = t('eventChanged');
                        navigate('/admin/events', { state: { message } });
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
                        setNotification({ message: t('failedEditEvent'), type: 'Error', show: true });
                    }
                }
            }
        }
        else {
            if (!validateFields()) {
                setClicks(clicks + 1);
                setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
            }
            else {
                if (dateTimeTo && (dateTimeFrom > dateTimeTo)) {
                    setClicks(clicks + 1);
                    setNotification({ message: t('eventStartEndDates'), type: 'Warning', show: true });
                }
                else {
                    if (isTimeFromNeeded) {
                        var dateFrom = formatTime(dateTimeFrom);
                    }
                    else {
                        var dateFrom = dateTimeFrom;
                    }
                    if (isTimeToNeeded) {
                        var dateTo = formatTime(dateTimeTo);
                    }
                    else {
                        var dateTo = dateTimeTo;
                    }
                    const result = await dispatch(editEventThunkCreator(title, description, digesText, pictureid, isTimeFromNeeded, dateFrom,
                        isTimeToNeeded, dateTo, link, addressName, latitude, longitude, isRegistrationRequired, registrationLastDate,
                        isDigestNeeded, notificationText, type, format, auditory, id));
                    if (!result) {
                        const message = t('eventChanged');
                        navigate('/admin/events', { state: { message } });
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
                        setNotification({ message: t('failedEditEvent'), type: 'Error', show: true });
                    }
                }
            }
        }
    };

    const cancel = () => navigate('/admin/events');

    useEffect(() => {
        const fetchData = async () => {
            const getEvent = await dispatch(getEventByIdThunkCreator(id));
            setEvent(getEvent);
            setTitle(getEvent.title);
            setDescription(getEvent.description);
            setIsTimeFromNeeded(getEvent.isTimeFromNeeded);
            setIsTimeToNeeded(getEvent.isTimeToNeeded);

            if (!getEvent.isTimeFromNeeded) {
                setDateTimeFrom(reverseDateFormat(getEvent.dateTimeFrom));
            }
            else {
                setDateTimeFrom(reverseTimeFormat(getEvent.dateTimeFrom));
            }
            if (!getEvent.isTimeToNeeded) {
                setDateTimeTo(reverseDateFormat(getEvent.dateTimeTo));
            }
            else {
                setDateTimeTo(reverseTimeFormat(getEvent.dateTimeTo));
            }

            setType(translateType[getEvent.type]);
            setAuditory(translateAuditory[getEvent.auditory]);
            setIsRegistrationRequired(getEvent.isRegistrationRequired);
            if (getEvent.isRegistrationRequired) {
                setRegistrationLastDate(reverseDateFormat(getEvent.registrationLastDate));
            }
            else {
                setRegistrationLastDate(getEvent.registrationLastDate);
            }
            setFormat(translateFormat[getEvent.format]);
            setLink(getEvent.link);
            setAddressName(getEvent.addressName);
            setLatitude(getEvent.latitude);
            setLongitude(getEvent.longitude);
            setIsDigestNeeded(getEvent.isDigestNeeded);
            setDigesText(getEvent.digestText);
            setNotificationText(getEvent.notificationText);

            if (getEvent.picture != null) {
                setFileName(getEvent.picture.name);
                setPictureid(getEvent.picture.id);
                const getPicture = await dispatch(getFileThunkCreator(getEvent.picture.id));
                if (getPicture != null) {
                    const imageObjectURL = URL.createObjectURL(getPicture); // Создаем URL для изображения
                    setPicture(imageObjectURL);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.createEventContainer}>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage} onClick={eventsPage}>{t('events')} / </span>
                <span className={styles.linkPage2}>{t('editiingEvent')}</span>
            </div>
            <div className={styles.createEventInformation}>
                <div>
                    <span className={styles.header}>{t('editiingEvent')}</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.nameForm}>
                        <label htmlFor="eventName">{t('eventName')}</label>
                        <input type="text" className={styles.inputForm} value={title} onChange={(e) => setTitle(e.target.value)} />
                        {errors.title && <span className={styles.error}>{errors.title}</span>}
                    </div>
                    <div>
                        <span className={styles.headers}>{t('descriptionOfTheEvent')}</span>
                        <div className={styles.descriptionBlock}>
                            <div className={styles.formBlock}>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    modules={{
                                        toolbar: [
                                            ['clean'],
                                            [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'color': [] }, { 'background': [] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['link', 'image']
                                        ],
                                    }}
                                />
                            </div>
                            {errors.description && <span className={styles.error}>{errors.description}</span>}
                            <div className={styles.row10}>
                                <div className={styles.dates}>
                                    <div className={styles.startTimeForm}>
                                        <label htmlFor="eventName">{t('startTime')}</label>
                                        <input type={isTimeFromNeeded ? 'datetime-local' : 'date'} className={styles.dateInputForm} value={dateTimeFrom} onChange={(e) => setDateTimeFrom(e.target.value)} />
                                    </div>
                                    <div className={styles.time}>
                                        <span className={styles.timeHeader}>{t('time')}</span>
                                        <label className={styles.switch} >
                                            <input type="checkbox" checked={isTimeFromNeeded} onChange={(e) => setIsTimeFromNeeded(e.target.checked)} />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                                {errors.dateTimeFrom && <span className={styles.error2}>{errors.dateTimeFrom}</span>}
                                <div className={styles.dates}>
                                    <div className={styles.endTimeForm}>
                                        <label htmlFor="eventName">{t('endTime')}</label>
                                        <input type={isTimeToNeeded ? 'datetime-local' : 'date'} className={styles.dateInputForm} value={dateTimeTo} onChange={(e) => setDateTimeTo(e.target.value)} />
                                    </div>
                                    <div className={styles.time}>
                                        <span className={styles.timeHeader}>{t('time')}</span>
                                        <label className={styles.switch} >
                                            <input type="checkbox" checked={isTimeToNeeded} onChange={(e) => setIsTimeToNeeded(e.target.checked)} />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                                {errors.dateTimeTo && <span className={styles.error3}>{errors.dateTimeTo}</span>}
                            </div>
                            <div className={styles.errorsTime}>
                                {errors.dateTimeFrom && <span className={styles.error}>{errors.dateTimeFrom}</span>}
                                {errors.dateTimeTo && <span className={styles.error1}>{errors.dateTimeTo}</span>}
                            </div>
                            <div className={styles.row}>
                                <div className={styles.typeOfEvent}>
                                    <label htmlFor="typeOfEvent">{t('typeOfEvent')}</label>
                                    <select className={(type == 1) ? (styles.inputFormClose) : (styles.inputFormOpen)} id="typeOfEvent" value={type} onChange={(e) => setType(e.target.value)} >
                                        <option value=""></option>
                                        <option value="0">Открытый</option>
                                        <option value="1">Закрытый</option>
                                    </select>
                                    {errors.type && <span className={styles.error}>{errors.type}</span>}
                                </div>
                                {(type == 1) ? (
                                    <div className={styles.targetAudience}>
                                        <label htmlFor="targetAudience">{t('targetAudience')}</label>
                                        <select className={styles.inputFormClose} id="targetAudience" value={auditory} onChange={(e) => setAuditory(e.target.value)} >
                                            <option value=""></option>
                                            <option value="0">Все</option>
                                            <option value="1">Студенты</option>
                                            <option value="2">Работники</option>
                                        </select>
                                        {errors.auditory && <span className={styles.error}>{errors.auditory}</span>}
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>
                            <div className={styles.registration}>
                                <div className={styles.registrationRequired}>
                                    <span className={styles.headers}>{t('registrationRequired')}</span>
                                    <label className={styles.switch} >
                                        <input type="checkbox" checked={isRegistrationRequired} onChange={(e) => setIsRegistrationRequired(e.target.checked)} />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                                {isRegistrationRequired ? (
                                    <div>
                                        <div className={styles.registrationForm}>
                                            <label htmlFor="registrationEndDate">{t('registrationEndDate')}</label>
                                            <input type="date" className={styles.inputForm} value={registrationLastDate} onChange={(e) => setRegistrationLastDate(e.target.value)} />
                                            {errors.registrationLastDate && <span className={styles.error}>{errors.registrationLastDate}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>
                            <div className={styles.formatOfTheEvents}>
                                <label htmlFor="formatOfTheEvents">{t('formatOfTheEvents')}</label>
                                <select className={styles.formatOfTheEventsForm} id="formatOfTheEvents" value={format} onChange={(e) => setFormat(e.target.value)} >
                                    <option value=""></option>
                                    <option value="0">Онлайн</option>
                                    <option value="1">Офлайн</option>
                                </select>
                                {errors.format && <span className={styles.error}>{errors.format}</span>}
                            </div>
                            {format !== "" ? (
                                (format == 0) ? (
                                    <div className={styles.linkForm}>
                                        <label htmlFor="link">{t('link')}</label>
                                        <input type="text" className={styles.inputForm} value={link} onChange={(e) => setLink(e.target.value)} />
                                        {errors.link && <span className={styles.error}>{errors.link}</span>}
                                    </div>) : (
                                    <div className={styles.address}>
                                        <span className={styles.headers}>{t('addressOfTheEvent')}</span>
                                        <div className={styles.addressInput}>
                                            <div className={styles.addressForm}>
                                                <label htmlFor="address">{t('address')}</label>
                                                <AddressSuggestions
                                                    inputProps={{ className: styles.inputForm }}
                                                    value={addressName}
                                                    onChange={handleAddressChange}
                                                    onSelect={handleAddressSelect}
                                                    token='3e95d4a01ef60c17d65b82c5b862fca519f948d3'
                                                />
                                                {errors.addressName && <span className={styles.error}>{errors.addressName}</span>}
                                            </div>
                                            <div className={styles.row}>
                                                <div className={styles.longitudeForm}>
                                                    <label htmlFor="longitude">{t('longitude')}</label>
                                                    <input type="text" className={styles.longitudeInputForm} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                                                    {errors.longitude && <span className={styles.error}>{errors.longitude}</span>}
                                                </div>
                                                <div className={styles.latitudeForm}>
                                                    <label htmlFor="latitude">{t('latitude')}</label>
                                                    <input type="text" className={styles.latitudeInputForm} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                                                    {errors.latitude && <span className={styles.error}>{errors.latitude}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                null
                            )}
                        </div>
                        <div className={styles.digest}>
                            <div className={styles.includeEventsInDigest}>
                                <span className={styles.headers}>{t('includeEventsInDigest')}</span>
                                <label className={styles.switch} >
                                    <input type="checkbox" checked={isDigestNeeded} onChange={(e) => setIsDigestNeeded(e.target.checked)} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            {isDigestNeeded ? (
                                <div>
                                    <div className={styles.formBlock}>
                                        <ReactQuill
                                            theme="snow"
                                            value={digesText}
                                            onChange={setDigesText}
                                            modules={{
                                                toolbar: [
                                                    ['clean'],
                                                    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    [{ 'align': [] }],
                                                    ['link', 'image']
                                                ],
                                            }}
                                        />
                                    </div>
                                    {errors.digesText && <span className={styles.error}>{errors.digesText}</span>}
                                </div>
                            ) : (
                                null
                            )}

                        </div>
                        <div className={styles.notification}>
                            <span className={styles.headers}>{t('eventNotification')}</span>
                            <div className={styles.formBlock}>
                                <ReactQuill
                                    theme="snow"
                                    value={notificationText}
                                    onChange={setNotificationText}
                                    modules={{
                                        toolbar: [
                                            ['clean'],
                                            [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'color': [] }, { 'background': [] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['link', 'image']
                                        ],
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.files}>
                        <span className={styles.headers}>{t('files')}</span>
                        <div >
                            {fileName != t('uploadImage') ? (
                                <div className={styles.formFiles}>
                                    <img src="../addLogo.png" className={styles.logoIcon} />
                                    <span>{fileName}</span>
                                    <img src="../deleteLogo.png" className={styles.deleteLogoIcon} onClick={deletePicture} />
                                </div>
                            ) : (
                                <div className={styles.formFiles} onClick={handleButtonClick}>
                                    <img src="../addLogo.png" className={styles.logoIcon} onClick={handleButtonClick} />
                                    <span>{fileName}</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className={styles.inputFiles} ref={fileInputRef} onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.buttonSave} onClick={editEvent}>{t('save')}</button>
                        <button className={styles.buttonCancel} onClick={cancel}>{t('cancel')}</button>
                    </div>
                </div>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default EditEvent;