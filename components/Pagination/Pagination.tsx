'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageItems(current: number, total: number): (number | 'dots')[] {
  const delta = 1;
  const range: number[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i += 1
  ) {
    range.push(i);
  }

  const items: (number | 'dots')[] = [1];
  if (range.length > 0 && range[0] > 2) items.push('dots');
  items.push(...range);
  if (range.length > 0 && range[range.length - 1] < total - 1) {
    items.push('dots');
  }
  items.push(total);
  return items;
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className={styles.arrowIcon}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={
          direction === 'left'
            ? 'M15.75 19.5L8.25 12l7.5-7.5'
            : 'M8.25 4.5l7.5 7.5-7.5 7.5'
        }
      />
    </svg>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.arrow}
        aria-label="Previous page"
      >
        <ArrowIcon direction="left" />
      </button>

      <ul className={styles.pages}>
        {items.map((item, index) =>
          item === 'dots' ? (
            <li key={`dots-${index}`} className={styles.dots} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item} className={styles.pageItem}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                className={`${styles.pageBtn} ${
                  item === currentPage ? styles.active : ''
                }`.trim()}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.arrow}
        aria-label="Next page"
      >
        <ArrowIcon direction="right" />
      </button>
    </nav>
  );
}
