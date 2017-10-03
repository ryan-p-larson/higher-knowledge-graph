import React    from 'react';
import * as d3  from 'd3';
import _        from 'lodash';

import { createSigmaGraph } from './components/graph';

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
    var data = Object.assign({}, data);
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
