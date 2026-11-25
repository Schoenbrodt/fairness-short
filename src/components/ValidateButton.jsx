import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export function ValidateButton({ tableRef, id }) {
  const { t } = useTranslation()

  const handleClick = () => {
    if (tableRef.current) {
      tableRef.current.validate()
    }
  }

  return (
    <Button
      id={id}
      variant="contained"
      color="secondary"
      startIcon={<CheckCircleIcon />}
      onClick={handleClick}
      sx={{ my: 1.5 }}
    >
      {t('common.checkResult')}
    </Button>
  )
}
