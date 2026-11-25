import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { DotPlot } from '../components/DotPlot'
import { EditableTable } from '../components/EditableTable'
import { ValidateButton } from '../components/ValidateButton'
import { ThresholdSlider } from '../components/ThresholdSlider'
import { TaskBox } from '../components/TaskBox'

export default function Dataset() {
  const { t, i18n } = useTranslation()
  const [rawData, setRawData] = useState(null)
  const [threshold, setThreshold] = useState(50)
  const tableRef1 = useRef(null)
  const tableRef2 = useRef(null)

  useEffect(() => {
    loadCsv('./data/distribution.csv').then(setRawData)
  }, [])

  const lang = i18n.language
  const displayData = useMemo(
    () => (rawData ? getDisplayData(rawData, lang) : null),
    [rawData, lang]
  )

  const stats = useMemo(() => {
    if (!rawData) return null
    const repayCount = rawData.filter((d) => d.type === 'Zahlt zurück').length
    const noRepayCount = rawData.filter((d) => d.type === 'Zahlt nicht zurück').length
    const nonPayingScores = rawData.filter((d) => d.type === 'Zahlt nicht zurück').map((d) => d.score)
    const payingScores = rawData.filter((d) => d.type === 'Zahlt zurück').map((d) => d.score)
    const maxNonPayingScore = Math.max(...nonPayingScores)
    const minPayingScore = Math.min(...payingScores)
    return {
      total: rawData.length,
      repayCount,
      noRepayCount,
      threshold1: maxNonPayingScore + 1,
      threshold2: minPayingScore,
    }
  }, [rawData])

  if (!displayData || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const colorDomain = lang === 'de'
    ? ['Zahlt nicht zurück', 'Zahlt zurück']
    : ['Does not repay', 'Repays']

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('datasetPage.title')}</Typography>

      <Typography variant="body1" paragraph>
        {t('datasetPage.intro', {
          count: stats.total,
          repay: stats.repayCount,
          noRepay: stats.noRepayCount,
        })}
      </Typography>

      <ThresholdSlider value={threshold} onChange={setThreshold} name="threshold-dataset" />

      <DotPlot
        data={displayData}
        threshold={threshold}
        colorScheme="Paired"
        colorDomain={colorDomain}
        yLabel={t('common.count')}
      />

      <TaskBox label={`${t('common.task')} 1`}>
        <span dangerouslySetInnerHTML={{ __html: t('datasetPage.task1') }} />
      </TaskBox>

      <EditableTable
        ref={tableRef1}
        tableId="aufgabe1"
        headers={[t('common.yourAnswer', { n: 1 })]}
        rows={[[{ editable: true, correct: Math.round(stats.threshold1) }]]}
      />
      <ValidateButton tableRef={tableRef1} id="validateButton1" />

      <TaskBox label={`${t('common.task')} 2`}>
        <span dangerouslySetInnerHTML={{ __html: t('datasetPage.task2') }} />
      </TaskBox>

      <EditableTable
        ref={tableRef2}
        tableId="aufgabe2"
        headers={[t('common.yourAnswer', { n: 2 })]}
        rows={[[{ editable: true, correct: Math.round(stats.threshold2) }]]}
      />
      <ValidateButton tableRef={tableRef2} id="validateButton2" />

      <TaskBox label={`${t('common.task')} 3`} icon="pencil-alt">
        {t('datasetPage.task3')}
      </TaskBox>
    </Box>
  )
}
