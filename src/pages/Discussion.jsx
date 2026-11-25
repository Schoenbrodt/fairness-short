import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TaskBox } from '../components/TaskBox'

export default function Discussion() {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('discussion.title')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('discussion.intro')}
      </Typography>

      <TaskBox label={`${t('common.task')} 1`} icon="pencil-alt">
        <Typography variant="body1" paragraph>
          {t('discussion.task1')}
        </Typography>
        <ol type="a">
          <li>{t('discussion.task1a')}</li>
        </ol>
      </TaskBox>
    </Box>
  )
}
