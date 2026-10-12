import useSendQuery from "@/hooks/use-send-query";
import clsx from "clsx";

type TileActionType = "trend" | "query";

type TileItem = {
  id?: string | number;
  title: string;
  subtitle?: string;
  image: string;
  query?: string;
  actionType?: TileActionType;
  colSpan?: number;
  rowSpan?: number;
  overlayClassName?: string;
  contentClassName?: string;
};

type TileStyles = {
  wrapper?: string;
  headerWrapper?: string;
  title?: string;
  subtitle?: string;
  grid?: string;
  card?: string;
  cardImage?: string;
  cardOverlay?: string;
  cardTitle?: string;
  cardSubtitle?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  tiles?: TileItem[];
  styles?: TileStyles;
};

const PlpTiles = ({ title, subtitle, tiles = [], styles = {} }: Props) => {
  const { onSendQuery } = useSendQuery();

  if (!tiles.length) {
    return null;
  }

  return (
    <section className={clsx("mb-6", styles.wrapper)}>
      {(title || subtitle) && (
        <header className={clsx("mb-4 text-center", styles.headerWrapper)}>
          {title ? (
            <h2 className={clsx("text-2xl font-semibold leading-tight", styles.title)}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={clsx("mt-1 text-sm text-gray-500", styles.subtitle)}>
              {subtitle}
            </p>
          ) : null}
        </header>
      )}

      <div
        className={clsx(
          "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6",
          styles.grid,
        )}
      >
        {tiles.map((tile, idx) => {
          const queryText = tile.query?.trim() || tile.title.trim();
          const actionType = tile.actionType || "trend";
          const colSpan = Math.min(Math.max(tile.colSpan || 2, 1), 6);
          const rowSpan = Math.min(Math.max(tile.rowSpan || 1, 1), 4);

          return (
            <button
              key={tile.id || `${tile.title}-${idx}`}
              type="button"
              className={clsx(
                "group relative min-h-[145px] overflow-hidden text-left sm:min-h-[230px] lg:min-h-[280px]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60",
                styles.card,
              )}
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
              }}
              onClick={() => {
                onSendQuery(
                  actionType === "query"
                    ? { query: queryText }
                    : { trend: queryText },
                );
              }}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className={clsx(
                  "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
                  styles.cardImage,
                )}
                loading="lazy"
              />
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent",
                  styles.cardOverlay,
                  tile.overlayClassName,
                )}
              />
              <div
                className={clsx(
                  "absolute bottom-0 left-0 right-0 z-[1] p-3 text-white sm:p-4",
                  tile.contentClassName,
                )}
              >
                <h3 className={clsx("text-xl font-semibold leading-tight", styles.cardTitle)}>
                  {tile.title}
                </h3>
                {tile.subtitle ? (
                  <p className={clsx("mt-1 text-sm sm:text-base", styles.cardSubtitle)}>
                    {tile.subtitle}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PlpTiles;
