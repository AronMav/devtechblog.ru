import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { pathToRoot } from "../util/path";

/**
 * Навигационные ссылки верхнего бара: «заметки» (главная со списком
 * последних заметок) и «теги». Стилистика бара живёт в custom.scss.
 */
const NavLinks: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const base = pathToRoot(fileData.slug as string);
  return (
    <nav class={`nav-links ${displayClass ?? ""}`}>
      <a href={base}>заметки</a>
      <a href={`${base}/tags`}>теги</a>
    </nav>
  );
};

// Explorer при первом заходе скроллит СТРАНИЦУ к активному пункту дерева
// (scrollIntoView без block:nearest) — бар уезжает за верх экрана.
// Его же штатный ключ отключает это: если explorerScrollTop задан,
// скрипт лишь восстанавливает scrollTop контейнера. Ставим "0" только
// когда ключа нет — сохранённая позиция дерева между переходами живёт.
NavLinks.beforeDOMLoaded = `
if (!sessionStorage.getItem("explorerScrollTop")) {
  sessionStorage.setItem("explorerScrollTop", "0");
}
`;

// На узких экранах (<1280) дерево разделов — полоса-аккордеон:
// по умолчанию свёрнута. Разворачивает штатная кнопка explorer'а
// (она тогглит класс collapsed), вид задаёт custom.scss.
NavLinks.afterDOMLoaded = `
function collapseTreeOnNarrow() {
  if (!window.matchMedia("(max-width: 1279px)").matches) return;
  document.querySelectorAll(".explorer:not(.collapsed)").forEach(function (ex) {
    ex.classList.add("collapsed");
    ex.setAttribute("aria-expanded", "false");
  });
}
collapseTreeOnNarrow();
document.addEventListener("nav", collapseTreeOnNarrow);
`;

export default (() => NavLinks) satisfies QuartzComponentConstructor;
