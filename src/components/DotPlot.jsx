import { useEffect, useRef, useState } from 'react'
import * as Plot from '@observablehq/plot'
import Paper from '@mui/material/Paper'

export function DotPlot({
  data,
  threshold = null,
  width: widthProp,
  height = 220,
  fontSize = 14,
  xLabel = 'Score',
  yLabel = null,
  xDomain = [0, 99],
  yDomain = null,
  colorScheme = null,
  colorDomain = null,
  colorRange = null,
  fillField = 'type',
  showLegend = true,
  marginTop: marginTopProp,
  marginRight = 20,
  marginBottom = 38,
  marginLeft = 50,
}) {
  const containerRef = useRef(null)
  const [measuredWidth, setMeasuredWidth] = useState(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
        if (w > 0) setMeasuredWidth(w)
      }
    })
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const width = widthProp ?? measuredWidth ?? 300
  const marginTop = marginTopProp ?? (showLegend ? 6 : 12)

  useEffect(() => {
    if (!data || data.length === 0) return

    const marks = [
      Plot.gridY({
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
      }),
      Plot.dot(
        data,
        Plot.stackY2({
          x: 'score',
          fill: fillField,
          sort: { value: fillField, reverse: false },
          reverse: true,
          r: 4.5,
          fillOpacity:
            threshold != null ? (d) => (d.score < threshold ? 0.25 : 1) : 1,
        })
      ),
      Plot.ruleY([0]),
    ]

    if (threshold != null) {
      marks.push(
        Plot.ruleX([threshold - 0.5], {
          stroke: '#333',
          strokeWidth: 1.5,
        })
      )
    }

    const colorConfig = {}
    if (showLegend) colorConfig.legend = true
    if (colorScheme) colorConfig.scheme = colorScheme
    if (colorDomain) colorConfig.domain = colorDomain
    if (colorRange) colorConfig.range = colorRange

    const plotConfig = {
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      style: {
        fontSize: `${fontSize}px`,
        fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
        background: 'transparent',
      },
      x: {
        label: xLabel,
        domain: xDomain,
        labelAnchor: 'center',
        labelOffset: 32,
      },
      color: colorConfig,
      marks,
    }

    if (yLabel) {
      plotConfig.y = {
        label: yLabel,
        labelAnchor: 'top',
        labelOffset: 38,
      }
    }
    if (yDomain) {
      plotConfig.y = { ...(plotConfig.y || {}), domain: yDomain }
    }

    const plot = Plot.plot(plotConfig)

    const container = containerRef.current
    container.innerHTML = ''
    container.appendChild(plot)

    return () => {
      container.innerHTML = ''
    }
  }, [
    data,
    threshold,
    width,
    height,
    fontSize,
    xLabel,
    yLabel,
    xDomain,
    yDomain,
    colorScheme,
    colorDomain,
    colorRange,
    fillField,
    showLegend,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  ])

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        px: 2.5,
        my: 2,
        overflow: 'auto',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <div ref={containerRef} className="dot-plot-container" />
    </Paper>
  )
}
