import sigma from 'sigma';
import _ from 'lodash';

/**
  * @method
  * @description Adds a method to get incoming neighbors of a node.
  * @param {string} nodeID - node identifier
  * @returns {array} neighbors - list of node objects
  */
sigma.classes.graph.addMethod('inNeighbors', function(nodeId) {
  var k,
      neighbors = [],
      index = this.inNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors.push(this.nodesIndex[k]);

  return neighbors;
});

/**
  * @method
  * @description Adds a method to get out neighbors (antecedents) of a node.
  * @param {string} nodeID - node identifier
  * @returns {array} neighbors - list of node objects
  */
sigma.classes.graph.addMethod('outNeighbors', function(nodeId) {
  var k,
      neighbors = [],
      index = this.outNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors.push(this.nodesIndex[k]);

  return neighbors;
});

/**
  * @method
  * @description Filters the graph by node attributes: O(|V|) time
  * @param {string} attr - Attribute of nodes to filter by, E.g. 'department'
  * @param {string} value - Value of attribute to keep, E.g. 'CS'
  * @returns {array} filtered_nodes - List of node objects that satisfy parameters
*/
sigma.classes.graph.addMethod('filterBy', function(attr, value) {
  let nodes = this.nodes();
  let filtered_nodes = nodes.filter(d => d[attr] === value);

  return filtered_nodes;
});

/**
  * @method
  * @description Returns a subgraph in JSON format of nodes and links between them
  * @param {list} node_list - List of nodeIDs, E.g. ['CS:2230', 'CS:3330', ...]
  * @returns {object} graph - Object containing 2 arrays: nodes and links
  * @returns {object.nodes} - List of node objects contained in node_list
  * @returns {object.links} - List of link objects connecting nodes in subgraph
*/
sigma.classes.graph.addMethod('createSubgraphFromList', function(node_list) {
  let node_lookup = new Set(node_list);
  let nodes = this.nodes(node_list);
  let links = [];

  nodes.forEach(d => {
    let prev_nodes = this.inNeighbors(d.id);

    prev_nodes.forEach(e => {
      if (node_lookup.has(e.id)) links.push(createLink(e.id, d.id));
    });
  })

  // Conditionally add prereqs of nodes if they're in our list.
  return {"nodes": nodes, "links": links};
});

/**
  * @method
  * @description Returns the subgraph of a bounded search on a course.
  * @param {string} nodeID - Node identifier the search should be started on.
  * @param {int} depth - Value declaring the maximal depth of called search
  * @returns {object} graph - Object containing 2 arrays: nodes and links
  * @returns {object.nodes} - List of node objects contained in node_list
  * @returns {object.links} - List of link objects connecting nodes in subgraph
*/
sigma.classes.graph.addMethod('createSubgraphFromSearch', function(nodeID, depth=1) {
  let nodes = [];
  let links = [];

  let queue = [];
  queue.push(nodeID);

  while (depth > 0) {
    queue.forEach(d => {
      // Grab our id
      let current_id = queue.pop();

      // Push node into our list
      let current_node = this.nodes(current_id);
      nodes.push(current_node);

      // Gather neighbors
      let node_neighbors = this.inNeighbors(current_id);

      // Add each to queue
      node_neighbors
        .map(e => e.id)
        .forEach(e => {
          nodes.push(this.nodes(e));
          links.push(createLink(e, current_id));
          queue.push(e);
        });

      // End queue traversal
      });
    // Increment depth
    depth = depth - 1;
  }

  return {"nodes": nodes, "links": links};
});

/**
  @method
  * @description Helper function to create a node for SigmaJS.
  * @param {object} d - Node object from our indexed-courses.json
  * @returns {object} Node object for our Knowledge Graph
*/
const createNode = (d) => {
  return {
    id: d.courseID,
    name: d.name,
    course_num: d.course_num,
    hours: d.hours,
    department: d.department,
    description: d.description,
    href: d.href
  }
}

/**
  * @method
  * @description Helper function to add a link from our raw encoding, formatted with ID, to our graph.
  * @param {string} source - Identifier of node who is the 'prereq' in relationship.
  * @param {string} target - Indentifier of node who is the 'course' in relationship.
  * @returns {object} link - Link object with source, target, and unique ID.
*/
const createLink = (source, target) => {
  return {
    id: source + '-' + target,
    source: source,
    target: target
  };
}

/**
  * @method
  * @description Constructor function to create a Knowledge Graph. (Sigma graph of our courses).
  * @param {object} courses - Object that maps courseID's to course information. AKA our indexed-courses.json
  * @returns {object} s - Returns a Sigma graph with all of the functions and methods in this file.
*/
export const createSigmaGraph = (courses) => {
  var course;

    // Dont clone so we can reference them and clone them later down the line
  let s = new sigma({
    settings: {
      clone: false,
      immutable: false
    }
  });

  // Add all courses to graph
  for (course in courses)
    s.graph.addNode(createNode(courses[course]));

  // Hold (duplicate) links
  var links = [];

  // Add all prereqs to links list
  for (course in courses) {
    let prev = courses[course]['before'];
    prev.forEach(d => links.push(createLink(d.source, d.target)));
  }

  // Deduplicate links
  const deduped_links = _.uniqBy(links, 'id');

  // Add links to graph
  deduped_links.forEach(d => s.graph.addEdge(d));

  return s;
}
