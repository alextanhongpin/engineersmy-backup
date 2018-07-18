const raw_data = [{'language': 'JavaScript', 'frequency': 2263}, {'language': 'Java', 'frequency': 1588}, {'language': 'PHP', 'frequency': 1479}, {'language': 'Ruby', 'frequency': 1422}, {'language': 'HTML', 'frequency': 1043}, {'language': 'Python', 'frequency': 848}, {'language': 'CSS', 'frequency': 775}, {'language': 'C#', 'frequency': 443}, {'language': 'C', 'frequency': 395}, {'language': 'C++', 'frequency': 326}, {'language': 'Shell', 'frequency': 301}, {'language': 'Swift', 'frequency': 271}, {'language': 'Objective-C', 'frequency': 269}, {'language': 'R', 'frequency': 211}, {'language': 'Go', 'frequency': 132}, {'language': 'Jupyter Notebook', 'frequency': 83}, {'language': 'TypeScript', 'frequency': 79}, {'language': 'Visual Basic', 'frequency': 73}, {'language': 'Arduino', 'frequency': 70}, {'language': 'Scala', 'frequency': 49}, {'language': 'VimL', 'frequency': 41}, {'language': 'Elixir', 'frequency': 39}, {'language': 'Perl', 'frequency': 32}, {'language': 'Lua', 'frequency': 27}, {'language': 'CoffeeScript', 'frequency': 26}, {'language': 'Assembly', 'frequency': 24}, {'language': 'Makefile', 'frequency': 23}, {'language': 'Clojure', 'frequency': 22}, {'language': 'Matlab', 'frequency': 20}, {'language': 'Rust', 'frequency': 19}, {'language': 'TeX', 'frequency': 19}, {'language': 'Vim script', 'frequency': 16}, {'language': 'Verilog', 'frequency': 16}, {'language': 'Processing', 'frequency': 15}, {'language': 'Kotlin', 'frequency': 14}, {'language': 'Groovy', 'frequency': 13}, {'language': 'Erlang', 'frequency': 13}, {'language': 'Vue', 'frequency': 12}, {'language': 'ApacheConf', 'frequency': 11}, {'language': 'Puppet', 'frequency': 11}, {'language': 'Emacs Lisp', 'frequency': 11}, {'language': 'PowerShell', 'frequency': 11}, {'language': 'ASP', 'frequency': 10}, {'language': 'Eagle', 'frequency': 10}, {'language': 'Pascal', 'frequency': 10}, {'language': 'Batchfile', 'frequency': 9}, {'language': 'AutoHotkey', 'frequency': 8}, {'language': 'Haskell', 'frequency': 8}, {'language': 'HCL', 'frequency': 6}, {'language': 'Crystal', 'frequency': 6}, {'language': 'ActionScript', 'frequency': 6}, {'language': 'XSLT', 'frequency': 5}, {'language': 'Smali', 'frequency': 5}, {'language': 'Smarty', 'frequency': 5}, {'language': 'Nginx', 'frequency': 5}, {'language': 'Common Lisp', 'frequency': 4}, {'language': 'Cuda', 'frequency': 4}, {'language': 'KiCad', 'frequency': 4}, {'language': 'CMake', 'frequency': 3}, {'language': 'Haxe', 'frequency': 3}, {'language': 'PLpgSQL', 'frequency': 3}, {'language': 'Prolog', 'frequency': 3}, {'language': 'FreeMarker', 'frequency': 3}, {'language': 'Roff', 'frequency': 2}, {'language': 'Perl6', 'frequency': 2}, {'language': 'XML', 'frequency': 2}, {'language': 'PLSQL', 'frequency': 2}, {'language': 'AutoIt', 'frequency': 2}, {'language': 'VHDL', 'frequency': 2}, {'language': 'OpenEdge ABL', 'frequency': 2}, {'language': 'Scheme', 'frequency': 2}, {'language': 'LabVIEW', 'frequency': 2}, {'language': 'M', 'frequency': 2}, {'language': 'F#', 'frequency': 2}, {'language': 'DIGITAL Command Language', 'frequency': 2}, {'language': 'GCC Machine Description', 'frequency': 2}, {'language': 'SQLPL', 'frequency': 2}, {'language': 'SystemVerilog', 'frequency': 2}, {'language': 'ColdFusion', 'frequency': 2}, {'language': 'QML', 'frequency': 2}, {'language': 'Squirrel', 'frequency': 1}, {'language': 'Limbo', 'frequency': 1}, {'language': 'LiveScript', 'frequency': 1}, {'language': 'Elm', 'frequency': 1}, {'language': 'Scilab', 'frequency': 1}, {'language': 'DOT', 'frequency': 1}, {'language': 'Objective-C++', 'frequency': 1}, {'language': 'CLIPS', 'frequency': 1}, {'language': 'Protocol Buffer', 'frequency': 1}, {'language': 'Cucumber', 'frequency': 1}, {'language': 'COBOL', 'frequency': 1}, {'language': 'BlitzBasic', 'frequency': 1}, {'language': 'Logos', 'frequency': 1}, {'language': 'SaltStack', 'frequency': 1}, {'language': 'Game Maker Language', 'frequency': 1}, {'language': 'Slash', 'frequency': 1}, {'language': 'LOLCODE', 'frequency': 1}, {'language': 'SourcePawn', 'frequency': 1}, {'language': 'MoonScript', 'frequency': 1}, {'language': 'SAS', 'frequency': 1}, {'language': 'Julia', 'frequency': 1}, {'language': 'Rebol', 'frequency': 1}, {'language': 'Vala', 'frequency': 1}, {'language': 'AppleScript', 'frequency': 1}, {'language': 'AspectJ', 'frequency': 1}, {'language': 'OpenSCAD', 'frequency': 1}, {'language': 'GLSL', 'frequency': 1}, {'language': 'D', 'frequency': 1}, {'language': 'BitBake', 'frequency': 1}]
// take only language with frequence more than 5
// const data = raw_data.filter(({ frequency}) => frequency > 5)

