import React from 'react';
import _ from 'lodash';

import 'bootstrap/dist/css/bootstrap.css';

var dept_suggests = [
  {label: "Computer Science", value: "CS", key: 0},
  {label: "Finance", value: "FIN", key: 1},
  {label: "Psychology", value: "PSY", key: 2},
  {label: "Criminology, Law & Justice", value: "CRIM", key: 3},
  {label: "Health & Human Physiology", value: "HHP", key: 4},
  {label: "Statistics", value: "STAT", key: 5}
];
var maj_suggests = [
  {label: "Applied Physics", value: "applied-physics-bs", key: 0},
  {label: "Health & Human Physiology", value: "health-human-physiology-ba", key: 1},
  {label: "Biochemistry", value: "biochemistry-bs", key: 2},
  {label: "Business Analytics & Information Systems BBA", value: "business-analytics-information-systems-bba", key: 3},
  {label: "French", value: "french-ba", key: 4}
];
var course_suggests = [
  {label: "Capstone Course in Sociology", value: "SOC:4910", key: 0},
  {label: "Business Analytics Capstone", value: "MSCI:4150", key: 1},
  {label: "Complex Variables", value: "MATH:4200", key: 2},
  {label: "Survival Data Analysis", value: "STAT:7570", key: 3},
  {label: "Trigonometry", value: "MATH:1010", key: 4},
  {label: "Web Design", value: "JMC:3611", key: 5}
];

/**
  * @class
  * @description React component to create a stack of buttons.
  * @param {method} handleButton - Method from our parent toolbar, to handle change
  * @returns Component with buttons to render various views of our chart.
  */
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "Department": props.deptCallback,
      "Major": props.majorCallback,
      "Course": props.courseCallback,
      "active": ''
    };

    // Bind functions
    this.createPrompt = this.createPrompt.bind(this);
    this.createButton = this.createButton.bind(this);
    this.createColumn = this.createColumn.bind(this);
  }

  /**
    * @method
    * @description Creates an prompt for the empty chart.
    * @param {string} label - Formatted label of data slice.
    * @param {string} view - String describing the view users are coming from.
    * @returns {HTML} A html div containing the custom, formatted prompt.
    */
  createPrompt(label, view) {
    let base = <p>Unfortunately, <i>{label}</i> has no prerequisite connections within its course curriculum</p>;
    let tail = <p>Try selecting an option from below or searching in the dropdown.</p>;

    return (
      <div className="chartPrompt alert alert-danger alert-dismissable text-center">
        {base}
        {tail}
      </div>
    );
  }

  /**
    * @method
    * @description Creates a button for a 'explore' suggestion.
    * @param {object} d - Object specifying our view button to create.
    * @param {string} object.label - Specifies the button text.
    * @param {string} object.value - Specifies the button value, passed to our callback.
    * @param {int} object.key - Specifies the button key.
    * @param {string} view - Type of exploration view, used to select callback.
    * @returns {<button>} - HTML Button.
    */
  createButton(d, view) {
    // Short lambda to assign style
    const style = (v) => {
      let button_color = {
        "Department": "list-group-item-warning",
        "Major": "list-group-item-success",
        "Course": "list-group-item-info"
      };
      return "list-group-item list-group-item-action " + button_color[v];
    };

    return (
        <button
          key={d.key}
          value={d.value}
          className={style(view)}
          onClick={() => this.state[view](d)}>
            {d.label}
        </button>
    );
  }

  /**
    * @method
    * @description Creates a list-item column of buttons to use as exploration.
    * @param {array} data - List of objects
    * @param {string} view - Type of object, passed for callbacks.
    */
  createColumn(data, view) {
    return (
      <div className="col-4 text-center">
        <h5><b>{view}</b></h5>
        <div className="list-group">
          { data.map(d => this.createButton(d, view)) }
        </div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      //nextProps.view !== 'Load' ||
      //nextProps.active !== 'Select an option from the dropdown.' ||
      this.state.active !== nextProps.active
    );
  }
  componentDidUpdate(prevProps, prevState) {
    this.setState({active: prevProps.active});
  }

  render() {
    // Initialize the rendering suggestions
    let dept_sample = _.sampleSize(dept_suggests, 3);
    let maj_sample = _.sampleSize(maj_suggests, 3);
    let course_sample = _.sampleSize(course_suggests, 3);

    return (
        <div className="row promptRow">
            {(this.props.view !== 'Load') && this.createPrompt(this.props.active, this.props.view)}
            <div></div>
            <div className="mt-auto p-2 promptButtons">
              {this.createColumn(dept_sample, 'Department')}
              {this.createColumn(maj_sample, 'Major')}
              {this.createColumn(course_sample, 'Course')}
            </div>
        </div>
      );
  }
}
