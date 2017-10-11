import React         from 'react';
import ReactFauxDOM  from 'react-faux-dom';
import * as d3       from 'd3';
import * as sankey   from 'd3-sankey';
import _             from 'lodash';

class SankeyGraph extends React.Component {
  constructor() {
    super();
    this.state = {};

    // Bind functions
    this.getGraphFromProps = this.getGraphFromProps.bind(this);
    this.getChartBase = this.getChartBase.bind(this);
    this.setChart = this.setChart.bind(this);
    this.setLegend = this.setLegend.bind(this);
  }

  /**
    * @method
    * @description Method to extract, transform, and load a graph into our D3-Sankey.
    * @param {object} props - Props handed to the React component from our chart.
    * @returns {object} graph - Object representing our directed graph.
    * @returns {array} graph.nodes - Array of objects representing our courses.
    * @returns {array} graph.links - Array of objects connecting our nodes by id.
    */
  getGraphFromProps(props) {
    // Clone so we don't mess with our apps canonical state
    let graph = {
      nodes: _.cloneDeep(this.props.nodes),
      links: _.cloneDeep(this.props.links)
    };

    // Add weight to the links for D3-Sankey
    graph.links.forEach(d => {
      d['value'] = 1;
      return d;
    });

    return graph;
  }

  /**
    * @method
    * @description Helper method to return our base charting variables.
    * @param {int} props.width - Integer describing the width of parent container.
    * @returns {object} chart_obj - Object containing all variables within this function.
    */
  getChartBase(props) {
    // Base vars
    const margin = { top: 10, right: 30, bottom: 10, left: 10 };
    const width = (props.width || 960) - margin.left - margin.right;
    const height = (props.height || 500) - margin.top - margin.bottom;

    // Scales
    var color_scale = d3.scaleOrdinal(d3.schemeCategory10);
    var y_scale = d3.scaleLinear().domain([0, 10000]).range([height, 0]);

    // Charting elements
    let svgNode = ReactFauxDOM.createElement('div');
    var svg = d3.select(svgNode).append("svg")
      .attr("id", "sankeyChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return { margin, width, height, color_scale, y_scale, svg, svgNode };
  }

  /**
    * @method
    * @description Sets scale domains.
    * @param {object} graph - Object with nodes and links.
    * @param {d3-scale} color - D3 Ordinal scale, mapping course departments.
    * @param {d3-scale} y - D3 Linear scale, mapping course numbering.
    * @returns {null} - Passively sets the domains of both.
    */
  setScales(graph, color, y) {
    // Get only active departments by filtering out singleton nodes...
    // ... mapping to get only departments, and creating a set.
    var departments = graph.nodes
      .filter(d => d.sourceLinks.length > 0 || d.targetLinks.length > 0)
      .map(d => { return d.department; })
      .filter(function(value, index, self) { return self.indexOf(value) === index; });
    color.domain(departments);

    // Numeric now.
    y.domain(d3.extent(graph.nodes, d => d.course_num));
  }

  /**
    * @method
    * @description This is our 'fatty' D3 render function. The muscle of the chart.
    * @param {object} graph - Object with arrays for nodes, and links.
    * @param {D3-Scale} color - D3-Ordinal scale describing our color domain + range.
    * @param {object} svg - Our D3-selected SVG object.
    * @returns {null} - Passively renders our chart, no return.
    */
  setChart(graph, chart_obj) {
    let width = chart_obj.width;
    let color = chart_obj.color_scale;
    let svg = chart_obj.svg;


    // ========================================================================
    // Add links
    // ========================================================================
    // Link path
    var link = svg.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
        .selectAll("path");
    // Add path data
    link
      .data(graph.links)
      .enter().append("path")
      .attr("d", sankey.sankeyLinkHorizontal())
      .attr('class', 'link')
      .attr("stroke-width", function(d) { return Math.max(1, d.width) + "px"; });
    // Add link descriptive title
    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name; });

    // ========================================================================
    // Add nodes
    // ========================================================================
    var node = svg.append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
        .selectAll("g");
    node = node
      .data(graph.nodes)
      .enter().append("g")
      .filter(function(d) { return (d['targetLinks'].length > 0) || (d['sourceLinks'].length > 0); })
      .attr('class', 'node');
    // add nodes rect
    node.append("rect")
      .attr('id', d => { return d.id; })
      .attr('class', 'node')
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", function(d) { return color(d.department); })
      .attr("stroke", "#333");
    // add nodes text
    node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr('class', 'courseName')
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");
    // Add nodes title
    node.append('title')
      .text(d => d.name + '\n' + d.department);
  }

  /**
    * @method
    * @description Sets a color legend on our chart.
    * @param {D3-Scale} color - D3-Ordinal scale describing our domain + ranges.
    * @param {object} svg - Our faux-DOM SVG object.
    * @returns Adds a legend to our svg object.
    */
  setLegend(color, svg) {
    let legend = svg.append("g")
      .attr("class", "legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
      .data(color.domain().slice())
      .enter().append("g")
      .attr("transform", (d, i) => "translate(0," + (460 - (i*24)) + ")");

    legend.append("rect")
      .attr("x", 960 - 35)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => color(d));

    legend.append("text")
      .attr("x", 960 - 40)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);
  }

  render() {
    // Gather our neccessary charting variables and layouts.
    let chart_obj = this.getChartBase(this.props);
    let sank = sankey.sankey()
      .nodeId(d => d.id)
      .nodeAlign(sankey.sankeyCenter)
      .size([chart_obj.width, chart_obj.height]);

    // Create directed sankey graph from our graph copy.
    let g = sank(this.getGraphFromProps(this.props));

    // Set scales, draw links+nodes/legend.
    this.setScales(g, chart_obj.color_scale, chart_obj.y_scale);
    this.setChart(g, chart_obj);
    this.setLegend(chart_obj.color_scale, chart_obj.svg);

    return chart_obj.svgNode.toReact();
  }
}

export default SankeyGraph;
