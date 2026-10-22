
import { cloneTemplate } from '../lib/utils.js';

// Создаём таблицу и подключаем обработчики событий
export function initTable(settings, onAction) {
    const {
        tableTemplate,
        rowTemplate,
        before = [],
        after = []
    } = settings;

    const root = cloneTemplate(tableTemplate);

    // Добавляем шаблоны перед таблицей
    [...before].reverse().forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.prepend(root[templateId].container);
    });

    // Добавляем шаблоны после таблицы
    after.forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.append(root[templateId].container);
    });

    // Обрабатываем изменение полей
    root.container.addEventListener('change', () => {
        onAction();
    });

    // Обрабатываем сброс формы
    root.container.addEventListener('reset', () => {
        setTimeout(onAction, 0);
    });

    // Обрабатываем нажатия кнопок
    root.container.addEventListener('submit', event => {
        event.preventDefault();
        onAction(event.submitter);
    });

    // Создаём строки таблицы
    const render = data => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                const element = row.elements[key];

                if (!element) return;

                if (element.matches('input, select, textarea')) {
                    element.value = item[key];
                } else {
                    element.textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}
