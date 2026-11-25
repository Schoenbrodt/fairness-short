import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { DotPlot } from '../components/DotPlot'
import { TaskBox } from '../components/TaskBox'

export default function TwoPopulations() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.language
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
      <Typography variant="h4" gutterBottom>{t('twoPopulations.title')}</Typography>
      <Typography variant="h5" gutterBottom>{t('twoPopulations.subtitle')}</Typography>

      <Typography variant="body1" paragraph>{t('twoPopulations.intro1')}</Typography>

      <DotPlot
        data={displayData}
        colorScheme="Paired"
        yLabel={t('common.count')}
      />

      <Typography variant="body1" paragraph>{t('twoPopulations.intro2')}</Typography>
      <Typography variant="body1" paragraph>{t('twoPopulations.intro3')}</Typography>
      <Typography variant="body1" paragraph>{t('twoPopulations.intro4')}</Typography>

      <Box
        sx={{
          my: 2,
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95vw',
          maxWidth: 1000,
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.dark">
                  {t('data.pinkville')}
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
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.dark">
                  {t('data.greenfield')}
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
          </Grid>
        </Grid>
      </Box>

      <TaskBox label={t('common.task')} icon="pencil-alt">
        <ol type="a">
          <li>{t('twoPopulations.taskA')}</li>
          <li>{t('twoPopulations.taskB')}</li>
        </ol>
      </TaskBox>
    </Box>
  )
}
