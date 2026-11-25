import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { DotPlot } from '../components/DotPlot'
import { Notes, NotesActions } from '../components/Notes'
import { TaskBox } from '../components/TaskBox'

export default function TwoPopulations() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.resolvedLanguage
  const displayData = useMemo(
    () => (rawData ? getDisplayData(rawData, lang) : null),
    [rawData, lang]
  )

  const pinkvilleData = useMemo(
    () => (displayData ? displayData.filter((d) => d.age === (lang === 'de' ? 'Alt' : 'Old')) : null),
    [displayData, lang]
  )

  const greenfieldData = useMemo(
    () => (displayData ? displayData.filter((d) => d.age === (lang === 'de' ? 'Jung' : 'Young')) : null),
    [displayData, lang]
  )

  if (!displayData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const repaysLabel = lang === 'de' ? 'Zahlt zurück' : 'Repays'
  const notRepaysLabel = lang === 'de' ? 'Zahlt nicht zurück' : 'Does not repay'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('twoPopulations.title')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('twoPopulations.subtitle')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro1')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro2')}
      </Typography>

      <Alert severity="info" sx={{ my: 2 }}>
        {t('twoPopulations.scoreHint')}
      </Alert>

      <Typography variant="subtitle2" component="p" sx={{ mt: 3, mb: 0 }}>
        {t('twoPopulations.allPeople')}
      </Typography>
      <DotPlot data={displayData} colorScheme="Paired" />

      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro3')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro4')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
          my: 2,
        }}
      >
        <Card sx={{ borderTop: '3px solid #6a3d9a' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a3d9a' }}>
              {t('data.pinkville')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('twoPopulations.groupSize')}
            </Typography>
            <DotPlot
              data={pinkvilleData}
              height={200}
              fontSize={13}
              colorDomain={[repaysLabel, notRepaysLabel]}
              colorRange={['#6a3d9a', '#cab2d6']}
              yDomain={[0, 10]}
              marginLeft={40}
            />
          </CardContent>
        </Card>

        <Card sx={{ borderTop: '3px solid #33a02c' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#33a02c' }}>
              {t('data.greenfield')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('twoPopulations.groupSize')}
            </Typography>
            <DotPlot
              data={greenfieldData}
              height={200}
              fontSize={13}
              colorDomain={[repaysLabel, notRepaysLabel]}
              colorRange={['#33a02c', '#b2df8a']}
              yDomain={[0, 10]}
              marginLeft={40}
            />
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>
        {t('common.tasks')}
      </Typography>
      <NotesActions />

      <TaskBox label={t('twoPopulations.taskALabel')} icon="pencil-alt">
        <Typography variant="body2" paragraph>
          {t('twoPopulations.taskA')}
        </Typography>
        <Notes id="groups-a" />
      </TaskBox>

      <TaskBox label={t('twoPopulations.taskBLabel')} icon="pencil-alt">
        <Typography variant="body2" paragraph>
          {t('twoPopulations.taskB')}
        </Typography>
        <Notes id="groups-b" />
      </TaskBox>
    </Box>
  )
}
