import { map, max, extent, range, group } from 'd3-array'
import * as d3 from 'd3'
import { axisLeft, axisBottom } from 'd3-axis'
import dayjs from 'dayjs'
import { scaleLinear, scaleUtc } from 'd3-scale'
import { utcFormat } from 'd3-time-format'
import { select, selectAll } from 'd3-selection'
import { area, line } from 'd3-shape'
function removeAllChildren(container) {
  container = select(container)
  let parent = container
  if (typeof container.node === 'function') {
    parent = container.node()
  }
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild)
  }
}

export const makeChart = (
  container,
  data,
  {
    yLabel = '历史数据',
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 12,
    unit = max(map(data.datas, d => {
      console.log(d);
      return String(d).length + 20
    })),
    width = document.body.clientWidth,
    height = document.body.clientHeight,
    xRange = [
      marginLeft + marginRight + unit + 5,
      width - marginLeft - marginRight,
    ],
    labelFontSize = 24,
    yRange = [height - marginTop - marginBottom, labelFontSize],
    Y = map(data.datas, i => i),
    X = map(data.time_keys, i => dayjs(i)),
    I = range(X.length),
    xDomain = extent(X),
    yDomain = extent(Y),
    xScale = scaleUtc(xDomain, xRange),
    yScale = scaleLinear(yDomain, yRange),
    fontSize = 12,
    xAxis = axisBottom(xScale)
      .ticks(width / 300, utcFormat('%Y/%m/%d %H:%M'))
      .tickSizeOuter(0),
    yAxis = axisLeft(yScale)
  } = {}
) => {
  function nearestData(data, x, px) {
    let index = -1
    let distance = -1
    for (let i = 0; i < data.length; i++) {
      const pt = x(X[i])
      const dis = Math.abs(px - pt)
      if (dis > distance && distance > -1) {
        break
      }
      index = i
      distance = dis
    }
    return index
  }
  console.log(yDomain);
  removeAllChildren(container)
  const svg = select(container)
    .attr('width', width)
    .attr('height', height)
    .attr(
      'style',
      'max-width: 100%; height: auto; height: intrinsic;background: #111E44;'
    )

  const tooltip = select('#line')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('display', 'none')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')

  const creatXAxis = () => {
    svg
      .append('g')
      .call(xAxis)
      .attr(
        'transform',
        `translate(0,${height - marginTop - marginBottom + labelFontSize})`
      )
      .style('font-size', fontSize)
      .style('color', '#243753')
      .selectAll('text')
      .style('color', '#7BC2F9')
  }

  const creatyLabel = g => {
    g.append('text')
      .attr('x', `${yLabel.length - 1}em`)
      .attr('y', '.5rem')
      .attr('fill', 'currentColor')
      .attr('font-size', labelFontSize)
      .attr('text-anchor', 'end')
      .text(yLabel)
  }

  const creatYAxis = () => {
    svg
      .append('g')
      .call(yAxis)
      .attr(
        'transform',
        `translate(${marginLeft + marginRight + unit + 5},${labelFontSize})`
      )
      // 左上角标签
      .call(creatyLabel)
      .style('font-size', fontSize)
      .style('color', '#243753')
      .selectAll('text')
      .style('color', '#7BC2F9')
  }

  // 渐变色
  const fillGradient = (id, colors, x1 = 0, x2 = 0, y1 = 0, y2 = 100) => {
    // 淡蓝色
    svg
      .append('linearGradient')
      .attr('id', id)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', `${x1}%`)
      .attr('x2', `${x2}%`)
      .attr('y1', `${y1}%`)
      .attr('y2', `${y2}%`)
      .selectAll('stop')
      .data(
        colors.map((color, i) => ({
          offset: `${(i / (colors.length - 1)) * 100}%`,
          color,
        }))
      )
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
  }

  // 填充数据
  const pushData = () => {
    const D = map(data.datas, (d, i) => Y[i])
    const areaPath = area()
      .defined(i => D[i])
      .x(d => xScale(X[d]))
      .y1(d => yScale(Y[d]))
      .y0(yRange[0])

    const linePath = line()
      .defined(i => D[i])
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]))

    svg
      .append('path')
      .attr('d', areaPath(I))
      .attr('stroke-width', 2)
      .attr('stroke', 'none')
      .attr('class', 'area')
      .attr('style', `fill: url(#area-gradient);`)
      .attr('transform', `translate(0,${labelFontSize - 5})`)

    svg
      .append('path')
      .attr('d', linePath(I))
      .attr('fill', 'none')
      .attr('stroke', '#2EA3DF')
      .attr('stroke-width', '5')
      .attr('transform', `translate(0,${labelFontSize - 5})`)
  }

  //圆环
  const dot = () => {
    svg
      .append('g')
      .selectAll('circle')
      .data(group(I, i => i))
      .join('g')
      .call(g =>
        g
          .append('line')
          .attr('id', i => `line-${i[0]}`)
          .attr('class', `lines`)
          .attr('x1', i => xScale(X[i[0]]))
          .attr('y1', marginTop + labelFontSize)
          .attr('x2', i => xScale(X[i[0]]))
          .attr('y2', `${height - marginTop - marginBottom + labelFontSize}`)
          .attr('stroke-width', 2)
          .attr('stroke', 'url(#white-gradient)')
          .attr('visibility', 'hidden')
      )
      .selectAll('circle')
      .data(([, I]) => I)
      .join('circle')
      .attr('id', i => `dot-${i}`)
      .attr('r', 5)
      .attr('x', i => xScale(X[i]))
      .attr('y', i => yScale(Y[i]))
      .attr('fill', '#Fff')
      .attr('transform', i => {
        return (
          'translate(' + xScale(X[i]) + ',' + (yScale(Y[i] || 0) + 24 - 5) + ')'
        )
      })
  }

  const svgEvent = () => {
    svg
      .on('mousemove', function (e) {
        const mouse = d3.pointer(e, this)
        const index = nearestData(data.time_keys, xScale, mouse[0])
        const pointer = {
          x: 0,
          y: 0,
        }
        selectAll('circle').attr('r', 5).attr('fill', '#Fff')
        selectAll('.lines').attr('visibility', 'hidden')
        select(`#dot-${index}`).attr('r', 10)
        select(`#line-${index}`).attr('visibility', 'visible')
        const { width: boxWidth, height: boxHeight } = tooltip
          .node()
          .getBoundingClientRect()
        if (e.pageX + boxWidth + 50 > width) pointer.x = e.pageX - boxWidth - 40
        else pointer.x = e.pageX
        if (e.pageY + boxHeight + 50 > height)
          pointer.y = e.pageY - boxHeight - 40
        else pointer.y = e.pageY
        tooltip
          .html(
            `<div>
            <p>名称：${data.name}</p>
            <p>数值：${data.datas[index]}</p>
            <p>时间：${data.time_keys[index]}</p>
          </div>`
          )
          .style('top', pointer.y + 25 + 'px')
          .style('left', pointer.x + 25 + 'px')
          .style('display', 'inline')
      })
      .on('mouseleave', function () {
        selectAll('circle').attr('r', 5).attr('fill', '#Fff')
        selectAll('.lines').attr('visibility', 'hidden')
        tooltip.style('display', 'none')
      })
  }
  fillGradient('white-gradient', ['#ffffff2b', '#ffffff', '#ffffff2b'])
  fillGradient('area-gradient', ['rgba(88,255,255,0.2)', 'rgba(88,255,255,0)'])
  pushData()
  creatXAxis()
  creatYAxis()
  dot()
  svgEvent()
}
