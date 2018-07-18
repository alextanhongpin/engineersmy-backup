
const svg = d3.select('body').append('svg')

svg
.attr('width', 960)
.attr('height', 640)

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}

const width = svg.attr('width') - margin.left - margin.right
const height = svg.attr('height') - margin.top - margin.bottom

const x = d3.scaleBand().rangeRound([0, width]).padding(0.2)
const y = d3.scaleLinear().rangeRound([height, 0])

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

const data = [{'count': 30, 'label': 2008}, {'count': 73, 'label': 2009}, {'count': 172, 'label': 2010}, {'count': 305, 'label': 2011}, {'count': 434, 'label': 2012}, {'count': 621, 'label': 2013}, {'count': 845, 'label': 2014}, {'count': 960, 'label': 2015}, {'count': 929, 'label': 2016}, {'count': 420, 'label': 2017}]

x.domain(data.map((d) => d.label))
y.domain([0, d3.max(data, (d) => d.count)])

g.append('g')
.attr('class', 'axis is-x')
.attr('transform', `translate(0, ${height})`)
.call(d3.axisBottom(x))

g.append('g')
.attr('class', 'axis is-y')
.call(d3.axisLeft(y))
.append('text')
.attr('transform', 'rotate(-90)')
.attr('y', 6)
.attr('dy', '0.71em')
.attr('text-anchor', 'end')
.text('Frequency')

g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
  .attr('class', 'bar')
  .attr('x', (d) => x(d.label))
  .attr('y', (d) => y(d.count))
  .attr('width', x.bandwidth())
  .attr('height', (d) => height - y(d.count))
