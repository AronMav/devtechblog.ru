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

// На узких экранах (<1280) дерево и оглавление — выезжающие панели
// (drawer слева/справа), открываются штатными кнопками плагинов.
// Здесь: дефолт «закрыто» (+js-ready против мигания при загрузке),
// закрытие кликом вне панели и по Escape.
NavLinks.afterDOMLoaded = `
var ccNarrow = window.matchMedia("(max-width: 1279px)");

function ccPrepareDrawers() {
  if (!ccNarrow.matches) return;
  document.querySelectorAll(".explorer").forEach(function (ex) {
    ex.classList.add("collapsed", "js-ready");
    ex.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".toc").forEach(function (toc) {
    var btn = toc.querySelector("button.toc-header");
    var content = toc.querySelector(".toc-content");
    if (btn) {
      btn.classList.add("collapsed");
      btn.setAttribute("aria-expanded", "false");
    }
    if (content) content.classList.add("collapsed");
    toc.classList.add("js-ready");
  });
}

function ccCloseDrawers(target) {
  if (!ccNarrow.matches) return;
  var ex = document.querySelector(".explorer");
  if (ex && !ex.classList.contains("collapsed") && !(target && ex.contains(target))) {
    var exBtn = ex.querySelector("button.desktop-explorer");
    if (exBtn) exBtn.click();
  }
  var tocBtn = document.querySelector(".toc button.toc-header");
  if (tocBtn && !tocBtn.classList.contains("collapsed")) {
    var toc = tocBtn.closest(".toc");
    if (!(target && toc && toc.contains(target))) tocBtn.click();
  }
}

ccPrepareDrawers();
document.addEventListener("nav", ccPrepareDrawers);
document.addEventListener("click", function (e) { ccCloseDrawers(e.target); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") ccCloseDrawers(null);
});
`;

export default (() => NavLinks) satisfies QuartzComponentConstructor;
