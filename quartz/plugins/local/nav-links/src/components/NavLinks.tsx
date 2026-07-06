import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types"
import { pathToRoot } from "../util/path"

/**
 * Навигационные ссылки верхнего бара: «заметки» (главная со списком
 * последних заметок) и «теги». Стилистика бара живёт в custom.scss.
 */
const NavLinks: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const base = pathToRoot(fileData.slug as string)
  return (
    <nav class={`nav-links ${displayClass ?? ""}`}>
      <a href={base}>заметки</a>
      <a href={`${base}/tags/`}>теги</a>
      <a href={`${base}/about`}>обо мне</a>
    </nav>
  )
}

// Explorer при первом заходе скроллит СТРАНИЦУ к активному пункту дерева
// (scrollIntoView без block:nearest) — бар уезжает за верх экрана.
// Его же штатный ключ отключает это: если explorerScrollTop задан,
// скрипт лишь восстанавливает scrollTop контейнера. Ставим "0" только
// когда ключа нет — сохранённая позиция дерева между переходами живёт.
NavLinks.beforeDOMLoaded = `
if (!sessionStorage.getItem("explorerScrollTop")) {
  sessionStorage.setItem("explorerScrollTop", "0");
}
`

// На узких экранах (<1280) дерево и оглавление — выезжающие панели
// (drawer слева/справа), открываются штатными кнопками плагинов.
// Здесь: дефолт «закрыто» (+js-ready против мигания при загрузке),
// закрытие кликом вне панели и по Escape.
NavLinks.afterDOMLoaded = `
var ccNarrow = window.matchMedia("(max-width: 1279px)");

function ccTocBtn() { return document.querySelector(".toc button.toc-header"); }

// Синхронизирует вспомогательные классы: .toc.open (для бэкдропа —
// сток держит состояние на кнопке) и блокировку скролла фона.
function ccSync() {
  var ex = document.querySelector(".explorer");
  var exOpen = ex && !ex.classList.contains("collapsed");
  var tb = ccTocBtn();
  var tocOpen = tb && !tb.classList.contains("collapsed");
  var toc = tb && tb.closest(".toc");
  if (toc) toc.classList.toggle("open", !!tocOpen);
  document.body.classList.toggle("cc-drawer-open", ccNarrow.matches && !!(exOpen || tocOpen));
}

// Крестик закрытия внутри панели (на телефоне панель накрывает
// собственную кнопку-тогглер — закрыть иначе нечем).
function ccEnsureClose(panel, toggler) {
  if (!panel || panel.querySelector(".cc-panel-close")) return;
  var b = document.createElement("button");
  b.className = "cc-panel-close";
  b.setAttribute("aria-label", "Закрыть");
  b.textContent = "✕";
  b.addEventListener("click", function (e) {
    e.stopPropagation();
    var t = toggler();
    if (t) t.click();
    ccSync();
  });
  panel.prepend(b);
}

function ccPrepareDrawers() {
  if (!ccNarrow.matches) return;
  document.querySelectorAll(".explorer").forEach(function (ex) {
    ex.classList.add("collapsed", "js-ready");
    ex.setAttribute("aria-expanded", "false");
    ccEnsureClose(ex.querySelector(".explorer-content"), function () {
      return ex.querySelector("button.desktop-explorer");
    });
  });
  document.querySelectorAll(".toc").forEach(function (toc) {
    var btn = toc.querySelector("button.toc-header");
    var content = toc.querySelector(".toc-content");
    if (btn) {
      btn.classList.add("collapsed");
      btn.setAttribute("aria-expanded", "false");
    }
    if (content) {
      content.classList.add("collapsed");
      ccEnsureClose(content, function () { return toc.querySelector("button.toc-header"); });
    }
    toc.classList.add("js-ready");
  });
  ccSync();
}

function ccCloseDrawers(target) {
  if (!ccNarrow.matches) return;
  var ex = document.querySelector(".explorer");
  if (ex && !ex.classList.contains("collapsed")) {
    var exContent = ex.querySelector(".explorer-content");
    var exBtn = ex.querySelector("button.desktop-explorer");
    var inside = target && ((exContent && exContent.contains(target)) || (exBtn && exBtn.contains(target)));
    if (!inside && exBtn) exBtn.click();
  }
  var tocBtn = ccTocBtn();
  if (tocBtn && !tocBtn.classList.contains("collapsed")) {
    var toc = tocBtn.closest(".toc");
    var tc = toc && toc.querySelector(".toc-content");
    var insideToc = target && ((tc && tc.contains(target)) || tocBtn.contains(target));
    if (!insideToc) tocBtn.click();
  }
  ccSync();
}

ccPrepareDrawers();
document.addEventListener("nav", ccPrepareDrawers);
document.addEventListener("click", function (e) {
  // Выбор пункта внутри панели закрывает её (якоря оглавления не
  // порождают nav-событие — закрываем сами; для дерева так же удобнее)
  if (ccNarrow.matches && e.target && e.target.closest) {
    var link = e.target.closest(".toc-content a, .explorer-content a");
    if (link) {
      var tocBtn2 = link.closest(".toc-content") ? ccTocBtn() : null;
      var exBtn2 = link.closest(".explorer-content")
        ? document.querySelector(".explorer button.desktop-explorer")
        : null;
      var b = tocBtn2 || exBtn2;
      if (b && !b.classList.contains("collapsed")) b.click();
      if (exBtn2) {
        var ex2 = document.querySelector(".explorer");
        if (ex2 && !ex2.classList.contains("collapsed")) exBtn2.click();
      }
      ccSync();
      return;
    }
  }
  ccCloseDrawers(e.target);
  ccSync();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") ccCloseDrawers(null);
});
`

export default (() => NavLinks) satisfies QuartzComponentConstructor
