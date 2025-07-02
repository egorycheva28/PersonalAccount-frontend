import { useEffect } from "react";
import styles from "./usefulServices.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsefulServicesThunkCreator } from "../../reducers/usefulServicesReducer";
import UsefulServiceItem from "./usefulServiceItem";
import Pagination from "../pagination/pagination";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const UsefulServices = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pagination, setPagination] = useState('');
    const totalPages = pagination.pageCount;
    const list = useSelector(state => state.usefulServicesPage.results);

    const changePage = (currentPage) => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        setPage(currentPage);
    };

    const mainPage = () => {
        navigate('/events');
    };

    const updateUrl = () => {
        const params = new URLSearchParams();

        if (JSON.parse(localStorage.getItem('roles')).length == 1) {
            if (JSON.parse(localStorage.getItem('roles'))[0] == 'Student') {
                params.append('categories', 'ForAll');
                params.append('categories', 'Students');
            }
            else if (JSON.parse(localStorage.getItem('roles'))[0] == 'Employee') {
                params.append('categories', 'ForAll');
                params.append('categories', 'Employees');
            }
        }
        else {
            params.append('categories', 'ForAll');
            params.append('categories', 'Students');
            params.append('categories', 'Employees');
        }

        if (page) {
            params.set('page', page);
        }

        params.set('pageSize', 9);

        navigate(`/usefulServices?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            var category = null;
            if (JSON.parse(localStorage.getItem('roles')).length == 1) {
                if (JSON.parse(localStorage.getItem('roles'))[0] == 'Student') {
                    category = 'categories=Students';
                }
                else if (JSON.parse(localStorage.getItem('roles'))[0] == 'Employee') {
                    category = 'categories=Employees';
                }
            }
            else {
                category = 'categories=Students&categories=Employees';
            }

            const getUsefulServices = await dispatch(getUsefulServicesThunkCreator(category, page, 9));
            if (getUsefulServices && getUsefulServices.error === 401) {
                navigate('/error401');
            }
            else if (getUsefulServices && getUsefulServices.error === 403) {
                navigate('/error403');
            }
            else if (getUsefulServices && getUsefulServices.error === 500) {
                navigate('/error500');
            }
            setPagination(getUsefulServices.metaData);

            updateUrl();
        };

        fetchData();
    }, [page]);

    return (
        <div className={styles.usefulServicesContainer}>
            <div className={styles.headerPage}>
                <span>{t('usefulServices')}</span>
            </div>
            <div className={styles.links}>
                <span className={styles.linkPage} onClick={mainPage}>{t('main')} / </span>
                <span className={styles.linkPage2}>{t('usefulServices')}</span>
            </div>
            <div className={styles.usefulServicesList}>
                {
                    list.map((value) => (
                        <UsefulServiceItem title={value.title} description={value.description} termsOfDisctribution={value.termsOfDisctribution} link={value.link} logo={value.logo} id={value.id} key={value.id} />
                    ))
                }
            </div>
            <div>
                <Pagination page={page} totalPages={totalPages} changePage={changePage} className={styles.pagination} />
            </div>
        </div>
    );
};

export default UsefulServices;