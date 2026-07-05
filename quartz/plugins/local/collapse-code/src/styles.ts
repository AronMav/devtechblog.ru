export const COLLAPSE_CSS = `
figure.code-collapsible { position: relative; }
figure.code-collapsible > input.code-collapse-toggle {
  position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
}
figure.code-collapsible > pre {
  max-height: 11rem;
  overflow-y: hidden;
  transition: max-height 0.2s ease;
}
figure.code-collapsible::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 5rem;
  background: linear-gradient(to bottom, transparent, var(--panel-bg));
  pointer-events: none;
  border-radius: 0 0 6px 6px;
}
/* Кнопка-стрелка в правом нижнем углу окна кода — тот же chrome, что и
   у кнопки копирования (.clipboard-button): рамка, фон, радиус, паддинг.
   Стрелка вниз = развернуть, при :checked поворот на 180° = свернуть.
   В отличие от кнопки копирования, видна всегда (это affordance). */
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border: none;
  background-color: var(--light);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}
figure.code-collapsible > label.code-collapse-label:hover {
  color: var(--secondary);
}
figure.code-collapsible > label.code-collapse-label > svg.cc-chevron {
  display: block;
  transition: transform 0.2s ease;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label svg.cc-chevron {
  transform: rotate(180deg);
}
/* Текст остаётся в DOM для скринридеров (доступное имя label), но скрыт
   визуально — на экране только стрелка. */
figure.code-collapsible > label.code-collapse-label .cc-label-show,
figure.code-collapsible > label.code-collapse-label .cc-label-hide {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
figure.code-collapsible > label.code-collapse-label .cc-label-hide { display: none; }
/* expanded */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > pre { max-height: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked)::after { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;
