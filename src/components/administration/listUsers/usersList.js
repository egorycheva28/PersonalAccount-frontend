import { useEffect } from "react";
import styles from "./usersList.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getUsersListThunkCreator } from "../../../reducers/administrationReducer";
import UserItem from "./userItem";
import Pagination from "../../pagination/pagination";
import { useLocation, useNavigate } from "react-router-dom";

const UsersList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const [name, setName] = useState(queryParams.get('name') || '');
    const [filterLastName, setFilterLastName] = useState(queryParams.get('filterLastName') || '');
    const [clickLetters, setClickLetters] = useState(queryParams.get('clickLetters') === 'true');
    const [clickSort, setClickSort] = useState(queryParams.get('clickSort') === 'true');
    const [email, setEmail] = useState(queryParams.get('email') || '');
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pagination, setPagination] = useState('');
    const totalPages = pagination.pageCount;
    const list = useSelector(state => state.administrationPage.results);

    const changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        setPage(currentPage);
    };

    const handleClick1 = (value) => setClickSort(value);
    const handleClick2 = () => setClickLetters(!clickLetters);
    const mainPage = () => navigate('/events');
    const adminPage = () => navigate('/admin');

    const search = () => {
        dispatch(getUsersListThunkCreator(email, name, filterLastName, page, 9));
        updateUrl();
        window.location.reload();
    }

    const filterLetter = (value) => {
        if (filterLastName == '' || filterLastName != value) {
            setFilterLastName(value);
        }
        else {
            setFilterLastName('');
        }
        setPage(1);
    };

    const updateUrl = () => {
        const params = new URLSearchParams();

        params.set('clickLetters', clickLetters);
        params.set('clickSort', clickSort);

        if (email) {
            params.set('email', email);
        }

        if (name) {
            params.set('name', name);
        }

        if (filterLastName) {
            params.set('filterLastName', filterLastName);
        }

        if (page) {
            params.set('page', page);
        }
        params.set('pageSize', 9);

        navigate(`/admin/users?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(getUsersListThunkCreator(email, name, filterLastName, page, 9));
            if (result && result.error === 401) {
                navigate('/error401');
            }
            else if (result && result.error === 403) {
                navigate('/error403');
            }
            else if (result && result.error === 500) {
                navigate('/error500');
            }
            setPagination(result.metaData);

            updateUrl();
        };

        fetchData();
    }, [filterLastName, page, clickLetters, clickSort]);

    return (
        <div>
            <div className={styles.headerPage}>
                <span>{t('administration')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage} onClick={adminPage}>{t('administration')} / </span>
                <span className={styles.linkPage2}>{t('users')}</span>
            </div>
            <div className={styles.searchForm}>
                <input className={styles.searchInput} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('enterFullName')}></input>
                <button className={styles.searchButton} onClick={search}>{t('search')} </button>
            </div>
            {clickLetters ? (
                <div>
                    <img src="/lettersClosed.png" className={styles.lettersClosed} onClick={() => handleClick2()} />
                </div>
            ) : (
                <div className={styles.lettersOpened}>
                    <img src="/Chevron_Left_MD.svg" className={styles.letterIcons} onClick={() => handleClick2()} />
                    <img src="/letter1.png" className={styles.letterIcon} onClick={() => filterLetter('А')} />
                    <img src="/letter2.png" className={styles.letterIcon} onClick={() => filterLetter('Б')} />
                    <img src="/letter3.png" className={styles.letterIcon} onClick={() => filterLetter('В')} />
                    <img src="/letter4.png" className={styles.letterIcon} onClick={() => filterLetter('Г')} />
                    <img src="/letter5.png" className={styles.letterIcon} onClick={() => filterLetter('Д')} />
                    <img src="/letter6.png" className={styles.letterIcon} onClick={() => filterLetter('Е')} />
                    <img src="/letter7.png" className={styles.letterIcon} onClick={() => filterLetter('Ё')} />
                    <img src="/letter8.png" className={styles.letterIcon} onClick={() => filterLetter('Ж')} />
                    <img src="/letter9.png" className={styles.letterIcon} onClick={() => filterLetter('З')} />
                    <img src="/letter10.png" className={styles.letterIcon} onClick={() => filterLetter('И')} />
                    <img src="/letter11.png" className={styles.letterIcon} onClick={() => filterLetter('Й')} />
                    <img src="/letter12.png" className={styles.letterIcon} onClick={() => filterLetter('К')} />
                    <img src="/letter13.png" className={styles.letterIcon} onClick={() => filterLetter('Л')} />
                    <img src="/letter14.png" className={styles.letterIcon} onClick={() => filterLetter('М')} />
                    <img src="/letter15.png" className={styles.letterIcon} onClick={() => filterLetter('Н')} />
                    <img src="/letter16.png" className={styles.letterIcon} onClick={() => filterLetter('О')} />
                    <img src="/letter17.png" className={styles.letterIcon} onClick={() => filterLetter('П')} />
                    <img src="/letter18.png" className={styles.letterIcon18} onClick={() => filterLetter('Р')} />
                    <img src="/letter19.png" className={styles.letterIcon} onClick={() => filterLetter('С')} />
                    <img src="/letter20.png" className={styles.letterIcon} onClick={() => filterLetter('Т')} />
                    <img src="/letter21.png" className={styles.letterIcon} onClick={() => filterLetter('У')} />
                    <img src="/letter22.png" className={styles.letterIcon} onClick={() => filterLetter('Ф')} />
                    <img src="/letter23.png" className={styles.letterIcon} onClick={() => filterLetter('Х')} />
                    <img src="/letter24.png" className={styles.letterIcon} onClick={() => filterLetter('Ц')} />
                    <img src="/letter25.png" className={styles.letterIcon} onClick={() => filterLetter('Ч')} />
                    <img src="/letter26.png" className={styles.letterIcon} onClick={() => filterLetter('Ш')} />
                    <img src="/letter27.png" className={styles.letterIcon} onClick={() => filterLetter('Щ')} />
                    <img src="/letter28.png" className={styles.letterIcon} onClick={() => filterLetter('Э')} />
                    <img src="/letter29.png" className={styles.letterIcon} onClick={() => filterLetter('Ю')} />
                    <img src="/letter30.png" className={styles.letterIcon} onClick={() => filterLetter('Я')} />
                    <img src="/Chevron_Right_MD.svg" className={styles.letterIcons} onClick={() => handleClick2()} />
                </div>
            )}
            {!clickSort ? (
                <div>
                    <div className={styles.sorts}>
                        <img src="/sortCards2.png" className={styles.sortIcon2} onClick={() => handleClick1(false)} />
                        <img src="/sortCards1Black.png" className={styles.sortIcon1} onClick={() => handleClick1(true)} />
                    </div>
                    <div className={styles.usersList1}>
                        {
                            list.map((value) => (
                                <UserItem email={value.email} birthDate={value.birthDate} lastName={value.lastName}
                                    firstName={value.firstName} patronymic={value.patronymic} id={value.id} key={value.id} />
                            ))
                        }
                    </div>
                </div>
            ) : (
                <div>
                    <div className={styles.sorts}>
                        <img src="/sortCards2Black.png" className={styles.sortIcon2} onClick={() => handleClick1(false)} />
                        <img src="/sortCards1.png" className={styles.sortIcon1} onClick={() => handleClick1(true)} />
                    </div>
                    <div className={styles.usersList2}>
                        {
                            list.map((value) => (
                                <UserItem email={value.email} birthDate={value.birthDate} lastName={value.lastName}
                                    firstName={value.firstName} patronymic={value.patronymic} id={value.id} key={value.id} />
                            ))
                        }
                    </div>
                </div>
            )}
            <div>
                <Pagination page={page} totalPages={totalPages} changePage={changePage} className={styles.pagination} />
            </div>
        </div>
    );
};

export default UsersList;