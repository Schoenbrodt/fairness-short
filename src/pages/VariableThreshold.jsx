import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { calculateMetrics } from '../utils/calculateMetrics'
import { DotPlot } from '../components/DotPlot'
import { ConfusionMatrix } from '../components/ConfusionMatrix'
import { MetricsTable } from '../components/MetricsTable'
import { ThresholdSlider } from '../components/ThresholdSlider'
import { TaskBox } from '../components/TaskBox'

export default function VariableThreshold() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)
  const [threshold, setThreshold] = useState(50)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.language
  const displayData = useMemo(
    () => (rawData ? getDisplayData(rawData, lang) : null),
    [rawData, lang]
  )

  const metrics = useMemo(() => {
    if (!rawData) return null
    return calculateMetrics(rawData, '', threshold)
  }, [rawData, threshold])

  if (!displayData || !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('variableThreshold.title')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('variableThreshold.intro')}
      </Typography>

      <TaskBox label={t('common.task')} icon="pencil-alt">
        {t('variableThreshold.task')}
      </TaskBox>

      <Typography variant="body1" sx={{ mb: 1 }}>
        {t('common.decisionThreshold')}:
      </Typography>
      <ThresholdSlider value={threshold} onChange={setThreshold} name="threshold-variable" />

      <DotPlot
        data={displayData}
        threshold={threshold}
        colorScheme="Paired"
        yLabel={t('common.count')}
      />

      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
        {t('variableThreshold.predictionAt', { threshold })}
      </Typography>

      <ConfusionMatrix
        tp={metrics.n_true_positive}
        fp={metrics.n_false_positive}
        fn={metrics.n_false_negative}
        tn={metrics.n_true_negative}
      />

      <MetricsTable
        accuracy={metrics.accuracy}
        positiveRate={metrics.positive_rate}
        truePositiveRate={metrics.true_positive_rate}
        profit={metrics.gewinn}
      />
    </Box>
  )
}
