import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const ARTICLE_URL = 'https://onlinelibrary.wiley.com/doi/epdf/10.1111/test.70016'
const DOI_URL = 'https://doi.org/10.1111/test.70016'

export default function About() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('about.title')}
      </Typography>

      {/* Article card with thumbnail */}
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 0,
          }}
        >
          {/* Thumbnail */}
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
              '&:hover img': {
                transform: 'scale(1.03)',
              },
            }}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}article-thumbnail.png`}
              alt="Article thumbnail"
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

          {/* Article info */}
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
              sx={{
                mt: 1.5,
                fontStyle: 'italic',
                color: 'text.primary',
                lineHeight: 1.6,
              }}
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

      {/* Goal */}
      <Typography variant="h5" gutterBottom>
        {t('about.goalTitle')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('about.goalText')}
      </Typography>

      {/* Funding & License */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('about.fundingTitle')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: t('about.fundingText') }}
          />
        </Paper>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
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

      <Divider sx={{ mb: 3 }} />

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
