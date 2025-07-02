import styles from './pagination.module.css';

const Pagination = ({ page, totalPages, changePage, className }) => {

    const getPages = () => {
        const pages = [];

        pages.push(1);

        const firstPage = Math.max(2, page - 1);
        const lastPage = Math.min(totalPages - 1, page + 1);

        if (firstPage > 2) {
            pages.push('...');
        }

        for (let i = firstPage; i <= lastPage; i++) {
            pages.push(i);
        }

        if (lastPage < totalPages - 1) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className={className}>
            <img src="/Chevron_Left_MD.svg" className={styles.letterIcons} onClick={() => changePage(page - 1)} />
            {pages.map((currentPage, index) => {
                if (currentPage === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="ellipsis">
                            ...
                        </span>
                    );
                } else {
                    return (
                        <span key={`page-${currentPage}`} className={page === currentPage ? styles.number2 : styles.number1} onClick={() => changePage(currentPage)}>
                            {currentPage}
                        </span>
                    );
                }
            })}
            <img src="/Chevron_Right_MD.svg" className={styles.letterIcons} onClick={() => changePage(page + 1)} />
        </div>
    );
};

export default Pagination;