
import {
    createComparison,
    defaultRules
} from '../lib/compare.js';

// Настраиваем функцию сравнения
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки
    Object.keys(indexes).forEach(elementName => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');

                option.value = name;
                option.textContent = name;

                return option;
            })
        );
    });

    return (data, state, action) => {
        // Очищаем отдельное поле фильтра
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');

            if (input) {
                input.value = '';
            }

            state[action.dataset.field] = '';
        }

        // Собираем условия фильтрации
        const criteria = {
            ...state,
            total: [
                state.totalFrom ?? '',
                state.totalTo ?? ''
            ]
        };

        // Оставляем только подходящие строки
        return data.filter(row => compare(row, criteria));
    };
}
