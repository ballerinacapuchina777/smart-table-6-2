
import {
    rules,
    createComparison
} from '../lib/compare.js';

export function initSearching(searchField) {
    // Настраиваем поиск по нескольким полям
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [
            rules.searchMultipleFields(
                searchField,
                ['date', 'customer', 'seller'],
                false
            )
        ]
    );

    // Фильтруем строки по поисковому запросу
    return (data, state) => {
        return data.filter(row =>
            compare(row, {
                [searchField]: state[searchField] ?? ''
            })
        );
    };
}
