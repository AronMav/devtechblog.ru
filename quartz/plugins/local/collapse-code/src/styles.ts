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
/* Тихий mono-чип в стиле бара/бейджей кода: hairline-рамка, серый в покое,
   акцент только по ховеру. Шеврон-индикатор поворачивается при разворачивании. */
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0.7rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--panel-bg);
  color: var(--gray);
  font-family: var(--codeFont);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  user-select: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}
figure.code-collapsible > label.code-collapse-label:hover {
  color: var(--secondary);
  border-color: var(--secondary);
}
figure.code-collapsible > label.code-collapse-label::after {
  content: "";
  width: 0.4em;
  height: 0.4em;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  margin-top: -0.18em;
  transition: transform 0.2s ease;
}
figure.code-collapsible > label.code-collapse-label .cc-label-hide { display: none; }
/* expanded */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > pre { max-height: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked)::after { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label.code-collapse-label {
  position: static;
  display: flex;
  width: fit-content;
  margin: 0.6rem auto 0;
  transform: none;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label.code-collapse-label::after {
  transform: rotate(-135deg);
  margin-top: 0.12em;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;
