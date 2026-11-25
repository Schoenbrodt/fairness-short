import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { loadCsv } from '../utils/loadData'
import { getDisplayData } from '../utils/translateData'
import { DotPlot } from '../components/DotPlot'
import { EditableTable } from '../components/EditableTable'
import { ValidateButton } from '../components/ValidateButton'
import { TaskBox } from '../components/TaskBox'

function SortableTable({ data, headers }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = useMemo(() => {
    if (!sortKey || !data) return data
    return [...data].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (typeof va === 'number') return sortAsc ? va - vb : vb - va
      return sortAsc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va))
    })
  }, [data, sortKey, sortAsc])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  if (!data || data.length === 0) return null

  const columns = ['name', 'type', 'score']

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350, my: 2 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>
                <TableSortLabel
                  active={sortKey === col}
                  direction={sortKey === col && !sortAsc ? 'desc' : 'asc'}
                  onClick={() => handleSort(col)}
                >
                  {headers[col]}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((row, i) => (
            <TableRow key={i} hover>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default function UnderstandingData() {
  const { t, i18n } = useTranslation()
  const [datasets, setDatasets] = useState({ d1: null, d2: null, d3: null })
  const tableRef = useRef(null)

  useEffect(() => {
    Promise.all([
      loadCsv('./data/random_user_1.csv'),
      loadCsv('./data/random_user_2.csv'),
      loadCsv('./data/random_user_3.csv'),
    ]).then(([d1, d2, d3]) => setDatasets({ d1, d2, d3 }))
  }, [])

  const lang = i18n.language
  const d1 = useMemo(() => (datasets.d1 ? getDisplayData(datasets.d1, lang) : null), [datasets.d1, lang])
  const d2 = useMemo(() => (datasets.d2 ? getDisplayData(datasets.d2, lang) : null), [datasets.d2, lang])
  const d3 = useMemo(() => (datasets.d3 ? getDisplayData(datasets.d3, lang) : null), [datasets.d3, lang])

  const tableHeaders = {
    name: t('histogram.headerName'),
    type: t('histogram.headerType'),
    score: t('histogram.headerScore'),
  }

  if (!d1 || !d2 || !d3) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const plotSets = [
    { datasets: [d1, d2, d3] },
    { datasets: [d1, d2, d3] },
    { datasets: [d1, d3, d2] },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('histogram.title')}</Typography>
      <Typography variant="body1" paragraph>{t('histogram.intro1')}</Typography>
      <Typography variant="body1" paragraph>{t('histogram.intro2')}</Typography>
      <Typography variant="body1" paragraph>{t('histogram.intro3')}</Typography>

      {[1, 2, 3].map((n) => {
        const tableData = n === 1 ? d1 : n === 2 ? d2 : d3
        const intro = n === 1 ? t('histogram.tableIntro') : t('histogram.tableIntroAnother')
        const taskText = t(`histogram.task${n}`)
        const plots = plotSets[n - 1].datasets

        return (
          <Box key={n}>
            <Typography variant="h5" gutterBottom>{t('histogram.dataset', { n })}</Typography>
            <Typography variant="body1" paragraph>{intro}</Typography>
            <SortableTable data={tableData} headers={tableHeaders} />

            <TaskBox label={`${t('common.task')} ${n}`}>
              {taskText}
            </TaskBox>

            <Grid container spacing={2} sx={{ my: 1, width: { sm: 'calc(100% + 300px)' }, maxWidth: '100vw', ml: { sm: '-150px' } }}>
              {['A', 'B', 'C'].map((letter, idx) => (
                <Grid key={letter} size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
                  <Card>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="h6" gutterBottom>
                        {t('histogram.option')} {letter}
                      </Typography>
                      <DotPlot
                        data={plots[idx]}
                        height={200}
                        fontSize={11}
                        colorScheme="Paired"
                        marginLeft={32}
                        marginBottom={32}
                        marginRight={12}
                        showLegend={false}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      })}

      <Typography variant="h5" gutterBottom>{t('histogram.checkAnswers')}</Typography>

      <EditableTable
        ref={tableRef}
        tableId="histogramTable"
        headers={['', t('histogram.correctOption')]}
        rows={[
          [{ isHeader: true, content: `${t('common.task')} 1` }, { editable: true, correct: 'A' }],
          [{ isHeader: true, content: `${t('common.task')} 2` }, { editable: true, correct: 'B' }],
          [{ isHeader: true, content: `${t('common.task')} 3` }, { editable: true, correct: 'B' }],
        ]}
      />

      <ValidateButton tableRef={tableRef} id="validateButton" />
    </Box>
  )
}
