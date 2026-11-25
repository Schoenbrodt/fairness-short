import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import EditIcon from '@mui/icons-material/Edit'
import ForumIcon from '@mui/icons-material/Forum'

const iconMap = {
  'pencil-alt': <EditIcon fontSize="small" />,
  'comments': <ForumIcon fontSize="small" />,
}

export function TaskBox({ label, children, icon = null }) {
  return (
    <Alert
      severity="info"
      icon={false}
      sx={{ my: 2.5, '& .MuiAlert-message': { width: '100%' } }}
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {icon && iconMap[icon]}
        {label}
      </AlertTitle>
      {children}
    </Alert>
  )
}
