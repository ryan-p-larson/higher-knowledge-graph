import React    from 'react';
import * as d3  from 'd3';
import _        from 'lodash';

import { createSigmaGraph } from './components/graph';


const mapSelectOptions = function(data, label, value) {
    // Map data to alphabetical {label, value} pairs
    var select_options = d3.values(data)
      .map(d => { return {"label": d[label], "value": d[value]}; })
      .sort(function(a, b) { return d3.ascending(a.label, b.label); });

    return select_options;
}

export const loadAllData = (callback = _.noop) => {
  d3.queue()
    .defer(d3.json, '02-indexed-courses.json')
    .defer(d3.json, '03-indexed-majors.json')
    .defer(d3.csv, '04-departments.csv')
    .await((err, courses, majors, departments) => {

      var course_dropdown_options = mapSelectOptions(courses, 'name', 'courseID');
      var major_dropdown_options = mapSelectOptions(majors, 'alias', 'major');
      var department_dropdown_options = mapSelectOptions(departments, 'label', 'value');

      var graph = createSigmaGraph(courses);

      callback({
        majors: majors,
        course_dropdown_options: course_dropdown_options,
        major_dropdown_options: major_dropdown_options,
        department_dropdown_options: department_dropdown_options,

        graph: graph
      });

    });
};

export function setGraphState(graph) {
    return this.setState({
      nodes: graph.nodes,
      links: graph.links
    });
}
