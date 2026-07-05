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
/* Кнопка-иконка в правом углу: только шеврон, без текста. Hairline-чип
   в стиле бейджей кода; серый в покое, акцент по ховеру. Шеврон вниз =
   развернуть, вверх (при :checked) = свернуть. */
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0.7rem;
  right: 0.7rem;
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--panel-bg);
  color: var(--gray);
  user-select: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}
figure.code-collapsible > label.code-collapse-label:hover {
  color: var(--secondary);
  border-color: var(--secondary);
}
figure.code-collapsible > label.code-collapse-label::after {
  content: "";
  width: 0.5em;
  height: 0.5em;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  margin-top: -0.18em;
  transition: transform 0.2s ease;
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
/* Развёрнуто: кнопка остаётся в правом нижнем углу окна кода (та же
   позиция, что «развернуть») — меняется только направление стрелки. */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label.code-collapse-label::after {
  transform: rotate(-135deg);
  margin-top: 0.12em;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;
