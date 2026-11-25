import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TranslateIcon from '@mui/icons-material/Translate'

export const DRAWER_WIDTH = 285

const pages = [
  { path: '', key: 'intro' },
  { path: '/loan-profit', key: 'loanProfit' },
  { path: '/data-intro', key: 'dataIntro' },
  { path: '/dataset', key: 'dataset' },
  { path: '/measures', key: 'measures' },
  { path: '/threshold', key: 'threshold' },
  { path: '/two-groups', key: 'twoGroups' },
  { path: '/fair', key: 'fair' },
  { path: '/discussion', key: 'discussion' },
]

export function Sidebar({ lang, onToggleLanguage, isMobile, mobileOpen, onMobileClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const currentHash = location.pathname

  const handleNav = (path) => {
    navigate(`/${lang}${path}`)
    if (isMobile) onMobileClose()
  }

  const isActive = (path) => {
    const full = `/${lang}${path}`
    if (path === '') return currentHash === `/${lang}` || currentHash === `/${lang}/`
    return currentHash === full
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 2.5 }}>
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{
            color: 'primary.dark',
            cursor: 'pointer',
            lineHeight: 1.4,
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => handleNav('')}
        >
          {t('app.title')}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto', py: 1 }} component="nav">
        {pages.map((page) => (
          <ListItemButton
            key={page.key}
            selected={isActive(page.path)}
            onClick={() => handleNav(page.path)}
            sx={{ py: 0.8, px: 2 }}
          >
            <ListItemText
              primary={t(`nav.${page.key}`)}
              primaryTypographyProps={{
                fontSize: '0.84rem',
                lineHeight: 1.45,
                fontWeight: isActive(page.path) ? 600 : 400,
                color: isActive(page.path) ? 'primary.main' : 'text.secondary',
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<TranslateIcon />}
          onClick={onToggleLanguage}
          sx={{ borderColor: 'divider', color: 'text.secondary' }}
        >
          {t('app.switchLang')}
        </Button>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, position: 'sticky', top: 0, height: '100vh' },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
