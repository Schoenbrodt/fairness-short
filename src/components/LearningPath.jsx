import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const pages = [
  { path: '', key: 'intro', shortKey: 'introShort' },
  { path: '/loan-profit', key: 'loanProfit', shortKey: 'loanProfitShort' },
  { path: '/data-intro', key: 'dataIntro', shortKey: 'dataIntroShort' },
  { path: '/dataset', key: 'dataset', shortKey: 'datasetShort' },
  { path: '/measures', key: 'measures', shortKey: 'measuresShort' },
  { path: '/threshold', key: 'threshold', shortKey: 'thresholdShort' },
  { path: '/two-groups', key: 'twoGroups', shortKey: 'twoGroupsShort' },
  { path: '/fair', key: 'fair', shortKey: 'fairShort' },
  { path: '/discussion', key: 'discussion', shortKey: 'discussionShort' },
]

export function LearningPath({ lang }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const currentIndex = pages.findIndex((page) => {
    const full = `/${lang}${page.path}`
    if (page.path === '') return location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    return location.pathname === full
  })

  const handleNav = (path) => {
    navigate(`/${lang}${path}`)
  }

  const circleSize = isSmall ? 28 : 34

  return (
    <Box sx={{ width: '100%', py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          position: 'relative',
          maxWidth: 760,
          mx: 'auto',
        }}
      >
        {/* Background connector line */}
        <Box
          sx={{
            position: 'absolute',
            top: circleSize / 2,
            left: `calc(100% / ${pages.length} / 2)`,
            right: `calc(100% / ${pages.length} / 2)`,
            height: 2,
            bgcolor: '#E8ECF0',
            zIndex: 0,
          }}
        />
        {/* Progress connector line */}
        {currentIndex > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: circleSize / 2,
              left: `calc(100% / ${pages.length} / 2)`,
              width: `calc(100% / ${pages.length} * ${currentIndex})`,
              height: 2,
              bgcolor: 'primary.main',
              zIndex: 0,
              transition: 'width 0.3s ease',
            }}
          />
        )}

        {/* Step items in equal-width grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${pages.length}, 1fr)`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {pages.map((page, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex

            return (
              <Tooltip key={page.key} title={t(`nav.${page.key}`)} arrow placement="bottom">
                <Box
                  onClick={() => handleNav(page.path)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover .step-circle': {
                      transform: 'scale(1.15)',
                      boxShadow: isActive
                        ? '0 0 0 4px rgba(165, 117, 72, 0.2)'
                        : '0 0 0 4px rgba(82, 150, 165, 0.15)',
                    },
                  }}
                >
                  <Box
                    className="step-circle"
                    sx={{
                      width: circleSize,
                      height: circleSize,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: isSmall ? '0.7rem' : '0.8rem',
                      transition: 'all 0.2s ease',
                      ...(isActive && {
                        bgcolor: 'secondary.main',
                        color: 'white',
                        boxShadow: '0 0 0 3px rgba(165, 117, 72, 0.2)',
                      }),
                      ...(isCompleted && {
                        bgcolor: 'primary.main',
                        color: 'white',
                      }),
                      ...(!isActive && !isCompleted && {
                        bgcolor: '#E8ECF0',
                        color: 'text.secondary',
                      }),
                    }}
                  >
                    {index + 1}
                  </Box>
                  {!isSmall && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? 'secondary.main' : 'text.secondary',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                      }}
                    >
                      {t(`nav.${page.shortKey}`)}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
