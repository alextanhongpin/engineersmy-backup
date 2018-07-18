
const svg = d3.select('body').append('svg')

svg
.attr('width', 960)
.attr('height', 640)

const margin = {
  top: 45,
  right: 60,
  bottom: 45,
  left: 60
}

const width = svg.attr('width') - margin.left - margin.right
const height = svg.attr('height') - margin.top - margin.bottom

const x = d3.scaleBand().rangeRound([0, width]).padding(0.2)
const y = d3.scaleLinear().rangeRound([height, 0])

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

const data = [{'count': 30, 'label': 2008}, {'count': 73, 'label': 2009}, {'count': 172, 'label': 2010}, {'count': 305, 'label': 2011}, {'count': 434, 'label': 2012}, {'count': 621, 'label': 2013}, {'count': 845, 'label': 2014}, {'count': 960, 'label': 2015}, {'count': 929, 'label': 2016}, {'count': 420, 'label': 2017}]

x.domain(data.map((d) => d.label))
y.domain([0, d3.max(data, (d) => d.count)])

let timeout = null
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('text-align', 'center')
    .style('position', 'absolute')
    .style('opacity', 0)
    .style('background', 'rgba(0, 0, 0, .85)')
    .style('color', 'white')
    .style('max-width', '240px')
    .style('height', '30px')
    .style('font-size', '12px')
    .style('line-height', '30px')
    .style('margin-top', '-60px')
    .style('padding', '0 10px')
    .style('border-radius', '5px')

const xAxis = g.append('g')
.attr('class', 'axis is-x')
.attr('transform', `translate(0, ${height})`)
.call(d3.axisBottom(x))

// const xAxisLabel =
xAxis.append('text')
  .attr('fill', 'black')
  .attr('font-weight', 'bold')
  .attr('font-size', 16)
  .text('Year')
  .attr('x', width)
  .attr('y', 30)

const yAxis = g.append('g')
.attr('class', 'axis is-y')
.call(d3.axisLeft(y))

// const yAxisLabel =
yAxis.append('text')
  .text('Users')
  .attr('x', 0)
  .attr('y', -15)
  .attr('fill', 'black')
  .attr('font-weight', 'bold')
  .attr('font-size', 16)

g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
  .attr('class', 'bar')
  .attr('x', (d) => x(d.label))
  .attr('y', (d) => y(d.count))
  .attr('width', x.bandwidth())
  .attr('height', (d) => height - y(d.count))
  .attr('fill', '#326cf8')
  .on('mouseover', function (d) {
    d3.select(this).attr('fill', 'pink')
    if (timeout) {
      window.clearTimeout(timeout)
    }

    const len = [d.count, 'users'].join(' ').length
    tooltip
    .style('width', (len * 8) + 'px')
    .style('margin-left', (-len * 4) + 'px')
  })
  .on('mousemove', function (d) {
    if (timeout) {
      window.clearTimeout(timeout)
    }
    tooltip
    .style('left', d3.event.pageX + 'px')
    .style('top', d3.event.pageY + 'px')
    .style('opacity', 1)
    .html([d.count, 'users'].join(' '))
  })
  .on('mouseout', function () {
    d3.select(this).attr('fill', '#326cf8')
    if (timeout) {
      window.clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      tooltip.transition().duration(150).style('opacity', 0)
    }, 250)
  })
