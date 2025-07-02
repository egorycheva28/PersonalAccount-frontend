import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from "react-redux";
import styles from "./usefulServicesAdmin.module.css";
import { useTranslation } from "react-i18next";
import { deleteUsefulServiceThunkCreator, editUsefulServiceThunkCreator } from '../../../reducers/administrationReducer';
import { addFileThunkCreator, getFileThunkCreator } from '../../../reducers/filesReducer';
import { getUsefulServicesThunkCreator } from '../../../reducers/usefulServicesReducer';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function UsefulServiceItem(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const typeServiceTranslateBack = {
        "ForAll": 0,
        "Students": 1,
        "Employees": 2
    }

    const typeServiceTranslate = {
        "ForAll": "Общий",
        "Students": "Студент",
        "Employees": "Сотрудник"
    }

    const [open, setOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState(props.title ? props.title : '');
    const [link, setLink] = useState(props.link ? props.link : '');
    const [category, setCategory] = useState(props.category ? typeServiceTranslateBack[props.category] : "");
    const [description, setDescription] = useState(props.description ? props.description : '');
    const [termsOfDisctribution, setTermsOfDisctribution] = useState(props.termsOfDisctribution ? props.termsOfDisctribution : '');
    const [logoId, setLogoId] = useState(props.logo ? props.logo.id : null);
    const [logo, setLogo] = useState(null);
    const [errors, setErrors] = useState({});

    //добавление изображения с компа
    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState(props.logo ? props.logo.name : t('uploadImage'));
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

    const handleButtonClick = () => fileInputRef.current.click();
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const handleClick = () => setOpen(!open);

    const deleteLogo = () => {
        setFileName(t('uploadImage'));
        setLogoId(null);
    }

    const validateFields = () => {
        const newErrors = {};

        if (category == null || category == "") newErrors.category = t('serviceTypeRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const editService = async () => {
        if (!validateFields()) {
            props.setClicks(props.clicks + 1);
            props.setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
        }
        else {
            if (selectedFile != null) {
                const id = await dispatch(addFileThunkCreator(formData));
                setLogoId(id);
                const result = await dispatch(editUsefulServiceThunkCreator(props.id, category, title, description, link, termsOfDisctribution, id.id));
                if (!result) {
                    props.setNotification({ message: t('usefulServiceChanged'), type: 'Success', show: true });
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
            }
            else {
                const result = await dispatch(editUsefulServiceThunkCreator(props.id, category, title, description, link, termsOfDisctribution, logoId));
                if (!result) {
                    props.setNotification({ message: t('usefulServiceChanged'), type: 'Success', show: true });
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
            }
            closeModal();
            await dispatch(getUsefulServicesThunkCreator('categories=Students&categories=Employees', props.page, props.pageSize));
            props.updateUrl();
            window.location.reload();
        }
    }

    const deleteService = async () => {
        const result = await dispatch(deleteUsefulServiceThunkCreator(props.id));
        if (!result) {
            props.setNotification({ message: t('usefulServiceRemoved'), type: 'Success', show: true });
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

        await dispatch(getUsefulServicesThunkCreator('categories=Students&categories=Employees', props.page, props.pageSize));
        props.updateUrl();
    };

    const cancel = () => {
        closeModal();
        setCategory(props.category);
        setDescription(props.description);
        setLink(props.link);
        setTitle(props.title);
        setTermsOfDisctribution(props.termsOfDisctribution);
        setFileName(props.logo ? props.logo.name : t('uploadImage'));
        setErrors({});
    };

    useEffect(() => {
        const fetchData = async () => {
            if (logoId) {
                const getLogo = await dispatch(getFileThunkCreator(logoId));

                if (getLogo != null) {
                    const imageObjectURL = URL.createObjectURL(getLogo); // Создаем URL для изображения
                    setLogo(imageObjectURL);
                }
            }
        };

        fetchData();
    }, [logoId]);

    return (
        <div className={styles.usefulServiceItemAdmin}>
            <div className={styles.row1}>
                {logo != null ? (
                    <img src={logo} className={styles.logo} />
                ) : (
                    <div className={styles.logo}></div>
                )}
                <div className={styles.icons1}>
                    <img src='/edit.png' className={styles.editIcon} onClick={openModal} />
                    <img src='/delete.png' className={styles.deleteIcon} onClick={deleteService} />
                </div>
            </div>
            {open ? (
                <div className={styles.content}>
                    <div className={styles.title}>
                        <span>{props.title}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.linkForm}>
                            <span className={styles.text}>{t('link')}</span>
                            <span className={styles.answer}>{props.link}</span>
                        </div>
                        <div className={styles.typeForm}>
                            <span className={styles.text}>{t('type')}</span>
                            <span className={styles.answer}>{typeServiceTranslate[props.category]}</span>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.descriptionForm}>
                        <span className={styles.text}>{t('description')}</span>
                        <span className={styles.answer}>{props.description}</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.termsOfDisctributionForm}>
                        <span className={styles.text}>{t('termsOfDisctribution')}</span>
                        <span className={styles.answer}>{props.termsOfDisctribution}</span>
                    </div>
                    <div className={styles.clickForm}>
                        {open ? (
                            <img src='/strelkaUp.png' className={styles.openIcon} onClick={() => handleClick()} />
                        ) : (
                            <img src='/strelkaDown.png' className={styles.closeIcon} onClick={() => handleClick()} />
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.title}>
                        <span>{props.title}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.linkForm}>
                            <span className={styles.text}>{t('link')}</span>
                            <span className={styles.answer}>{props.link}</span>
                        </div>
                        <div className={styles.typeForm}>
                            <span className={styles.text}>{t('type')}</span>
                            <span className={styles.answer}>{typeServiceTranslate[props.category]}</span>
                        </div>
                    </div>
                    <div className={styles.clickForm}>
                        {open ? (
                            <img src='/strelkaUp.png' className={styles.openIcon} onClick={() => handleClick()} />
                        ) : (
                            <img src='/strelkaDown.png' className={styles.closeIcon} onClick={() => handleClick()} />
                        )}
                    </div>
                </div>
            )}
            <div className={styles.icons2}>
                <img src='/edit.png' className={styles.editIcon} onClick={openModal} />
                <img src='/delete.png' className={styles.deleteIcon} onClick={deleteService} />
            </div>
            <Modal isOpen={modalIsOpen} className={styles.usefulServiceModal}>
                <div>
                    <span className={styles.titleModal}>{t('editingService')}</span>
                    <div className={styles.formModal}>
                        <div className={styles.nameFormModal}>
                            <label htmlFor="serviceName">{t('serviceName')}</label>
                            <input type="text" className={styles.serviceNameInput} value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className={styles.linkFormModal}>
                            <label htmlFor="link">{t('link')}</label>
                            <input type="text" className={styles.linkInput} value={link} onChange={(e) => setLink(e.target.value)} />
                        </div>
                        <div className={styles.typeFormModal}>
                            <label htmlFor="category">{t('type')}</label>
                            <select className={styles.categoryInput} id="category" value={category} onChange={(e) => setCategory(e.target.value)} >
                                <option value=""></option>
                                <option value="0">Общий</option>
                                <option value="1">Студент</option>
                                <option value="2">Сотрудник</option>
                            </select>
                            {errors.category && <span className={styles.error}>{errors.category}</span>}
                        </div>
                        <div className={styles.descriptionFormModal}>
                            <label htmlFor="description">{t('description')}</label>
                            <input type="text" className={styles.descriptionInput} value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className={styles.termsOfDisctributionFormModal}>
                            <label htmlFor="termsOfDisctribution">{t('termsOfDisctribution')}</label>
                            <input type="text" className={styles.termsOfDisctributionInput} value={termsOfDisctribution} onChange={(e) => setTermsOfDisctribution(e.target.value)} />
                        </div>
                        <div>
                            {fileName != t('uploadImage') ? (
                                <div className={styles.logoInput}>
                                    <img src="../addLogo.png" className={styles.addLogoIcon} />
                                    <span>{fileName}</span>
                                    <img src="../deleteLogo.png" className={styles.deleteLogoIcon} onClick={deleteLogo} />
                                </div>
                            ) : (
                                <div className={styles.logoInput} onClick={handleButtonClick}>
                                    <img src="../addLogo.png" className={styles.addLogoIcon} onClick={handleButtonClick} />
                                    <span>{fileName}</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className={styles.inputFiles} ref={fileInputRef} onChange={handleFileChange} />
                        </div>
                        <div className={styles.buttonsModal}>
                            <button className={styles.saveButton} onClick={editService}>{t('save')}</button>
                            <button className={styles.cancelButton} onClick={cancel}>{t('cancel')}</button>
                        </div>
                    </div>
                    <img src="../close.png" className={styles.closeModalButton} onClick={closeModal} />
                </div>
            </Modal>
        </div>
    );
};

export default UsefulServiceItem;