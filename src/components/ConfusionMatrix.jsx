import { useTranslation } from 'react-i18next'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export function ConfusionMatrix({ tp, fp, fn, tn, showSums = true }) {
  const { t } = useTranslation()

  const correctCellSx = {
    bgcolor: 'rgba(82, 150, 165, 0.12)',
    fontWeight: 600,
    textAlign: 'center',
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell
              align="center"
              dangerouslySetInnerHTML={{
                __html: t('common.predictionRepays').replace(': ', ':<br/>'),
              }}
            />
            <TableCell
              align="center"
              dangerouslySetInnerHTML={{
                __html: t('common.predictionNotRepays').replace(': ', ':<br/>'),
              }}
            />
            {showSums && <TableCell align="center">{t('common.sum')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              component="th"
              sx={{ fontWeight: 600, bgcolor: '#F5F7F8' }}
              dangerouslySetInnerHTML={{
                __html: t('common.dataRepays').replace(': ', ':<br/>'),
              }}
            />
            <TableCell align="center" sx={correctCellSx}>{tp}</TableCell>
            <TableCell align="center">{fn}</TableCell>
            {showSums && (
              <TableCell align="center" sx={{ fontWeight: 700 }}>{tp + fn}</TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell
              component="th"
              sx={{ fontWeight: 600, bgcolor: '#F5F7F8' }}
              dangerouslySetInnerHTML={{
                __html: t('common.dataNotRepays').replace(': ', ':<br/>'),
              }}
            />
            <TableCell align="center">{fp}</TableCell>
            <TableCell align="center" sx={correctCellSx}>{tn}</TableCell>
            {showSums && (
              <TableCell align="center" sx={{ fontWeight: 700 }}>{fp + tn}</TableCell>
            )}
          </TableRow>
          {showSums && (
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 600, bgcolor: '#F5F7F8' }}>
                {t('common.sum')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>{tp + fp}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>{fn + tn}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>{tp + fp + fn + tn}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
