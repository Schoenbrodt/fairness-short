import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const ARTICLE_URL = 'https://onlinelibrary.wiley.com/doi/epdf/10.1111/test.70016'
const DOI_URL = 'https://doi.org/10.1111/test.70016'

const authors = ['about.author1', 'about.author2', 'about.author3', 'about.author4']

export default function About() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('about.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('about.shortVersionNote')}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 0 }}>
          <Link
            href={ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'block',
              flexShrink: 0,
              width: { xs: '100%', sm: 200 },
              bgcolor: '#f5f5f5',
              borderRight: { sm: '1px solid' },
              borderBottom: { xs: '1px solid', sm: 'none' },
              borderColor: 'divider',
              overflow: 'hidden',
              '&:hover img': { transform: 'scale(1.03)' },
            }}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}article-thumbnail.png`}
              alt={t('about.articleAlt')}
              sx={{
                width: '100%',
                height: { xs: 240, sm: '100%' },
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
                transition: 'transform 0.2s ease',
              }}
            />
          </Link>

          <Box sx={{ p: { xs: 2.5, sm: 3 }, flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 1.2,
                fontSize: '0.7rem',
              }}
            >
              {t('about.articleTitle')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: 'text.secondary' }}
              dangerouslySetInnerHTML={{ __html: t('about.articleDescription') }}
            />
            <Typography
              variant="body2"
              sx={{ mt: 1.5, fontStyle: 'italic', color: 'text.primary', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: t('about.articleCitation') }}
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                endIcon={<OpenInNewIcon />}
                href={ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('about.readArticle')}
              </Button>
              <Typography variant="caption" color="text.secondary">
                DOI:{' '}
                <Link
                  href={DOI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'primary.main' }}
                >
                  10.1111/test.70016
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" paragraph>
        {t('about.adaptationNote')}
      </Typography>

      <Typography variant="h5" gutterBottom>
        {t('about.goalTitle')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('about.goalText')}
      </Typography>

      <Typography variant="h5" gutterBottom>
        {t('about.authorsTitle')}
      </Typography>
      <Box component="ul" sx={{ pl: 3, my: 1 }}>
        {authors.map((key) => (
          <Typography component="li" variant="body2" key={key} sx={{ mb: 0.5 }}>
            {t(key)}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, my: 4 }}>
        <Paper elevation={0} sx={{ flex: 1, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            {t('about.fundingTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('about.fundingText')}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            {t('about.licenseTitle')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: t('about.licenseText') }}
          />
        </Paper>
      </Box>

      <Typography variant="h5" gutterBottom>
        {t('about.imprintTitle')}
      </Typography>
      <Box
        sx={{ '& p': { mb: 1.5 }, '& a': { color: 'primary.main' }, fontSize: '0.9rem', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: t('about.imprintText') }}
      />

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        {t('about.privacyTitle')}
      </Typography>
      <Box
        sx={{ '& p': { mb: 1.5 }, '& a': { color: 'primary.main' }, fontSize: '0.9rem', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: t('about.privacyText') }}
      />

      <Divider sx={{ my: 3 }} />

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/${lang}`)}
        sx={{
          borderColor: 'divider',
          color: 'text.secondary',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        }}
      >
        {t('about.backToModule')}
      </Button>
    </Box>
  )
}
