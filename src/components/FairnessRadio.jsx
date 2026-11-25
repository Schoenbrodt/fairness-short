import { useTranslation } from 'react-i18next'
import { useEventLog } from '../events'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

export function FairnessRadio({ value, onChange }) {
  const { t } = useTranslation()
  const log = useEventLog()

  const options = [
    { key: 'independent', label: t('fairThresholds.independent') },
    { key: 'sameThresholds', label: t('fairThresholds.sameThresholds') },
    { key: 'samePositiveRates', label: t('fairThresholds.samePositiveRates') },
    { key: 'sameTruePositiveRates', label: t('fairThresholds.sameTruePositiveRates') },
  ]

  const handleChange = (e) => {
    const strategy = e.target.value
    onChange(strategy)
    log?.('selected', 'fairness-radio', { strategy })
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
        {t('fairThresholds.sliderLabel')}
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.key}
            value={opt.key}
            control={<Radio size="small" />}
            label={opt.label}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
