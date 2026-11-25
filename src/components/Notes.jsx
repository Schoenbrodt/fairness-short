import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PrintIcon from '@mui/icons-material/Print'

const PREFIX = 'fairness.notes.'

function readNote(key) {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(PREFIX + key) ?? ''
  } catch {
    return ''
  }
}

function writeNote(key, value) {
  if (typeof window === 'undefined') return
  try {
    if (value.trim() === '') {
      window.localStorage.removeItem(PREFIX + key)
    } else {
      window.localStorage.setItem(PREFIX + key, value)
    }
  } catch {
    // Storage can be unavailable; the note still works for the current session.
  }
}

export function Notes({ id, label, rows = 3 }) {
  const { t } = useTranslation()
  const [text, setText] = useState(() => readNote(id))

  const handleChange = (event) => {
    setText(event.target.value)
    writeNote(id, event.target.value)
  }

  return (
    <Box sx={{ mt: 1.5, width: '100%' }}>
      <TextField
        className="notes-input"
        label={label ?? t('notes.label')}
        placeholder={t('notes.placeholder')}
        value={text}
        onChange={handleChange}
        multiline
        minRows={rows}
        fullWidth
        size="small"
        sx={{ bgcolor: 'background.paper', width: '100%' }}
        inputProps={{ 'aria-label': label ?? t('notes.label') }}
      />
      <Box className="notes-print">
        <Typography variant="subtitle2" component="p" sx={{ mb: 0.25 }}>
          {label ?? t('notes.label')}
        </Typography>
        <Typography variant="body2" component="p" sx={{ whiteSpace: 'pre-wrap' }}>
          {text.trim() === '' ? '—' : text}
        </Typography>
      </Box>
    </Box>
  )
}

export function NotesActions() {
  const { t } = useTranslation()

  const clearNotes = () => {
    if (!window.confirm(t('notes.confirmClear'))) return
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => window.localStorage.removeItem(key))
    } catch {
      // Nothing to clear if storage is unavailable.
    }
    window.location.reload()
  }

  return (
    <Box className="no-print" sx={{ my: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={() => window.print()}>
          {t('notes.print')}
        </Button>
        <Button
          variant="text"
          size="small"
          color="inherit"
          startIcon={<DeleteOutlineIcon />}
          onClick={clearNotes}
        >
          {t('notes.clear')}
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
        {t('notes.printHint')}
      </Typography>
    </Box>
  )
}
