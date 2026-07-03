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

export default (() => NavLinks) satisfies QuartzComponentConstructor;
