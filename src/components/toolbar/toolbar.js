import React        from 'react';
import Buttons      from './buttons';
import Dropdown from './dropdown';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: {
        "Department": props.department_dropdown_options,
        "Major": props.major_dropdown_options,
        "Course": props.course_dropdown_options
      },
      callbacks: {
        "Department": props.deptCallback,
        "Major": props.majorCallback,
        "Course": props.courseCallback
      },
      placeholders: {
        "Department": "CS, FIN, and PSY are good places to start.",
        "Major": "Try 'Applied Physics' or 'Health Human Physiology'",
        "Couse": "'Sociology Capstone', 'Distributed Algorithms', ..."
      },

      active: "Department",
      fx: props.deptCallback
    },

    // Bind functions
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    if (event) {
      let value = event.target.value;
      this.setState({
        active: value,
      });
      this.render();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.department_dropdown_options.length > 1;
  }

  componentWillReceiveProps(props) {
    this.setState({
      dropdowns: {
        "Department": props.department_dropdown_options,
        "Major": props.major_dropdown_options,
        "Course": props.course_dropdown_options
      },
      callbacks: {
        "Department": props.deptCallback,
        "Major": props.majorCallback,
        "Course": props.courseCallback
      },
      placeholders: {
        "Department": "CS, FIN, and PSY are good places to start.",
        "Major": "Try 'Applied Physics' or 'Health Human Physiology'",
        "Couse": "'Sociology Capstone', 'Distributed Algorithms', ..."
      },

      fx: props.deptCallback
    });
  }

  render() {
    let selected = this.state.active;
    let dropdown_options = this.state.dropdowns[selected];
    let dropdown_fx = this.state.callbacks[selected];
    let dropdown_place = this.state.callbacks[selected];

    return (
      <div className="row">

        <Buttons
          active={this.state.active}
          handleToggle={this.handleToggle}
        />

        <div className="col-xs-6">
          <Dropdown
            searchPromptText={dropdown_place}
            options={dropdown_options}
            callback={dropdown_fx}
          />
        </div>

        <div className="col-xs-2">
          <button type="button" className="btn btn-outline-danger">X</button>
        </div>
      </div>
    );
  }
};
