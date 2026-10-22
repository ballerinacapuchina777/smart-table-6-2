
import './fonts/ys-display/fonts.css';
import './style.css';

// Подключаем данные для автотестов
import { data as sourceData } from './data/dataset_1.js';

import { initData } from './data.js';
import { processFormData } from './lib/utils.js';

// Подключаем модули таблицы
import { initTable } from './components/table.js';
import { initSearching } from './components/searching.js';
import { initFiltering } from './components/filtering.js';
import { initSorting } from './components/sorting.js';
import { initPagination } from './components/pagination.js';

// Подготавливаем данные
const { data, ...indexes } = initData(sourceData);

// Собираем состояние полей таблицы
function collectState() {
    const state = processFormData(
        new FormData(sampleTable.container)
    );

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage, 10) || 10,
        page: parseInt(state.page ?? '1', 10) || 1
    };
}

// Перерисовываем таблицу
function render(action) {
    const state = collectState();
    let result = [...data];

    // Последовательно обрабатываем данные
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    // Выводим результат
    sampleTable.render(result);
}

// Создаём таблицу
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализируем поиск
const applySearching = initSearching('search');

// Инициализируем фильтры
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        searchBySeller: indexes.sellers
    }
);

// Инициализируем сортировку
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализируем пагинацию
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (element, page, isCurrent) => {
        const input = element.querySelector('input');
        const label = element.querySelector('span');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return element;
    }
);

// Добавляем таблицу на страницу
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Первый вывод таблицы
render();
