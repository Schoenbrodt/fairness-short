import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { calculateMetrics } from '../utils/calculateMetrics'
import { DotPlot } from '../components/DotPlot'
import { ConfusionMatrix } from '../components/ConfusionMatrix'
import { EditableTable } from '../components/EditableTable'
import { ValidateButton } from '../components/ValidateButton'
import { TaskBox } from '../components/TaskBox'

const FIXED_THRESHOLD = 70

export default function StatisticalMeasures() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)
  const tableRef1 = useRef(null)
  const tableRef2 = useRef(null)
  const tableRef3 = useRef(null)
  const tableRef4 = useRef(null)
  const tableRef5 = useRef(null)

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
    return calculateMetrics(rawData, '', FIXED_THRESHOLD)
  }, [rawData])

  if (!displayData || !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const { n_true_positive, n_false_positive, n_false_negative, n_true_negative } = metrics
  const totalCreditReceived = n_true_positive + n_false_positive
  const totalPersons = metrics.total
  const percentCapablePaying = Math.round(
    (n_true_positive / (n_true_positive + n_false_negative)) * 100
  )
  const percentTotalCredit = Math.round((totalCreditReceived / totalPersons) * 100)
  const profit = 300 * n_true_positive - 700 * n_false_positive

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('measures.title')}</Typography>
      <Typography variant="h5" gutterBottom>{t('measures.subtitle')}</Typography>

      <Typography variant="body1" paragraph>{t('measures.intro1')}</Typography>
      <Typography variant="body1" paragraph>{t('measures.intro2')}</Typography>
      <Typography variant="body1" paragraph>{t('measures.intro3')}</Typography>
      <Typography variant="body1" paragraph>{t('measures.reminder')}</Typography>

      <DotPlot
        data={displayData}
        threshold={FIXED_THRESHOLD}
        colorScheme="Paired"
        yLabel={t('common.count')}
      />

      <Typography variant="h5" gutterBottom>{t('measures.confusionTitle')}</Typography>
      <Typography variant="body1" paragraph>{t('measures.confusionIntro')}</Typography>

      <ConfusionMatrix
        tp={n_true_positive}
        fp={n_false_positive}
        fn={n_false_negative}
        tn={n_true_negative}
      />

      <TaskBox label={`${t('common.task')} 1`}>
        {t('measures.task1')}
      </TaskBox>
      <EditableTable
        ref={tableRef1}
        tableId="aufgabe1"
        headers={[t('common.yourAnswer', { n: 1 })]}
        rows={[[{ editable: true, correct: totalCreditReceived }]]}
      />
      <ValidateButton tableRef={tableRef1} id="validateButton1" />

      <TaskBox label={`${t('common.task')} 2`}>
        {t('measures.task2')}
      </TaskBox>
      <EditableTable
        ref={tableRef2}
        tableId="aufgabe2"
        headers={[t('common.yourAnswer', { n: 2 })]}
        rows={[[{ editable: true, correct: n_false_positive }]]}
      />
      <ValidateButton tableRef={tableRef2} id="validateButton2" />

      <Typography variant="h5" gutterBottom>{t('measures.evaluationTitle')}</Typography>
      <Typography variant="body1" paragraph>{t('measures.evaluationIntro')}</Typography>
      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <li><Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('measures.defAccuracy') }} /></li>
        <li><Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('measures.defPositiveRate') }} /></li>
        <li><Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('measures.defTruePositiveRate') }} /></li>
        <li><Typography variant="body1" dangerouslySetInnerHTML={{ __html: t('measures.defProfit') }} /></li>
      </Box>

      <TaskBox label={`${t('common.task')} 3`}>
        {t('measures.task3')}
      </TaskBox>
      <EditableTable
        ref={tableRef3}
        tableId="aufgabe3"
        headers={[
          t('common.accuracy'),
          t('common.positiveRate'),
          t('common.truePositiveRate'),
          t('common.profit'),
        ]}
        rows={[
          [
            { editable: true, correct: metrics.accuracy },
            { editable: true, correct: metrics.positive_rate },
            { editable: true, correct: metrics.true_positive_rate },
            { editable: true, correct: profit },
          ],
        ]}
      />
      <ValidateButton tableRef={tableRef3} id="validateButton3" />

      <TaskBox label={`${t('common.task')} 4`}>
        {t('measures.task4')}
      </TaskBox>
      <EditableTable
        ref={tableRef4}
        tableId="aufgabe4"
        headers={[t('common.yourAnswer', { n: 4 })]}
        rows={[[{ editable: true, correct: percentCapablePaying }]]}
      />
      <ValidateButton tableRef={tableRef4} id="validateButton4" />

      <TaskBox label={`${t('common.task')} 5`}>
        {t('measures.task5')}
      </TaskBox>
      <EditableTable
        ref={tableRef5}
        tableId="aufgabe5"
        headers={[t('common.yourAnswer', { n: 5 })]}
        rows={[[{ editable: true, correct: percentTotalCredit }]]}
      />
      <ValidateButton tableRef={tableRef5} id="validateButton5" />
    </Box>
  )
}
