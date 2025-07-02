import { useEffect } from "react";
import styles from "./eventsAdmin.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getEventsThunkCreator } from "../../../reducers/administrationReducer";
import Pagination from "../../pagination/pagination";
import EventItem from "./eventItem";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../../errors/notification";

const Events = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { message } = location.state || {};

    const queryParams = new URLSearchParams(location.search);
    const [filters, setFilters] = useState(queryParams.get('filters') === 'true');
    const [name, setName] = useState(queryParams.get('name') || '');
    const [status, setStatus] = useState(queryParams.get('status') || '');
    const [eventType, setEventType] = useState(queryParams.get('eventType') || '');
    const [format, setFormat] = useState(queryParams.get('format') || '');
    const [eventDate, setEventDate] = useState(queryParams.get('eventDate') || '');
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pagination, setPagination] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const [clicks, setClicks] = useState(1);
    const totalPages = pagination.pageCount;

    const list = useSelector(state => state.administrationPage.results);

    const changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        setPage(currentPage);
    };

    const filtersOpen = () => setFilters(!filters);
    const navigation = () => navigate('/createEvent');
    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');

    const search = () => {
        dispatch(getEventsThunkCreator(status, eventType, name, format, eventDate, 420, page, 9));
        updateUrl();
        window.location.reload();
    }

    const updateUrl = () => {
        const params = new URLSearchParams();

        params.set('filters', filters);

        if (name) {
            params.set('name', name);
        }

        if (status) {
            params.set('status', status);
        }

        if (eventType) {
            params.set('eventType', eventType);
        }

        if (format) {
            params.set('format', format);
        }

        if (eventDate) {
            params.set('eventDate', eventDate);
        }

        params.set('timezoneOffset', 420);

        if (page) {
            params.set('page', page);
        }

        params.set('pageSize', 9);

        navigate(`/admin/events?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const getEvents = await dispatch(getEventsThunkCreator(status, eventType, name, format, eventDate, 420, page, 9));
            if (getEvents && getEvents.error === 401) {
                navigate('/error401');
            }
            else if (getEvents && getEvents.error === 403) {
                navigate('/error403');
            }
            else if (getEvents && getEvents.error === 500) {
                navigate('/error500');
            }

            setPagination(getEvents.metaData);

            if (message && Object.keys(message).length !== 0) {
                setNotification({ message: message, type: 'Success', show: true });
            }

            updateUrl();
        };

        fetchData();
    }, [page, filters]);

    return (
        <div className={styles.eventsAdminContainer}>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage2}>{t('events')}</span>
            </div>
            <div className={styles.informationEvents}>
                <div className={styles.headerForm}>
                    <div className={styles.header}>
                        <span>{t('events')}</span>
                    </div>
                    <div className={styles.addEventButton} onClick={navigation}>
                        <span className={styles.addEventButtonText}>{t('addEvent')}</span>
                        <span className={styles.plus}>+</span>
                    </div>
                    {!filters ? (
                        <div className={styles.searchForm1}>
                            <div className={styles.searchHeader}>
                                <span className={styles.searchBar}>{t('searchBar')}</span>
                                <button className={styles.filtersButton1} onClick={filtersOpen}>
                                    <span className={styles.filtersText1}>{t('filters')}</span>
                                    <img src="../filters.png" className={styles.filtersIcon} />
                                </button>
                            </div>
                            <div className={styles.searchInput2}>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="eventName">{t('eventName')}</label>
                                    <input type="text" className={styles.inputForm2} value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <button className={styles.searchButton2} onClick={search}>{t('search')}</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.searchForm2}>
                            <div className={styles.searchHeader}>
                                <span className={styles.searchBar}>{t('searchBar')}</span>
                                <button className={styles.filtersButton2} onClick={filtersOpen}>
                                    <span className={styles.filtersText2}>{t('filters')}</span>
                                    <img src="../filtersBlue.png" className={styles.filtersIcon} />
                                </button>
                            </div>
                            <div className={styles.searchInput}>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="eventName">{t('eventName')}</label>
                                    <input type="text" className={styles.inputForm} value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <button className={styles.searchButton} onClick={search}>{t('search')}</button>
                            </div>
                            <div className={styles.filters}>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="status">{t('status')}</label>
                                    <select className={styles.statusInput} id="status" value={status} onChange={(e) => setStatus(e.target.value)} >
                                        <option value=""></option>
                                        <option value="0">{t('draft')}</option>
                                        <option value="1">{t('active')}</option>
                                        <option value="2">{t('finished')}</option>
                                        <option value="3">{t('archive')}</option>
                                    </select>
                                </div>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="typeOfEvent">{t('typeOfEvent')}</label>
                                    <select className={styles.typeOfEventInput} id="typeOfEvent" value={eventType} onChange={(e) => setEventType(e.target.value)} >
                                        <option value=""></option>
                                        <option value="0">Открытое</option>
                                        <option value="1">Закрытое</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.filters}>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="formatOfTheEvents">{t('formatOfTheEvents')}</label>
                                    <select className={styles.formatOfTheEventsInput} id="formatOfTheEvents" value={format} onChange={(e) => setFormat(e.target.value)} >
                                        <option value=""></option>
                                        <option value="0">Онлайн</option>
                                        <option value="1">Офлайн</option>
                                    </select>
                                </div>
                                <div className={styles.searchInputForm}>
                                    <label htmlFor="dateOfTheEvent">{t('dateOfTheEvent')}</label>
                                    <input type="date" className={styles.dateOfTheEventInput} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {
                        list.map((value) => (
                            <EventItem title={value.title} auditory={value.auditory} dateTimeFrom={value.dateTimeFrom} dateTimeTo={value.dateTimeTo}
                                format={value.format} type={value.type} status={value.status} description={value.description}
                                isTimeFromNeeded={value.isTimeFromNeeded} isTimeToNeeded={value.isTimeToNeeded} picture={value.picture}
                                filters={filters} page={page} pageSize={9} id={value.id} key={value.id}
                                status2={status} eventType={eventType} name={name} format2={format} eventDate={eventDate}
                                clicks={clicks} setClicks={setClicks} setNotification={setNotification} />
                        ))
                    }
                </div>
                <div>
                    <Pagination page={page} totalPages={totalPages} changePage={changePage} className={filters ? styles.pagination2 : styles.pagination1} />
                </div>
            </div>
            <Notification message={notification.message} type={notification.type} show={notification.show} click={clicks} />
        </div>
    );
};

export default Events;