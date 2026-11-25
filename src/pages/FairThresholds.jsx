import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { calculateMetrics, findThresholdForMetric } from '../utils/calculateMetrics'
import { DotPlot } from '../components/DotPlot'
import { ConfusionMatrix } from '../components/ConfusionMatrix'
import { MetricsTable } from '../components/MetricsTable'
import { ThresholdSlider } from '../components/ThresholdSlider'
import { FairnessRadio } from '../components/FairnessRadio'
import { TaskBox } from '../components/TaskBox'

export default function FairThresholds() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)
  const [strategy, setStrategy] = useState('independent')
  const [thresholdPink, setThresholdPink] = useState(70)
  const [thresholdGreenManual, setThresholdGreenManual] = useState(70)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.language
  const displayData = useMemo(
    () => (rawData ? getDisplayData(rawData, lang) : null),
    [rawData, lang]
  )

  const metricsPink = useMemo(() => {
    if (!rawData) return null
    return calculateMetrics(rawData, 'Alt', thresholdPink)
  }, [rawData, thresholdPink])

  const thresholdGreen = useMemo(() => {
    if (!rawData || !metricsPink) return thresholdGreenManual
    if (strategy === 'sameThresholds') return thresholdPink
    if (strategy === 'sameTruePositiveRates') {
      return findThresholdForMetric(rawData, 'Jung', 'true_positive_rate', metricsPink.true_positive_rate)
    }
    if (strategy === 'samePositiveRates') {
      return findThresholdForMetric(rawData, 'Jung', 'positive_rate', metricsPink.positive_rate)
    }
    return thresholdGreenManual
  }, [rawData, metricsPink, strategy, thresholdPink, thresholdGreenManual])

  const metricsGreen = useMemo(() => {
    if (!rawData) return null
    return calculateMetrics(rawData, 'Jung', thresholdGreen)
  }, [rawData, thresholdGreen])

  const handleGreenChange = (val) => {
    if (strategy === 'independent') setThresholdGreenManual(val)
  }

  if (!displayData || !metricsPink || !metricsGreen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const pinkvilleDisplay = displayData.filter((d) => d.age === (lang === 'de' ? 'Alt' : 'Old'))
  const greenfieldDisplay = displayData.filter((d) => d.age === (lang === 'de' ? 'Jung' : 'Young'))
  const notRepaysLabel = lang === 'de' ? 'Zahlt nicht zurück' : 'Does not repay'
  const repaysLabel = lang === 'de' ? 'Zahlt zurück' : 'Repays'
  const totalProfit = metricsPink.gewinn + metricsGreen.gewinn
  const isLinked = strategy !== 'independent'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('fairThresholds.title')}</Typography>

      <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: t('fairThresholds.intro') }} />
      <Typography variant="body1" paragraph>{t('fairThresholds.tryThresholds')}</Typography>

      <TaskBox label={t('fairThresholds.task1Label')} icon="comments">
        {t('fairThresholds.task1')}
      </TaskBox>

      <TaskBox label={`${t('common.task')} 2`} icon="pencil-alt">
        {t('fairThresholds.task2')}
      </TaskBox>

      <TaskBox label={t('fairThresholds.task3Label')} icon="pencil-alt">
        <ol type="a">
          <li>{t('fairThresholds.task3a')}</li>
          <li>{t('fairThresholds.task3b')}</li>
          <li>{t('fairThresholds.task3c')}</li>
        </ol>
      </TaskBox>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2.5,
          my: 2,
          width: { md: 'calc(100% + 500px)' },
          maxWidth: '100vw',
          ml: { md: '-250px' },
        }}
      >
        <Card sx={{ borderTop: '3px solid #6a3d9a', flex: { md: '1 1 0' }, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#6a3d9a' }}>
              {t('fairThresholds.thresholdPinkville')}
            </Typography>
            <ThresholdSlider value={thresholdPink} onChange={setThresholdPink} min={10} max={100} name="threshold-pinkville" />
            <DotPlot
              data={pinkvilleDisplay}
              threshold={thresholdPink}
              height={200}
              fontSize={13}
              xDomain={[10, 99]}
              yDomain={[0, 10]}
              yLabel={t('common.count')}
              colorDomain={[notRepaysLabel, repaysLabel]}
              colorRange={['#cab2d6', '#6a3d9a']}
              marginLeft={40}
            />
            <ConfusionMatrix
              tp={metricsPink.n_true_positive}
              fp={metricsPink.n_false_positive}
              fn={metricsPink.n_false_negative}
              tn={metricsPink.n_true_negative}
              showSums={false}
            />
            <MetricsTable
              accuracy={metricsPink.accuracy}
              positiveRate={metricsPink.positive_rate}
              truePositiveRate={metricsPink.true_positive_rate}
              profit={metricsPink.gewinn}
            />
          </CardContent>
        </Card>

        <Card sx={{ borderTop: '3px solid #33a02c', flex: { md: '1 1 0' }, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#33a02c' }}>
              {t('fairThresholds.thresholdGreenfield')}
            </Typography>
            <ThresholdSlider value={thresholdGreen} onChange={handleGreenChange} min={10} max={100} disabled={isLinked} name="threshold-greenfield" />
            <DotPlot
              data={greenfieldDisplay}
              threshold={thresholdGreen}
              height={200}
              fontSize={13}
              xDomain={[10, 99]}
              yDomain={[0, 10]}
              yLabel={t('common.count')}
              colorDomain={[notRepaysLabel, repaysLabel]}
              colorRange={['#b2df8a', '#33a02c']}
              marginLeft={40}
            />
            <ConfusionMatrix
              tp={metricsGreen.n_true_positive}
              fp={metricsGreen.n_false_positive}
              fn={metricsGreen.n_false_negative}
              tn={metricsGreen.n_true_negative}
              showSums={false}
            />
            <MetricsTable
              accuracy={metricsGreen.accuracy}
              positiveRate={metricsGreen.positive_rate}
              truePositiveRate={metricsGreen.true_positive_rate}
              profit={metricsGreen.gewinn}
            />
          </CardContent>
        </Card>

        <Card sx={{ width: { md: 280 }, flexShrink: { md: 0 }, alignSelf: { md: 'flex-start' } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FairnessRadio value={strategy} onChange={setStrategy} />
            <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('fairThresholds.totalProfit', { profit: totalProfit })}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
