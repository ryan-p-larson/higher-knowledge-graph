import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';
import * as sankey from 'd3-sankey';
import _ from 'lodash';

export default class extends React.Component {
  constructor() {
    super()

    this.state = {
      nodes: [],
      links: [],
      nodeCallback: {}
    };

    // Bind functions
    this.renderLegend = this.renderLegend.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links,
      nodeCallback: nextProps.nodeCallback
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.nodes !== undefined;
  }

  renderLegend(color, svg) {
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
    // ========================================================================
    // Set units, margin, sizes
    // ========================================================================
    var margin = { top: 10, right: 30, bottom: 10, left: 10 };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var color_scale = d3.scaleOrdinal(d3.schemeCategory10);
    const y_scale = d3.scaleLinear().domain([0, 10000]).range([height, 0]);

    // ========================================================================
    // Set the sankey diagram properties
    // ========================================================================

    var app = sankey.sankey()
      .nodeId(function(d) { return d.id; })
      .nodeAlign(sankey.sankeyCenter)
      .size([width, height]);

    var graph = {
      nodes: _.cloneDeep(this.props.nodes),
      links: _.cloneDeep(this.props.links)
    };

    // Add weight to the links
    graph.links.forEach(d => {
      d['value'] = 1;
      delete d['id'];
      return d;
    });

    // ========================================================================
    // Initialize and append the svg canvas to faux-DOM
    // ========================================================================
    var svgNode = ReactFauxDOM.createElement('div');

    var svg = d3.select(svgNode).append("svg")
      .attr("id", "sankeyChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //if (graph.nodes.length === 0) return svgNode.toReact();

    // ========================================================================
    // Add links
    // ========================================================================


    if ((graph.nodes.length > 1) && (graph.links.length > 0)) {

      // Initialize links
      app(graph);

      // Get only active departments by filtering out singleton nodes...
      // ... mapping to get only departments, and creating a set.
      var departments = graph.nodes
        .filter(d => d.sourceLinks.length > 0 || d.targetLinks.length > 0)
        .map(d => { return d.department; })
        .filter(function(value, index, self) { return self.indexOf(value) === index; });
      // Set slimmed color scale domain
      color_scale.domain(departments);
      // Y scale set
      y_scale.domain(d3.extent(graph.nodes, d => d.course_num));

      // Manually adjust height
      /*
      graph.nodes.forEach(d => {
        var nodeHeight = d.y1 - d.y0;
        d.y1 = y_scale(d.course_num);
        d.y0 = d.y1 - nodeHeight;
        // Make sure higher nodes don't get crowded out
        if (d.y0 < 0) {
          d.y0 = 0;
          d.y1 = nodeHeight;
        }
        // Add node height, nodes without links need explicit setting
        d.height = nodeHeight;
        return d;
      });

      app.update(graph);
      */



      var link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
        .selectAll("path");
      var node = svg.append("g")
          .attr("class", "nodes")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
        .selectAll("g");

      // add link titles
      link = link
          .data(graph.links)
          .enter().append("path")
          .attr("d", sankey.sankeyLinkHorizontal())
          .attr('class', 'link')
          .attr("stroke-width", function(d) { return Math.max(1, d.width) + "px"; });
      link.append("title")
          .text(function(d) { return d.source.name + " → " + d.target.name; });

      // ========================================================================
      // Add nodes
      // ========================================================================
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
          .attr("fill", function(d) { return color_scale(d.department); })
          .attr("stroke", "#333");
          //.on('click', d => this.props.nodeCallback({value: d.id, label: d.name}));

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

      // render legend
      this.renderLegend(color_scale, svg);

    }
    // Above D3 manipaluation equal to following jsx if didn't rely on faux-dom
    // ------------------------------------------------------------------------
    // var links = graph.links.map((link, i) => {
    //   return (
    //     <g>
    //       <path key={i} className="link" onClick={()=>{this.props.openModal(link)}} d={path(link)} style={{strokeWidth: Math.max(1, link.dy)}}>
    //         <title>{link.source.name + " → " + link.target.name + "\n Weight: " + format(link.value)}</title>
    //       </path>
    //     </g>
    //   );
    // });

    // var nodes = graph.nodes.map((node, i) => {
    //   return (
    //     <g key={i} className="node" onClick={()=>{this.props.openModal(node)}} transform={"translate(" + node.x + "," + node.y + ")"}>
    //       <rect height={node.dy} width={sankey.nodeWidth()}>
    //         <title>{node.name + "\n" + format(node.value)}</title>
    //       </rect>
    //       { (node.x >= width / 2) ?
    //         <text x={-6} y={node.dy / 2} dy={".35em"} textAnchor={"end"} >{node.name}</text> :
    //         <text x={6 + sankey.nodeWidth()} y={node.dy / 2} dy={".35em"} textAnchor={"start"} >{node.name}</text>
    //       }
    //     </g>
    //   );
    // });

    // ========================================================================
    // Render the faux-DOM to React elements
    // ========================================================================
    return svgNode.toReact();

    // JSX rendering return if didn't rely on faux-dom
    // ------------------------------------------------------------------------
    // return (
    //   <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    //     <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
    //       {links}
    //       {nodes}
    //     </g>
    //   </svg>
    // );
  }
}
