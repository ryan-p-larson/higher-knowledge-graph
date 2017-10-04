import React                  from 'react';
import ReactFauxDOM  from 'react-faux-dom';
import * as d3                from 'd3';
import * as sankey        from 'd3-sankey';
import _                          from 'lodash';

class SankeyGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      links: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links
    });
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.nodes !== undefined);
  }

  
}

export default SankeyGraph;
