import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const steps = [
  { path: '', key: 'data', shortKey: 'dataShort' },
  { path: '/thresholds', key: 'fair', shortKey: 'fairShort' },
]

export function StepNav({ lang }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const currentIndex = steps.findIndex((step) => {
    const full = `/${lang}${step.path}`
    if (step.path === '') {
      return location.pathname === full || location.pathname === `${full}/`
    }
    return location.pathname === full
  })

  const circleSize = isSmall ? 28 : 34

  return (
    <Box
      component="nav"
      aria-label={t('nav.learningPath')}
      sx={{ width: '100%', py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}
    >
      <Box sx={{ position: 'relative', maxWidth: 520, mx: 'auto' }}>
        <Box
          sx={{
            position: 'absolute',
            top: circleSize / 2,
            left: `calc(100% / ${steps.length} / 2)`,
            right: `calc(100% / ${steps.length} / 2)`,
            height: 2,
            bgcolor: '#E8ECF0',
            zIndex: 0,
          }}
        />
        {currentIndex > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: circleSize / 2,
              left: `calc(100% / ${steps.length} / 2)`,
              width: `calc(100% / ${steps.length} * ${currentIndex})`,
              height: 2,
              bgcolor: 'primary.main',
              zIndex: 0,
              transition: 'width 0.3s ease',
            }}
          />
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {steps.map((step, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex

            return (
              <ButtonBase
                key={step.key}
                onClick={() => navigate(`/${lang}${step.path}`)}
                aria-label={t(`nav.${step.key}`)}
                aria-current={isActive ? 'step' : undefined}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  px: 0.5,
                  py: 0.5,
                  borderRadius: 2,
                  '&:hover .step-circle': {
                    transform: 'scale(1.12)',
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
                    ...(!isActive &&
                      !isCompleted && {
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
                      fontSize: '0.7rem',
                      fontWeight: isActive ? 700 : 400,
                      color: isActive ? 'secondary.main' : 'text.secondary',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2,
                    }}
                  >
                    {t(`nav.${step.shortKey}`)}
                  </Typography>
                )}
              </ButtonBase>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
