import { useEffect, useRef } from "react";
import Modal from 'react-modal';
import styles from "./usefulServicesAdmin.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { createUsefulServiceThunkCreator } from "../../../reducers/administrationReducer";
import UsefulServiceItem from "./usefulServiceItem";
import Pagination from "../../pagination/pagination";
import { addFileThunkCreator } from "../../../reducers/filesReducer";
import { getUsefulServicesThunkCreator } from "../../../reducers/usefulServicesReducer";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../../errors/notification";

Modal.setAppElement('#root');

const UsefulService = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const [usefulServices, setUsefulServices] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [termsOfDisctribution, setTermsOfDisctribution] = useState('');
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pagination, setPagination] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);
    const [errors, setErrors] = useState({});
    const totalPages = pagination.pageCount;
    const list = useSelector(state => state.usefulServicesPage.results);

    //добавление изображения с компа
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

    const updateUrl = () => {
        const params = new URLSearchParams();

        if (page) {
            params.set('page', page);
        }
        params.set('pageSize', 9);

        navigate(`/admin/usefulservice?categories=ForAll&categories=Students&categories=Employees&${params.toString()}`);
    };

    const deleteLogo = () => setFileName(t('uploadImage'));
    const handleButtonClick = () => fileInputRef.current.click();
    const openModal = () => setModalIsOpen(true);

    const closeModal = () => {
        setModalIsOpen(false);
        setCategory(null);
        setDescription('');
        setLink('');
        setTitle('');
        setTermsOfDisctribution('');
        setFileName(t('uploadImage'));
        setImagePreview(null);
        setErrors({});
    };

    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');

    const changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        setPage(currentPage);
    };

    const validateFields = () => {
        const newErrors = {};

        if (category == null) newErrors.category = t('serviceTypeRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createService = async () => {
        if (!validateFields()) {
            setClicks(clicks + 1);
            setNotification({ message: t('pleaseFillInAllRequiredFields'), type: 'Warning', show: true });
        }
        else {
            if (selectedFile != null) {
                const id = await dispatch(addFileThunkCreator(formData));
                const result = await dispatch(createUsefulServiceThunkCreator(category, title, description, link, termsOfDisctribution, id.id));
                if (!result) {
                    setNotification({ message: t('usefulServiceCreated'), type: 'Success', show: true });
                }
            }
            else {
                const result = await dispatch(createUsefulServiceThunkCreator(category, title, description, link, termsOfDisctribution, null));
                if (!result) {
                    setNotification({ message: t('usefulServiceCreated'), type: 'Success', show: true });
                }
            }
            closeModal();
            setCategory(null);
            setDescription('');
            setLink('');
            setTitle('');
            setTermsOfDisctribution('');
            setSelectedFile(null);
            setFileName(t('uploadImage'));
            setImagePreview(null);
            await dispatch(getUsefulServicesThunkCreator('categories=Students&categories=Employees', page, 9));
        }
    };

    const cancel = () => {
        closeModal();
        setCategory(null);
        setDescription('');
        setLink('');
        setTitle('');
        setTermsOfDisctribution('');
        setSelectedFile(null);
        setFileName(t('uploadImage'));
        setImagePreview(null);
        setErrors({});
    };

    useEffect(() => {
        const fetchData = async () => {
            const getUsefulServices = await dispatch(getUsefulServicesThunkCreator('categories=Students&categories=Employees', page, 9));
            if (getUsefulServices && getUsefulServices.error === 401) {
                navigate('/error401');
            }
            else if (getUsefulServices && getUsefulServices.error === 403) {
                navigate('/error403');
            }
            else if (getUsefulServices && getUsefulServices.error === 500) {
                navigate('/error500');
            }

            const results = getUsefulServices.results;
            setUsefulServices(results);
            setPagination(getUsefulServices.metaData);

            updateUrl();
        };

        fetchData();
    }, [page, totalPages]);

    return (
        <div className={styles.usefulServicesAdminContainer}>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage2}>{t('usefulServices')}</span>
            </div>
            <div className={styles.informationUsefulServices}>
                <div className={styles.headerForm}>
                    <div className={styles.header}>
                        <span>{t('usefulServices')}</span>
                    </div>
                    <div className={styles.addServiceButton} onClick={openModal}>
                        <span className={styles.addServiceButtonText}>{t('addService')}</span>
                        <span className={styles.plus}>+</span>
                    </div>
                </div>
                <Modal isOpen={modalIsOpen} className={styles.usefulServiceModal}>
                    <div className={styles.contentModule}>
                        <span className={styles.titleModal}>{t('addingService')}</span>
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
                                <button className={styles.saveButton} onClick={createService}>{t('save')}</button>
                                <button className={styles.cancelButton} onClick={cancel}>{t('cancel')}</button>
                            </div>
                        </div>
                        <img src="../close.png" className={styles.closeModalButton} onClick={closeModal} />
                    </div>
                </Modal>
                <div className={styles.usefulServicesList}>
                    {
                        list.map((value) => (
                            <UsefulServiceItem title={value.title} description={value.description} termsOfDisctribution={value.termsOfDisctribution}
                                link={value.link} logo={value.logo} category={value.category} page={page} pageSize={9} id={value.id} key={value.id}
                                clicks={clicks} setClicks={setClicks} setNotification={setNotification} updateUrl={updateUrl} />
                        ))
                    }
                </div>
                <div>
                    <Pagination page={page} totalPages={totalPages} changePage={changePage} className={styles.pagination} />
                </div>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default UsefulService;