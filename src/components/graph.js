import sigma from 'sigma';
import _ from 'lodash';

/**
  * Adds a method to get incoming neighbors of a node
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
  * Adds a method to get all neighbors of a node
*/
sigma.classes.graph.addMethod('neighbors', function(nodeId) {
  var k,
      neighbors = [],
      index = this.allNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors.push(this.nodesIndex[k]);

  return neighbors;
});

/**
  * Filters the graph by node attributes.
  * O(|V|)
*/
sigma.classes.graph.addMethod('filterBy', function(attr, value) {
  let nodes = this.nodes();
  let filtered_nodes = nodes.filter(d => d[attr] === value);
  
  return filtered_nodes;
});

/**
  * Returns a subgraph in JSON format of nodes and links between them
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
  * Returns a subgraph in JSON format of a depth-bounded search.
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
      // DECISION
      // DO WE WANT TO 
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
  //let temp_nodes = nodes.map(d => d.id);
  //return this.createSubgraphFromList(temp_nodes);
});

/**
  * Helper function to create a slimmed down node for SigmaJS.
*/
const createNode = (d) => {
  return {
    id: d.courseID,
    hours: d.hours,
    course_num: d.course_num,
    department: d.department,
    name: d.name
  }
}

/**
  * Helper function to add a link from our raw encoding, formatted with ID, to our graph.
*/
const createLink = (source, target) => {
  return {
    id: source + '-' + target,
    source: source,
    target: target
  };
}

/**
  * Constructor function to create a Knowledge Graph. (Sigma graph of our courses).
*/
export const createSigmaGraph = (courses) => {
  var course, prev;

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

