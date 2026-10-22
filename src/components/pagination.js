
import { getPages } from '../lib/utils.js';

export const initPagination = (
    { pages, fromRow, toRow, totalRows },
    createPage
) => {
    // Сохраняем шаблон кнопки страницы
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();

    return (data, state, action) => {
        // Считаем количество страниц
        const rowsPerPage = Math.max(1, state.rowsPerPage || 10);
        const pageCount = Math.ceil(data.length / rowsPerPage);

        let page = state.page || 1;

        // Обрабатываем кнопки перехода
        if (action) {
            switch (action.name) {
                case 'prev':
                    page -= 1;
                    break;

                case 'next':
                    page += 1;
                    break;

                case 'first':
                    page = 1;
                    break;

                case 'last':
                    page = pageCount;
                    break;
            }
        }

        // Не даём перейти на несуществующую страницу
        page = Math.max(
            1,
            Math.min(page, Math.max(1, pageCount))
        );

        // Получаем номера видимых страниц
        const visiblePages = getPages(page, pageCount, 5);

        // Создаём кнопки страниц
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const element = pageTemplate.cloneNode(true);

                return createPage(
                    element,
                    pageNumber,
                    pageNumber === page
                );
            })
        );

        // Считаем, какие строки показывать
        const skip = (page - 1) * rowsPerPage;

        // Обновляем информацию о количестве строк
        fromRow.textContent = data.length ? skip + 1 : 0;
        toRow.textContent = Math.min(
            skip + rowsPerPage,
            data.length
        );
        totalRows.textContent = data.length;

        // Возвращаем строки текущей страницы
        return data.slice(skip, skip + rowsPerPage);
    };
};
