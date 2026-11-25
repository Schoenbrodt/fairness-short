import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import DownloadIcon from '@mui/icons-material/Download'
import TranslateIcon from '@mui/icons-material/Translate'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LearningPath, pages } from './LearningPath'
import { useEventLog, downloadEvents } from '../events'

export function Layout() {
  const { t, i18n } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const log = useEventLog()

  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    log?.('navigated', 'page', { to: location.pathname })
  }, [location.pathname, log])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de'
    const currentPath = location.pathname.replace(`/${i18n.language}`, '')
    i18n.changeLanguage(newLang)
    navigate(`/${newLang}${currentPath}`)
  }

  const isAboutPage = location.pathname === `/${lang}/about`

  const currentIndex = pages.findIndex((page) => {
    const full = `/${lang}${page.path}`
    if (page.path === '') return location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    return location.pathname === full
  })

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < pages.length - 1

  const goToPrev = () => {
    if (hasPrev) {
      navigate(`/${lang}${pages[currentIndex - 1].path}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNext = () => {
    if (hasNext) {
      navigate(`/${lang}${pages[currentIndex + 1].path}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top bar: title + language toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{
            color: 'primary.dark',
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => navigate(`/${lang}`)}
        >
          {t('app.title')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={t('nav.about')}>
            <IconButton
              size="small"
              onClick={() => navigate(`/${lang}/about`)}
              sx={{
                color: isAboutPage ? 'primary.main' : 'text.secondary',
                bgcolor: isAboutPage ? 'rgba(82, 150, 165, 0.08)' : 'transparent',
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.downloadEvents', 'Download events')}>
            <IconButton size="small" onClick={downloadEvents} sx={{ color: 'text.secondary' }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TranslateIcon />}
            onClick={toggleLanguage}
            sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.8rem' }}
          >
            {t('app.switchLang')}
          </Button>
        </Box>
      </Box>

      {/* Learning path stepper (hidden on About page) */}
      {!isAboutPage && (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <LearningPath lang={lang} />
        </Box>
      )}

      {/* Centered content area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          component="main"
          sx={{
            width: '100%',
            maxWidth: 800,
          }}
        >
          <Outlet />

          {/* Prev / Next navigation (hidden on About page) */}
          {!isAboutPage && (
            <>
              <Divider sx={{ mt: 5, mb: 3 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                  }}
                >
                  {t('common.previous')}
                </Button>

                <Typography variant="caption" color="text.secondary">
                  {currentIndex + 1} / {pages.length}
                </Typography>

                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={goToNext}
                  disabled={!hasNext}
                  color="secondary"
                >
                  {t('common.next')}
                </Button>
              </Box>
            </>
          )}

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: 4,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('app.footer')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
