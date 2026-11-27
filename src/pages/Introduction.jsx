import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function Introduction() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('intro.title')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('intro.lede')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('intro.p1')}
      </Typography>

      <Card variant="outlined" sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('intro.scoreTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('intro.scoreText')}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" paragraph>
        {t('intro.note')}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        endIcon={<ArrowForwardIcon />}
        onClick={() => navigate(`/${lang}/groups`)}
        sx={{ mt: 1 }}
      >
        {t('intro.start')}
      </Button>
    </Box>
  )
}
