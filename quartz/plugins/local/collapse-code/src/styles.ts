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
  background: linear-gradient(to bottom, transparent, var(--light));
  pointer-events: none;
}
figure.code-collapsible > label.code-collapse-label {
  position: absolute;
  bottom: 0.6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  cursor: pointer;
  padding: 0.25rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--secondary);
  color: var(--light);
  font-size: 0.8rem;
  font-family: var(--bodyFont);
  user-select: none;
}
figure.code-collapsible > label.code-collapse-label .cc-label-hide { display: none; }
/* expanded */
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > pre { max-height: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked)::after { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label.code-collapse-label {
  position: static;
  display: block;
  width: fit-content;
  margin: 0.5rem auto 0;
  transform: none;
}
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-show { display: none; }
figure.code-collapsible:has(> input.code-collapse-toggle:checked) > label .cc-label-hide { display: inline; }
`;
