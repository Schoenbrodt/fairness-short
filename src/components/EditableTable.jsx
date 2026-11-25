import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import confetti from 'canvas-confetti'
import { useEventLog } from '../events'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const editableSx = {
  bgcolor: '#F0F7FF',
  border: '2px solid',
  borderColor: 'primary.light',
  cursor: 'text',
  textAlign: 'center',
  minWidth: 60,
  '&:focus': {
    outline: 'none',
    borderColor: 'primary.main',
    boxShadow: '0 0 0 2px rgba(82,150,165,0.2)',
  },
}

export const EditableTable = forwardRef(function EditableTable(
  { headers, rows, tableId },
  ref
) {
  const tableRef = useRef(null)
  const log = useEventLog()

  const validate = useCallback(() => {
    if (!tableRef.current) return false
    const cells = tableRef.current.querySelectorAll('td[contenteditable="true"]')
    let allCorrect = true
    let correctCount = 0

    cells.forEach((cell) => {
      const correctValue = cell.getAttribute('data-correct').trim()
      const userValue = cell.textContent.trim()

      const isNumeric = !isNaN(parseInt(correctValue))
      let isCorrect

      if (isNumeric) {
        isCorrect = parseInt(userValue) === parseInt(correctValue)
      } else {
        isCorrect = userValue === correctValue
      }

      if (!userValue) {
        cell.style.backgroundColor = '#FFEBEE'
        cell.style.borderColor = '#EF9A9A'
        allCorrect = false
      } else if (isCorrect) {
        cell.style.backgroundColor = '#E8F5E9'
        cell.style.borderColor = '#81C784'
        correctCount++
      } else {
        cell.style.backgroundColor = '#FFEBEE'
        cell.style.borderColor = '#EF9A9A'
        allCorrect = false
      }
    })

    log?.('validated', `editable-table-${tableId}`, {
      allCorrect,
      correct: correctCount,
      total: cells.length,
    })

    if (allCorrect) {
      confetti()
    }
    return allCorrect
  }, [tableId, log])

  useImperativeHandle(ref, () => ({ validate }))

  const handleKeyPress = useCallback((e) => {
    const cell = e.target
    const correctValue = cell.getAttribute('data-correct')
    const isNumeric = !isNaN(parseInt(correctValue))
    if (isNumeric) {
      if (!(e.charCode >= 48 && e.charCode <= 57) && e.charCode !== 45) {
        e.preventDefault()
      }
    }
  }, [])

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table id={tableId} ref={tableRef} size="small">
        {headers && (
          <TableHead>
            <TableRow>
              {headers.map((h, i) => (
                <TableCell key={i}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {row.map((cell, cellIdx) => {
                if (cell.editable) {
                  return (
                    <TableCell
                      key={cellIdx}
                      contentEditable="true"
                      suppressContentEditableWarning
                      data-correct={String(cell.correct)}
                      onKeyPress={handleKeyPress}
                      sx={editableSx}
                    />
                  )
                }
                if (cell.isHeader) {
                  return (
                    <TableCell
                      key={cellIdx}
                      component="th"
                      sx={{ fontWeight: 600, bgcolor: '#F5F7F8' }}
                      dangerouslySetInnerHTML={{ __html: cell.content }}
                    />
                  )
                }
                return (
                  <TableCell key={cellIdx} align="center">
                    {cell.content}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
})
