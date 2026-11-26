import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { loadCsv } from '../utils/loadData'
import { getDisplayData, getOutcomeLabel } from '../utils/translateData'
import { GROUP_COLORS, UNSUITABLE_COLOR } from '../palette'
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
    () => (displayData ? displayData.filter((d) => d.group === 'pinkville') : null),
    [displayData]
  )

  const greenfieldData = useMemo(
    () => (displayData ? displayData.filter((d) => d.group === 'greenfield') : null),
    [displayData]
  )

  if (!displayData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const suitableLabel = getOutcomeLabel('suitable', lang)
  const unsuitableLabel = getOutcomeLabel('unsuitable', lang)

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

      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro3')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('twoPopulations.intro4')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('twoPopulations.knownOutcomes')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
          my: 2,
        }}
      >
        <Card sx={{ borderTop: `3px solid ${GROUP_COLORS.pinkville}` }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: GROUP_COLORS.pinkville }}
            >
              {t('data.pinkville')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('twoPopulations.groupSize')}
            </Typography>
            <DotPlot
              data={pinkvilleData}
              height={200}
              fontSize={13}
              colorDomain={[suitableLabel, unsuitableLabel]}
              colorRange={[GROUP_COLORS.pinkville, UNSUITABLE_COLOR]}
              yDomain={[0, 10]}
              marginLeft={40}
            />
          </CardContent>
        </Card>

        <Card sx={{ borderTop: `3px solid ${GROUP_COLORS.greenfield}` }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: GROUP_COLORS.greenfield }}
            >
              {t('data.greenfield')}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('twoPopulations.groupSize')}
            </Typography>
            <DotPlot
              data={greenfieldData}
              height={200}
              fontSize={13}
              colorDomain={[suitableLabel, unsuitableLabel]}
              colorRange={[GROUP_COLORS.greenfield, UNSUITABLE_COLOR]}
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
