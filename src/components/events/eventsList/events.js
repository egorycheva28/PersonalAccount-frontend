import { useEffect } from "react";
import styles from "./events.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import EventItem from "./eventItem";
import { getAuthEventsThunkCreator, getPublicEventsThunkCreator } from "../../../reducers/eventsReducer";
import Pagination from "../../pagination/pagination";
import { useLocation, useNavigate } from "react-router-dom";

const Events = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const [name, setName] = useState(queryParams.get('name') || '');
    const [eventDate, setEventDate] = useState(queryParams.get('eventDate') || '');
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pagination, setPagination] = useState('');
    const totalPages = pagination.pageCount;

    const list = useSelector(state => state.eventsPage.results);

    const changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        setPage(currentPage);
    };

    const search = async () => {
        if (localStorage.getItem('token')) {
            const getEvents = await dispatch(getAuthEventsThunkCreator(name, eventDate, 420, page, 8));
            setPagination(getEvents.metaData);
        }
        else {
            const getEvents = await dispatch(getPublicEventsThunkCreator(name, eventDate, 420, page, 8));
            setPagination(getEvents.metaData);
        }

        updateUrl();
    };

    const login = () => navigate('/login');
    const mainPage = () => updateUrl();

    const updateUrl = () => {
        const params = new URLSearchParams();

        if (name) {
            params.set('name', name);
        }

        if (eventDate) {
            params.set('eventDate', eventDate);
        }

        params.set('timezoneOffset', 420);

        if (page) {
            params.set('page', page);
        }
        params.set('pageSize', 8);

        navigate(`/events?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem('token')) {
                const getEvents = await dispatch(getAuthEventsThunkCreator(name, eventDate, 420, page, 8));
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
            }
            else {
                const getEvents = await dispatch(getPublicEventsThunkCreator(name, eventDate, 420, page, 8));
                if (getEvents && getEvents.error === 500) {
                    navigate('/error500');
                }
                setPagination(getEvents.metaData);
            }
            updateUrl();
        };

        fetchData();
    }, [page]);

    return (
        <div className={styles.eventsContainer}>
            <div className={localStorage.getItem('token') ? styles.headerPage : styles.headerPage2}>
                <span>{t('events')}</span>
                {!localStorage.getItem('token') ? (
                    <img src="./loginIcon.png" className={styles.login} onClick={login} />
                ) : (
                    null
                )}
            </div>
            <div className={localStorage.getItem('token') ? styles.links : styles.links2}>
                <span className={styles.linkPage2} onClick={mainPage}>{t('main')}</span>
            </div>
            <div className={localStorage.getItem('token') ? styles.eventsInformation : styles.eventsInformation2}>
                <div className={styles.headerForm}>
                    <span className={styles.header}>{t('searchName')}</span>
                    <div className={styles.searchInput}>
                        <div className={styles.searchInputForm}>
                            <label htmlFor="eventName">{t('eventName')}</label>
                            <input type="text" className={styles.inputForm1} value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <button className={styles.searchButton} onClick={search}>{t('search')}</button>
                    </div>
                    <div className={styles.searchInputForm}>
                        <label htmlFor="dateOfTheEvent">{t('dateOfTheEvent')}</label>
                        <input type="date" className={styles.inputForm2} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                    </div>
                </div>
                <div className={styles.eventsList}>
                    {
                        list.map((value) => (
                            <EventItem title={value.title} auditory={value.auditory} dateTimeFrom={value.dateTimeFrom} dateTimeTo={value.dateTimeTo}
                                format={value.format} status={value.status} isTimeFromNeeded={value.isTimeFromNeeded} isTimeToNeeded={value.isTimeToNeeded}
                                picture={value.picture} page={page} pageSize={9} id={value.id} key={value.id} name={name} eventDate={eventDate} />
                        ))
                    }
                </div>
                <div>
                    <Pagination page={page} totalPages={totalPages} changePage={changePage} className={styles.pagination} />
                </div>
            </div>
        </div>
    );
};

export default Events;
