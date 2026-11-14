import React from 'react';
import { MoreHorizontal } from 'lucide-react';

/**
 * Sohoj Pathshala GridTable Component
 * Fully accessible Grid-based table structure
 * Avoids HTML table parsing bugs during dynamic rendering
 * Handles zebra striping, sticky min-width, overflow-x scroll, and action buttons
 */
export default function GridTable({
  columns = [], // [{ key, label, width: '1fr', align: 'left' }]
  data = [],
  keyField = 'id',
  zebra = false,
  minWidth = '560px',
  onActionClick,
  actionAriaLabel = 'আরও কাজ',
  renderAction,
  renderRow,
  className = '',
  emptyText = 'কোনো রেকর্ড পাওয়া যায়নি।'
}) {
  const gridTemplateColumns = columns.map(c => c.width || '1fr').join(' ');

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border bg-surface ${className}`}>
      <div 
        role="table" 
        className="w-full text-xs sm:text-sm"
        style={{ minWidth }}
      >
        {/* Table Header */}
        <div 
          role="row" 
          className="grid items-center bg-surface-2 text-muted font-semibold border-b border-border min-h-[44px] px-4 py-2.5"
          style={{ gridTemplateColumns }}
        >
          {columns.map((col, idx) => (
            <div 
              key={idx} 
              role="columnheader"
              className={`truncate ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        {data.length === 0 ? (
          <div className="p-8 text-center text-muted font-medium">
            {emptyText}
          </div>
        ) : (
          <div role="rowgroup">
            {data.map((row, rowIdx) => {
              if (renderRow) return renderRow(row, rowIdx);

              const isOdd = rowIdx % 2 !== 0;
              const zebraClass = zebra && isOdd ? 'bg-surface-2/60' : 'bg-surface hover:bg-surface-2/40';

              return (
                <div
                  key={row[keyField] || rowIdx}
                  role="row"
                  className={`grid items-center min-h-[48px] px-4 py-2 border-b border-border/80 transition-colors ${zebraClass}`}
                  style={{ gridTemplateColumns }}
                >
                  {columns.map((col, colIdx) => {
                    const val = row[col.key];
                    const isLast = colIdx === columns.length - 1;

                    return (
                      <div
                        key={colIdx}
                        role="cell"
                        className={`truncate ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {col.render ? (
                          col.render(val, row, rowIdx)
                        ) : isLast && (renderAction || onActionClick) ? (
                          renderAction ? (
                            renderAction(row, rowIdx)
                          ) : (
                            <button
                              type="button"
                              onClick={() => onActionClick && onActionClick(row)}
                              aria-label={actionAriaLabel}
                              className="w-9 h-9 rounded-lg hover:bg-surface-2 text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer ml-auto"
                            >
                              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )
                        ) : (
                          <span className={col.fontMono ? 'font-mono' : ''}>
                            {val ?? '—'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
