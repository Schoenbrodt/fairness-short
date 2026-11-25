import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import EditIcon from '@mui/icons-material/Edit'
import ForumIcon from '@mui/icons-material/Forum'

const iconMap = {
  'pencil-alt': <EditIcon fontSize="small" sx={{ mr: 0.5 }} />,
  'comments': <ForumIcon fontSize="small" sx={{ mr: 0.5 }} />,
}

export function TaskBox({ label, children, icon = null }) {
  return (
    <Alert severity="info" icon={false} sx={{ my: 2.5 }}>
      <AlertTitle>{label}</AlertTitle>
      {icon && iconMap[icon]}
      {children}
    </Alert>
  )
}
