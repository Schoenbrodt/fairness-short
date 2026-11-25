import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Introduction() {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('intro.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('intro.p1')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('intro.p2')}
      </Typography>
      <Typography
        variant="body1"
        paragraph
        dangerouslySetInnerHTML={{ __html: t('intro.p3') }}
      />
    </Box>
  )
}
