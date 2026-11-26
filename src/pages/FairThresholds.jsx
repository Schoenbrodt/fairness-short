import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { loadCsv } from '../utils/loadData'
import { getDisplayData, getOutcomeLabel } from '../utils/translateData'
import { calculateMetrics, findThresholdForMetric } from '../utils/calculateMetrics'
import { formatPercent } from '../utils/format'
import { DotPlot } from '../components/DotPlot'
import { ConfusionMatrix } from '../components/ConfusionMatrix'
import { FairnessRadio } from '../components/FairnessRadio'
import { Notes, NotesActions } from '../components/Notes'
import { TaskBox } from '../components/TaskBox'
import { ThresholdSlider } from '../components/ThresholdSlider'

const metricDefinitions = [
  'measures.defPositiveRate',
  'measures.defTruePositiveRate',
  'measures.defFalseHires',
]

function GroupMetrics({ metrics, lang }) {
  const { t } = useTranslation()

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {t('common.positiveRate')}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {formatPercent(metrics.positiveRate, lang)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {t('common.truePositiveRate')}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {formatPercent(metrics.truePositiveRate, lang)}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{ mt: 1.5, color: metrics.fp > 0 ? 'error.main' : 'text.secondary' }}
      >
        {t('common.falseHires')}: <strong>{metrics.fp}</strong>
      </Typography>
    </Box>
  )
}

