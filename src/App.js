import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import { loadAllData } from './Utilities';
import { createSigmaGraph } from './components/graph';
import Dropdown from './components/toolbar/dropdown';
import SankeyApp from './components/sankey';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


class App extends React.Component {
  constructor() {
    super()

    this.state = {
      graph: {},
      majors: {},

      major_dropdown_options: [],
      course_dropdown_options: [],
      department_dropdown_options: [],

      title: "No courses displayed",
      nodes: [],
      links: []
    };

    // Bind functions
    this.setGraphState = this.setGraphState.bind(this);

    // Controller functions
    this.majorCallback = this.majorCallback.bind(this);
    this.courseCallback = this.courseCallback.bind(this);
    this.departmentCallback = this.departmentCallback.bind(this);
  }

    setGraphState(graph) {
      this.setState({
        nodes: graph.nodes,
        links: graph.links
      });
    }

    // ========================================================================
    // Add links
    // ========================================================================
    majorCallback(event) {
      // err checking
      let value = event.value;
      console.log(event);

      if (value) {
        let g = this.state.graph.graph;
        let major_ids = this.state.majors[value].courses.map(d => d.courseID);
        let major_graph = g.createSubgraphFromList(major_ids);

        // Create sub graphs for each course in the major
        let sub_major_graph = major_ids.map(d => g.createSubgraphFromSearch(d));

        let all_nodes = [major_graph.nodes];
        sub_major_graph.forEach(d => all_nodes.push(d.nodes));
        let test_nodes = _.unionBy(all_nodes, d => d.id);

        let all_links = [major_graph.links];
        sub_major_graph.forEach(d => all_links.push(d.links));
        let test_links = _.unionBy(all_links, d => d.id);

        console.log(all_nodes, test_nodes, all_links, test_links);
        this.setGraphState(major_graph);
        //this.setGraphState({nodes: test_nodes, links: test_links});
        
        // Set title of chart
        this.setState({title: event.label + " curriculum."});
      }
    }

    courseCallback(event) {
      let value = event.value;
      if (value) {
        let course_graph = this.state.graph.graph.createSubgraphFromSearch(value, 2);
        this.setGraphState(course_graph);

        // Set title of chart 
        this.setState({title: event.label + "'s prequisites."});
      }
    }

    departmentCallback(event) {
      if (!event) return;
      let value = event.value;
      let dept_ids = this.state.graph.graph.filterBy('department', value).map(d => d.id);
      let dept_graph = this.state.graph.graph.createSubgraphFromList(dept_ids);

      this.setGraphState(dept_graph);

      // Set title of chart 
      this.setState({title: "All of " + event.label + " departmental courses."});
    }




  /**
    * Component Lifecycle Methods
  */
  componentWillMount() { loadAllData(data => this.setState(data)); }
  //shouldComponentMount() { return {this.state.courses} !== {}; }

  render() {

    //if (this.state.major_dropdown_options.length > 1)
      //console.log(this.state);

    return (
      <div className="App">

        <div className="row">

          <div className="col-xs-3">
            <Dropdown 
              data={this.state.major_dropdown_options} 
              placeholder={"Major"}
              callback={this.majorCallback}
            />
          </div>

          <div className="col-xs-6">
            <Dropdown 
              data={this.state.course_dropdown_options} 
              placeholder={"Course"}
              callback={this.courseCallback}
            />
          </div>

          <div className="col-xs-3">
            <Dropdown 
              data={this.state.department_dropdown_options} 
              placeholder={"Department"}
              callback={this.departmentCallback}
            />
          </div>

        </div>

        <div className="row">
          <div className="col-xs-12">
            <h4>{this.state.title}</h4>
          </div>
        </div>

        <hr/>

        <div className="row">
          <div className="col-xs-12">
            <SankeyApp
              nodes={this.state.nodes}
              links={this.state.links}
              nodeCallback={this.courseCallback}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
