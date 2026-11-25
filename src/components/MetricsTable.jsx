import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export function MetricsTable({ accuracy, positiveRate, truePositiveRate, profit }) {
  const { t } = useTranslation()

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">{t('common.accuracy')}</TableCell>
            <TableCell align="center">{t('common.positiveRate')}</TableCell>
            <TableCell align="center">{t('common.truePositiveRate')}</TableCell>
            <TableCell align="center">{t('common.profit')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">{accuracy}%</TableCell>
            <TableCell align="center">{positiveRate}%</TableCell>
            <TableCell align="center">{truePositiveRate}%</TableCell>
            <TableCell align="center">{profit}€</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