export default function FairThresholds() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)
  const [strategy, setStrategy] = useState('independent')
  const [thresholdPink, setThresholdPink] = useState(70)
  const [thresholdGreenManual, setThresholdGreenManual] = useState(70)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.resolvedLanguage
  const displayData = useMemo(
    () => (rawData ? getDisplayData(rawData, lang) : null),
    [rawData, lang]
  )

  const metricsPink = useMemo(() => {
    if (!rawData) return null
    return calculateMetrics(rawData, 'pinkville', thresholdPink)
  }, [rawData, thresholdPink])

  const greenLink = useMemo(() => {
    if (!rawData || !metricsPink) return { threshold: thresholdGreenManual, exact: true }
    if (strategy === 'sameThresholds') return { threshold: thresholdPink, exact: true }
    if (strategy === 'sameTruePositiveRates') {
      return findThresholdForMetric(
        rawData,
        'greenfield',
        'truePositiveRate',
        metricsPink.truePositiveRate,
        { reference: thresholdPink }
      )
    }
    if (strategy === 'samePositiveRates') {
      return findThresholdForMetric(
        rawData,
        'greenfield',
        'positiveRate',
        metricsPink.positiveRate,
        { reference: thresholdPink }
      )
    }
    return { threshold: thresholdGreenManual, exact: true }
  }, [rawData, metricsPink, strategy, thresholdPink, thresholdGreenManual])

  const thresholdGreen = greenLink.threshold

  const metricsGreen = useMemo(() => {
    if (!rawData) return null
    return calculateMetrics(rawData, 'greenfield', thresholdGreen)
  }, [rawData, thresholdGreen])

  const handleGreenChange = (val) => {
    if (strategy === 'independent') setThresholdGreenManual(val)
  }

  const reset = () => {
    setStrategy('independent')
    setThresholdPink(70)
    setThresholdGreenManual(70)
  }

  if (!displayData || !metricsPink || !metricsGreen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const pinkvilleDisplay = displayData.filter((d) => d.group === 'pinkville')
  const greenfieldDisplay = displayData.filter((d) => d.group === 'greenfield')
  const unsuitableLabel = getOutcomeLabel('unsuitable', lang)
  const suitableLabel = getOutcomeLabel('suitable', lang)
  const isLinked = strategy !== 'independent'
  const showApproximation =
    (strategy === 'samePositiveRates' || strategy === 'sameTruePositiveRates') && !greenLink.exact

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('fairThresholds.title')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('fairThresholds.lede')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('fairThresholds.intro')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('fairThresholds.ruleTitle')}
        </Typography>
        <Typography variant="body2">{t('fairThresholds.ruleText')}</Typography>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
          my: 2,
        }}
      >
        <Card sx={{ borderTop: '3px solid #6a3d9a', minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a3d9a' }}>
              {t('fairThresholds.thresholdPinkville')}
            </Typography>
            <ThresholdSlider value={thresholdPink} onChange={setThresholdPink} min={10} max={100} />
            <DotPlot
              data={pinkvilleDisplay}
              threshold={thresholdPink}
              height={200}
              fontSize={13}
              xDomain={[10, 99]}
              yDomain={[0, 10]}
              colorDomain={[unsuitableLabel, suitableLabel]}
              colorRange={['#cab2d6', '#6a3d9a']}
              marginLeft={40}
            />
            <GroupMetrics metrics={metricsPink} lang={lang} />
          </CardContent>
        </Card>

        <Card sx={{ borderTop: '3px solid #33a02c', minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#33a02c' }}>
              {t('fairThresholds.thresholdGreenfield')}
            </Typography>
            <ThresholdSlider
              value={thresholdGreen}
              onChange={handleGreenChange}
              min={10}
              max={100}
              disabled={isLinked}
            />
            <DotPlot
              data={greenfieldDisplay}
              threshold={thresholdGreen}
              height={200}
              fontSize={13}
              xDomain={[10, 99]}
              yDomain={[0, 10]}
              colorDomain={[unsuitableLabel, suitableLabel]}
              colorRange={['#b2df8a', '#33a02c']}
              marginLeft={40}
            />
            <GroupMetrics metrics={metricsGreen} lang={lang} />
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          alignItems: 'start',
          gap: 2.5,
          my: 2,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('fairThresholds.measuresTitle')}
          </Typography>
          <Typography variant="body2" paragraph>
            {t('fairThresholds.measuresIntro')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 1.5,
            }}
          >
            {metricDefinitions.map((key) => (
              <Typography
                key={key}
                variant="body2"
                dangerouslySetInnerHTML={{ __html: t(key) }}
              />
            ))}
          </Box>
        </Paper>

        <Card variant="outlined" sx={{ minWidth: 0 }}>
          <CardContent>
            <FairnessRadio
              value={strategy}
              onChange={setStrategy}
              label={t('fairThresholds.strategyQuestion')}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('fairThresholds.strategyHint')}
            </Typography>
            {showApproximation && (
              <Alert severity="info" sx={{ mt: 1.5 }}>
                {t('fairThresholds.approximateHint')}
              </Alert>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" size="small" onClick={reset}>
                {t('fairThresholds.reset')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Accordion sx={{ my: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>
            {t('fairThresholds.detailsTitle')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('fairThresholds.confusionHint')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#6a3d9a' }}>
                {t('fairThresholds.thresholdPinkville')}
              </Typography>
              <Typography variant="body2">
                {t('common.accuracy')}: {formatPercent(metricsPink.accuracy, lang)}
              </Typography>
              <ConfusionMatrix
                tp={metricsPink.tp}
                fp={metricsPink.fp}
                fn={metricsPink.fn}
                tn={metricsPink.tn}
                showSums={false}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#33a02c' }}>
                {t('fairThresholds.thresholdGreenfield')}
              </Typography>
              <Typography variant="body2">
                {t('common.accuracy')}: {formatPercent(metricsGreen.accuracy, lang)}
              </Typography>
              <ConfusionMatrix
                tp={metricsGreen.tp}
                fp={metricsGreen.fp}
                fn={metricsGreen.fn}
                tn={metricsGreen.tn}
                showSums={false}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Typography variant="h5" sx={{ mt: 4 }}>
        {t('common.tasks')}
      </Typography>
      <NotesActions />

      <TaskBox label={t('fairThresholds.task1Label')} icon="comments">
        <Typography variant="body2" paragraph>
          {t('fairThresholds.task1')}
        </Typography>
        <Notes id="thresholds-1" />
      </TaskBox>

      <TaskBox label={t('fairThresholds.task2Label')} icon="pencil-alt">
        <Typography variant="body2" paragraph>
          {t('fairThresholds.task2')}
        </Typography>
        <Notes id="thresholds-2" />
      </TaskBox>

      <TaskBox label={t('fairThresholds.task3Label')} icon="pencil-alt">
        <Typography variant="body2" paragraph>
          {t('fairThresholds.task3')}
        </Typography>
        <Notes id="thresholds-3" />
      </TaskBox>
    </Box>
  )
}
