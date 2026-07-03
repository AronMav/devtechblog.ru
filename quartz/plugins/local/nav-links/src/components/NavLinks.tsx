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

export default (() => NavLinks) satisfies QuartzComponentConstructor;
