import * as d3  from 'd3';
import _        from 'lodash';

import { createSigmaGraph } from './components/graph';

// =============================================================================
// Data Loading functions
// =============================================================================
/**
  * @method
  * @description Function to create dropdown options from an array of objects
  * @param {array} data - Array of objects
  * @param {string} label - String specifiying which data attribute to use as label
  * @param {string} value - String specifiying which data attribute to use as value
  * @returns {array} select_options - Array of {key: value} pairs mapped from our data.
  */
const mapSelectOptions = function(data, label, value) {
  // Filter out courses with no prereqs from being shown.
  if (data['ABRD:3010'] !== undefined) {
    var course;
    data = Object.assign({}, data);
    for (course in data)
      if (data[course].before.length < 1) delete data[course];
  }

  // Map data to alphabetical {label, value} pairs
  var select_options = d3.values(data)
    .map(d => { return {"label": d[label], "value": d[value]}; })
    .sort(function(a, b) { return d3.ascending(a.label, b.label); });

  return select_options;
}

/**
  * @method
  * @description Method to load, format, and set our React App's state.
  * This includes creating our dropdown options and our Knowledge Graph.
  * @returns {_.noop} No operator callback to pass data objects to our state.
  */
export const loadAllData = (callback = _.noop) => {
  d3.queue()
    .defer(d3.json, '02-indexed-courses.json')
    .defer(d3.json, '03-indexed-majors.json')
    .defer(d3.csv, '04-departments.csv')
    .await((err, courses, majors, departments) => {

      // Create our variables
      var graph = createSigmaGraph(courses);
      var course_dropdown_options = mapSelectOptions(courses, 'name', 'courseID');
      var major_dropdown_options = mapSelectOptions(majors, 'alias', 'major');
      var department_dropdown_options = mapSelectOptions(departments, 'label', 'value');

      // Assign them
      callback({
        graph: graph,
        majors: majors,

        course_dropdown_options: course_dropdown_options,
        major_dropdown_options: major_dropdown_options,
        department_dropdown_options: department_dropdown_options
      });
    });
};

// =============================================================================
// App functions
// =============================================================================
/**
  * @method
  * @description Syntactic sugar to set our App's state from a subgraph.
  * @param {object} graph - Object containing nodes and links between them
  * @param {array} graph.nodes - Array of node objects, each with a unique ID.
  * @param {array} graph.links - Array of link objects, each with source/target.
  * @returns Sets our React App's nodes and links to reflect subgraph.
  */
export function setGraphState(graph) {
    return this.setState({
      nodes: graph.nodes,
      links: graph.links
    });
}

/**
  * @method
  * @description Syntactic sugar to clear our App's chart.
  * @returns Sets our React App's nodes and links to empty.
  */
export function clearChartState() {
  this.setState({
    nodes: [],
    links: [],
    view: 'Load',
    active: 'Select an option from the dropdown.'
  });
}

/**
  * @method
  * @param {string} label - Formatted label of data
  * @param {string} view - Type of data view ('department', 'major', 'course', ...)
  * @returns {string} subheading - Formatted title of the chart.
  */
export function setChartTitle(label, view) {
  switch(view) {
    case 'Load':
      return label;
    case 'Department':
      return 'All ' + label + ' departmental courses.';
    case 'Major':
      return label + ' curriculum.';
    case 'Course':
      return label + "'s prequisites.";
    default:
      return null;
  }
}

// =============================================================================
// Callback functions
// =============================================================================
/**
  * @method
  * @description Function to handle a major being selected.
  * @param {event} onChange event from our dropdown.
  * @returns Our react App state updated with nodes, links, and title
  */
export function majorCallback(event) {
  // err checking
  if (event) {
    let value = event.value;
    let g = this.state.graph.graph;

    let major_ids = this.state.majors[value].courses.map(d => d.courseID);
    let major_graph = g.createSubgraphFromList(major_ids);
    // Set graph
    this.setGraphState(major_graph);

    // Set title of chart and view
    this.setState({
      active: event.label,
      view: 'Major'
    });
  } else {
    // handle invalid events here
    console.log(event);
  }
}

/**
  * @method
  * @description Function to handle a department being selected.
  * @param {event} onChange event from our dropdown.
  * @returns Our react App state updated with nodes, links, and title
  */
export function deptCallback(event) {
  if (event) {
    let value = event.value;
    // Filter only departmental courses, create graph from them
    let dept_ids = this.state.graph.graph.filterBy('department', value).map(d => d.id);
    let dept_graph = this.state.graph.graph.createSubgraphFromList(dept_ids);
    // Set graph
    this.setGraphState(dept_graph);

    // Set title of chart and view
    this.setState({
      active: event.label,
      view: 'Department'
    });
  } else {
    console.log(event);
  }
}

/**
  * @method
  * @description Function to handle a course being selected.
  * @param {event} onChange event from our dropdown.
  * @returns Our react App state updated with nodes, links, and title
  */
export function courseCallback(event) {
  if (event) {
    let value = event.value;
    let course_graph = this.state.graph.graph.createSubgraphFromSearch(value, 2);
    this.setGraphState(course_graph);

    // Set title of chart and view
    this.setState({
      active: event.label,
      view: 'Course'
    });
  } else {
    console.log(event);
  }
}

/**
  * @method
  * @description Function to open a modal and populate it with a course's information.
  * @param {object} d - Course object passed via D3 in our chart.
  * @returns Opened modal, filled with information.
  */
export function modalCallback(d) {
  // Set the information
  this.setState({modalData: d});
  // Open the modal
  this.toggleModal();
}