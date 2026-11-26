import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { classify, countClasses, sortByClass } from '../utils/classify'

const COLUMNS = 20
const CELL = 24
const ICON = 20

const TN_STROKE = '#9e9e9e'

/**
 * One figure per application, grouped into the four confusion-matrix blocks:
 * TP, FP, FN, TN. The score plays no role. Class is encoded without relying on
 * hue: filled = invited, outline = not invited; dark = suitable, light/grey =
 * unsuitable. Works in greyscale and for colour-vision deficiencies.
 * Counts are printed below the grid because nobody counts 77 figures.
 */
export function IconArray({ rows, threshold, color, paleColor, groupLabel }) {
  const { t } = useTranslation()
  const rawId = useId()
  const symbolId = `person-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  const sorted = useMemo(() => sortByClass(rows, threshold), [rows, threshold])
  const counts = useMemo(() => countClasses(rows, threshold), [rows, threshold])

  const total = sorted.length
  if (total === 0) return null

  const iconStyles = {
    tp: { fill: color },
    fp: { fill: paleColor },
    fn: { fill: 'none', stroke: color, strokeWidth: 1.6 },
    tn: { fill: 'none', stroke: TN_STROKE, strokeWidth: 1.6 },
  }

  const swatchStyles = {
    tp: { bgcolor: color },
    fp: { bgcolor: paleColor },
    fn: { border: `1.5px solid ${color}` },
    tn: { border: `1.5px solid ${TN_STROKE}` },
  }

  const rowCount = Math.ceil(total / COLUMNS)

  const legend = [
    [
      { key: 'tp', label: 'iconArray.legendTp', count: counts.tp },
      { key: 'fp', label: 'iconArray.legendFp', count: counts.fp },
    ],
    [
      { key: 'fn', label: 'iconArray.legendFn', count: counts.fn },
      { key: 'tn', label: 'iconArray.legendTn', count: counts.tn },
    ],
  ]

  return (
    <Box>
      <svg
        viewBox={`0 0 ${COLUMNS * CELL} ${rowCount * CELL}`}
        role="img"
        aria-label={t('iconArray.ariaLabel', {
          group: groupLabel,
          total,
          tp: counts.tp,
          fp: counts.fp,
          fn: counts.fn,
          tn: counts.tn,
        })}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <defs>
          <symbol id={symbolId} viewBox="0 0 24 24">
            <circle cx="12" cy="7.5" r="4.2" />
            <path d="M4.2 21.5c0-4.3 3.5-7.8 7.8-7.8s7.8 3.5 7.8 7.8z" />
          </symbol>
        </defs>
        {sorted.map((row, index) => (
          <use
            key={index}
            href={`#${symbolId}`}
            x={(index % COLUMNS) * CELL + (CELL - ICON) / 2}
            y={Math.floor(index / COLUMNS) * CELL + (CELL - ICON) / 2}
            width={ICON}
            height={ICON}
            {...iconStyles[classify(row.score, row.outcome, threshold)]}
          />
        ))}
      </svg>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          columnGap: 2,
          rowGap: 1,
          mt: 1.5,
        }}
      >
        {legend.map((column, columnIndex) => (
          <Box
            key={columnIndex}
            sx={{
              display: 'grid',
              gridTemplateColumns: '12px 1fr auto',
              columnGap: 1,
              rowGap: 0.5,
              alignItems: 'center',
            }}
          >
            {column.map((item) => (
              <Box key={item.key} sx={{ display: 'contents' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 0.5,
                    boxSizing: 'border-box',
                    ...swatchStyles[item.key],
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {t(item.label)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                  {item.count}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
