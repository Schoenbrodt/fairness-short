import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { loadCsv } from '../utils/loadData'
import { getDisplayData, getOutcomeLabel } from '../utils/translateData'
import { GROUP_COLORS, UNSUITABLE_COLOR } from '../palette'
import { DotPlot } from '../components/DotPlot'
import { Notes, NotesActions } from '../components/Notes'
import { TaskBox } from '../components/TaskBox'

/**
 * Step 1: the framing (guiding question + decision rule) and the data
 * (both distributions and the two tasks). They share one page because the rule
 * is needed to read the data, and a separate cover page would be one screen of
 * navigation for five lines of text.
 */
export default function Data() {
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

  const suitableLabel = displayData ? getOutcomeLabel('suitable', lang) : ''
  const unsuitableLabel = displayData ? getOutcomeLabel('unsuitable', lang) : ''

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('intro.title')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('intro.lede')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('intro.p1')}
      </Typography>

      <Card variant="outlined" sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('intro.scoreTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('intro.scoreText')}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" paragraph>
        {t('intro.note')}
      </Typography>

      <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
        {t('twoPopulations.title')}
      </Typography>

      {!displayData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Typography variant="body1" paragraph>
            {t('twoPopulations.intro1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('twoPopulations.intro2')}
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, my: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('twoPopulations.knownOutcomesTitle')}
            </Typography>
            <Typography variant="body2">{t('twoPopulations.knownOutcomes')}</Typography>
          </Paper>

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
                <DotPlot
                  data={pinkvilleData}
                  height={220}
                  fontSize={13}
                  yLabel={t('twoPopulations.yAxis')}
                  colorDomain={[suitableLabel, unsuitableLabel]}
                  colorRange={[GROUP_COLORS.pinkville, UNSUITABLE_COLOR]}
                  yDomain={[0, 10]}
                  marginTop={34}
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
                <DotPlot
                  data={greenfieldData}
                  height={220}
                  fontSize={13}
                  yLabel={t('twoPopulations.yAxis')}
                  colorDomain={[suitableLabel, unsuitableLabel]}
                  colorRange={[GROUP_COLORS.greenfield, UNSUITABLE_COLOR]}
                  yDomain={[0, 10]}
                  marginTop={34}
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
        </>
      )}
    </Box>
  )
}
