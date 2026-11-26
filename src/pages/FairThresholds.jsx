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
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { loadCsv } from '../utils/loadData'
import { getDisplayData, getOutcomeLabel } from '../utils/translateData'
import { calculateMetrics, findThresholdForMetric } from '../utils/calculateMetrics'
import { formatPercent } from '../utils/format'
import { GROUP_COLORS, UNSUITABLE_COLOR } from '../palette'
import { DotPlot } from '../components/DotPlot'
import { ConfusionMatrix } from '../components/ConfusionMatrix'
import { FairnessRadio } from '../components/FairnessRadio'
import { IconArray } from '../components/IconArray'
import { Notes, NotesActions } from '../components/Notes'
import { TaskBox } from '../components/TaskBox'
import { ThresholdSlider } from '../components/ThresholdSlider'

const metricDefinitions = [
  'measures.defPositiveRate',
  'measures.defTruePositiveRate',
  'measures.defAccuracy',
  'measures.defFalseHires',
]

function GroupMetrics({ metrics, lang }) {
  const { t } = useTranslation()

  const items = [
    { label: 'common.positiveRate', value: metrics.positiveRate },
    { label: 'common.truePositiveRate', value: metrics.truePositiveRate },
    { label: 'common.accuracy', value: metrics.accuracy },
  ]

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <Typography variant="caption" color="text.secondary">
              {t(item.label)}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {formatPercent(item.value, lang)}
            </Typography>
          </Box>
        ))}
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
  const [view, setView] = useState('icons')

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

  // One entry per group: the slider card and whichever view is active read from it.
  const groups = [
    {
      key: 'pinkville',
      label: t('data.pinkville'),
      sliderTitle: t('fairThresholds.thresholdPinkville'),
      color: GROUP_COLORS.pinkville,
      threshold: thresholdPink,
      onThresholdChange: setThresholdPink,
      sliderDisabled: false,
      metrics: metricsPink,
      rows: pinkvilleDisplay,
    },
    {
      key: 'greenfield',
      label: t('data.greenfield'),
      sliderTitle: t('fairThresholds.thresholdGreenfield'),
      color: GROUP_COLORS.greenfield,
      threshold: thresholdGreen,
      onThresholdChange: handleGreenChange,
      sliderDisabled: isLinked,
      metrics: metricsGreen,
      rows: greenfieldDisplay,
    },
  ]

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
        {groups.map((group) => (
          <Card key={group.key} sx={{ borderTop: `3px solid ${group.color}`, minWidth: 0 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: group.color }}>
                {group.sliderTitle}
              </Typography>
              <ThresholdSlider
                value={group.threshold}
                onChange={group.onThresholdChange}
                min={10}
                max={100}
                disabled={group.sliderDisabled}
              />
              <GroupMetrics metrics={group.metrics} lang={lang} />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: 2,
          rowGap: 1,
          mt: 4,
          mb: 1,
        }}
      >
        <Typography variant="h5" sx={{ mt: 0 }}>
          {view === 'icons' ? t('iconArray.title') : t('views.dotsTitle')}
        </Typography>
        <ToggleButtonGroup
          className="no-print"
          size="small"
          exclusive
          value={view}
          onChange={(_, next) => next && setView(next)}
          aria-label={t('views.label')}
        >
          <ToggleButton value="icons">{t('views.icons')}</ToggleButton>
          <ToggleButton value="dots">{t('views.dots')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {view === 'icons' ? t('iconArray.hint') : t('views.dotsHint')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
          mb: 2,
        }}
      >
        {groups.map((group) => (
          <Paper key={group.key} variant="outlined" sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: group.color, fontWeight: 700, mb: 1.5 }}
            >
              {group.label}
            </Typography>
            {view === 'icons' ? (
              <IconArray
                rows={group.rows}
                threshold={group.threshold}
                color={group.color}
                groupLabel={group.label}
              />
            ) : (
              <DotPlot
                data={group.rows}
                threshold={group.threshold}
                height={200}
                fontSize={13}
                xDomain={[10, 99]}
                yDomain={[0, 10]}
                colorDomain={[suitableLabel, unsuitableLabel]}
                colorRange={[group.color, UNSUITABLE_COLOR]}
                marginLeft={40}
              />
            )}
          </Paper>
        ))}
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
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
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
              <Typography variant="subtitle2" sx={{ color: GROUP_COLORS.pinkville }}>
                {t('data.pinkville')}
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
              <Typography variant="subtitle2" sx={{ color: GROUP_COLORS.greenfield }}>
                {t('data.greenfield')}
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
