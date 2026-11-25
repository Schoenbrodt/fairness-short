import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useEventLog } from '../events'

export function ThresholdSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = '',
  disabled = false,
  name = 'threshold',
}) {
  const log = useEventLog()

  return (
    <Box sx={{ my: 2 }}>
      {label && (
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={value}
          onChange={(_, v) => onChange(v)}
          onChangeCommitted={(_, v) => log?.('moved', name, { value: v })}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <Chip
          label={value}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: '1rem', minWidth: 48 }}
        />
      </Box>
    </Box>
  )
}
