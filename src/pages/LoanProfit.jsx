import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EditableTable } from '../components/EditableTable'
import { ValidateButton } from '../components/ValidateButton'
import { TaskBox } from '../components/TaskBox'

const TOTAL_CREDIT = 1000
const INTEREST_RATE = 0.3
const LOSS = 700
const NUM_PEOPLE_PAYBACK = 250
const NUM_PEOPLE_NO_PAYBACK = 80

export default function LoanProfit() {
  const { t } = useTranslation()
  const tableRef = useRef(null)

  const profitPayback = TOTAL_CREDIT * INTEREST_RATE
  const totalProfit =
    NUM_PEOPLE_PAYBACK * profitPayback - NUM_PEOPLE_NO_PAYBACK * LOSS

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('loanProfit.title')}
      </Typography>

      <Typography variant="body1" paragraph>
        {t('loanProfit.situationIntro', { totalCredit: TOTAL_CREDIT })}
      </Typography>

      <Box component="ul" sx={{ pl: 3, mb: 2 }}>
        <li>
          <Typography variant="body1">
            {t('loanProfit.pointPayback', {
              interestPercent: 100 * INTEREST_RATE,
              totalReturn: TOTAL_CREDIT + TOTAL_CREDIT * INTEREST_RATE,
            })}
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            {t('loanProfit.pointLoss', { loss: LOSS })}
          </Typography>
        </li>
      </Box>

      <TaskBox label={t('common.task')}>
        {t('loanProfit.taskFill')}
      </TaskBox>

      <EditableTable
        ref={tableRef}
        tableId="creditTable"
        headers={[t('loanProfit.headerDescription'), t('loanProfit.headerAmount')]}
        rows={[
          [
            { isHeader: true, content: t('loanProfit.rowProfit') },
            { editable: true, correct: profitPayback },
          ],
          [
            { isHeader: true, content: t('loanProfit.rowLoss') },
            { editable: true, correct: LOSS },
          ],
          [
            {
              isHeader: true,
              content: t('loanProfit.rowTotal', {
                payback: NUM_PEOPLE_PAYBACK,
                noPayback: NUM_PEOPLE_NO_PAYBACK,
              }),
            },
            { editable: true, correct: totalProfit },
          ],
        ]}
      />

      <ValidateButton tableRef={tableRef} id="validateButton" />
    </Box>
  )
}
