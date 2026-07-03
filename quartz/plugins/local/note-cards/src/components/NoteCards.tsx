import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";

type PageLike = {
  slug?: string;
  description?: string;
  frontmatter?: { title?: string };
  dates?: { created?: Date; modified?: Date };
};

/** Служебные страницы и индексы папок в список статей не попадают. */
function isArticle(page: PageLike): boolean {
  const slug = page.slug ?? "";
  if (slug === "" || slug === "index" || slug === "404") return false;
  if (slug === "tags" || slug.startsWith("tags/")) return false;
  if (slug.endsWith("/index")) return false;
  return true;
}

function pageDate(page: PageLike): Date | undefined {
  return page.dates?.modified ?? page.dates?.created;
}

function formatDate(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Карточки статей с превью — только на главной странице.
 * Фильтрация служебных страниц происходит здесь, на этапе сборки,
 * а не CSS-ом на клиенте.
 */
const NoteCards: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null;

  const locale = (cfg?.locale as string) ?? "ru-RU";
  const pages = (allFiles as PageLike[])
    .filter(isArticle)
    .sort((a, b) => (pageDate(b)?.getTime() ?? 0) - (pageDate(a)?.getTime() ?? 0));

  if (pages.length === 0) return null;

  return (
    <div class="note-cards">
      {pages.map((page) => {
        const title = page.frontmatter?.title ?? page.slug;
        const date = pageDate(page);
        const desc = (page.description ?? "").trim();
        return (
          <a class="note-card" href={`./${page.slug}`}>
            {date && <span class="note-card-date">{formatDate(date, locale)}</span>}
            <h3>{title}</h3>
            {desc.length > 0 && <p>{desc}</p>}
          </a>
        );
      })}
    </div>
  );
};

export default (() => NoteCards) satisfies QuartzComponentConstructor;
