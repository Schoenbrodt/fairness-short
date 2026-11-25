import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatPercent } from '../utils/format'
import { fairnessCheck, hitRateGap } from '../utils/fairnessCheck'

const STYLES = {
  green: { border: '#1d6f3a', bg: '#eaf5ee' },
  yellow: { border: '#8a6100', bg: '#fdf5e2' },
  red: { border: '#b3261e', bg: '#fdecea' },
  none: { border: '#5b6472', bg: '#f1f3f6' },
}

export function FairnessCheck({ offerRateA, offerRateB, hitRateA, hitRateB, falseHiresA, falseHiresB, lang }) {
  const { t } = useTranslation()
  const { level, ratio } = fairnessCheck(offerRateA, offerRateB)
  const gap = hitRateGap(hitRateA, hitRateB)
  const falseHires = falseHiresA + falseHiresB
  const style = STYLES[level]

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, my: 3, borderLeft: `5px solid ${style.border}`, bgcolor: style.bg }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {t('fairnessCheck.title')}
        </Typography>
        <Chip
          size="small"
          label={t(`fairnessCheck.level.${level}`)}
          sx={{ bgcolor: style.border, color: '#fff', fontWeight: 700 }}
        />
      </Box>

      <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }} aria-live="polite">
        {ratio == null
          ? t('fairnessCheck.noOffers')
          : t('fairnessCheck.ratio', { value: formatPercent(ratio * 100, lang) })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('fairnessCheck.offerRates', {
          a: formatPercent(offerRateA, lang),
          b: formatPercent(offerRateB, lang),
        })}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        {t('fairnessCheck.hitGap', { value: gap })}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 0.5, color: falseHires > 0 ? 'error.main' : 'text.secondary' }}
      >
        {t('fairnessCheck.falseHiresTotal', { value: falseHires })}
      </Typography>

      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
        {t('fairnessCheck.legend')}
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        {t('fairnessCheck.note')}
      </Typography>
    </Paper>
  )
}
