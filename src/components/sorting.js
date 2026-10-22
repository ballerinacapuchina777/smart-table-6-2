
import { sortCollection, sortMap } from '../lib/sort.js';

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        // Если пользователь нажал кнопку сортировки
        if (action && action.name === 'sort') {
            // Переключаем режим сортировки
            action.dataset.value =
                sortMap[action.dataset.value] ?? 'none';

            field = action.dataset.field;
            order = action.dataset.value;

            // Сбрасываем сортировку других столбцов
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Восстанавливаем активную сортировку
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // Возвращаем отсортированные данные
        return sortCollection(data, field, order);
    };
}