// Take top 20
const data = raw_data.splice(0, 20)
const remaining = raw_data.splice(20)

const lessThanFive = raw_data.filter(({ frequency}) => frequency <= 5)
console.log('lessThanFive', lessThanFive)
console.log('Total languages', raw_data.length)

// SVG

const svg = d3.select('#d3').append('svg')
const svgPadding = 20
const aspectRatio = 16 / 9
const svgWidth = window.innerWidth - svgPadding
const svgHeight = svgWidth / aspectRatio
svg
.attr('width', 960)
.attr('height', 640)
.attr('viewBox', '0 0 960 640')
.attr('preserveAspectRatio', 'xMidYMid meet')

const margin = {
  top: 45,
  right: 60,
  bottom: 45,
  left: 100
}
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
    // .style('margin-top', '-50%')

const width = svg.attr('width') - margin.left - margin.right
const height = svg.attr('height') - margin.top - margin.bottom

data.sort(function (a, b) {
  return a.frequency - b.frequency
})

const x = d3.scaleLinear().rangeRound([0, width])
const y = d3.scaleBand().range([height, 0])
const color = d3.scaleOrdinal(d3.schemeCategory20)

x.domain([0, d3.max(data, (d) => d.frequency)])
y.domain(data.map((d) => d.language)).padding(0.25)
color.domain(data.map(d => d.language))

const g = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`)

const xAxis = g.append('g')
  .attr('class', 'axis is-x')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5).tickSizeInner([-height]))

const xAxisVerticalLine = xAxis.selectAll('line')
.attr('stroke', '#DDDDDD')

const xAxisLabel = xAxis.append('text')
  .attr('fill', 'black')
  .attr('font-weight', 'bold')
  .attr('font-size', 16)
  .text('Repos')
  .attr('x', width)
  .attr('y', 30)

const yAxis = g.append('g')
  .attr('class', 'axis is-y')
  .call(d3.axisLeft(y))

const yAxisLabel = yAxis.append('text')
  .text('Languages')
  .attr('x', 0)
  .attr('y', -15)
  .attr('fill', 'black')
  .attr('font-weight', 'bold')
  .attr('font-size', 16)

let timeout = null
const bars = g.selectAll('.bar')
  .data(data)
  .enter()
  .append('g')
  .on('mouseover', function (d) {
    d3.select(this).select('rect').attr('fill', 'pink')
    // if (timeout) {
    //   window.clearTimeout(timeout)
    // }

    const len = [d.frequency, d.language, 'repos found'].join(' ').length
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
    .html([d.frequency, d.language, 'repos found'].join(' '))
  })
  .on('mouseout', function () {
    d3.select(this).select('rect').attr('fill', '#326cf8')
    if (timeout) {
      window.clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      tooltip.transition().duration(150).style('opacity', 0)
    }, 250)
  })

bars.append('rect')
  .attr('class', 'bar')
  .attr('x', (d) => 0)
  .attr('y', (d) => y(d.language))
  .attr('width', 0)
  .transition()
  .delay((d) => x(d.frequency) / 2)
  .attr('width', (d) => x(d.frequency))
  .attr('height', y.bandwidth())
  .attr('fill', '#326cf8')

  // .attr('fill', (d) => color(d.frequency))

// Label
const labels = bars.append('text')
  .attr('x', (d) => x(d.frequency) + 10)
  .attr('y', (d) => y(d.language) + y.bandwidth() / 2 + 12 / 2)
  .text((d) => d.frequency)
  .attr('fill', 'white')
  .transition()
  .delay(250)
  .attr('fill', 'black')
  .attr('font-size', 12)
