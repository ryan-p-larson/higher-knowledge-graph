import React     from 'react';
import Buttons   from './buttons';
import Dropdown  from './dropdown';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: {
        "Department": [],
        "Major": [],
        "Course": []
      },
      callbacks: {
        "Department": props.deptCallback,
        "Major": props.majorCallback,
        "Course": props.courseCallback
      },
      placeholders: {
        "Department": "CS, FIN, and PSY are good places to start.",
        "Major": "Try 'Applied Physics' or 'Health Human Physiology'",
        "Course": "'Sociology Capstone', 'Distributed Algorithms', ..."
      },

      active: "Department",
      fx: props.deptCallback
    },

    // Bind functions
    this.handleButton = this.handleButton.bind(this);
  }

  handleButton(event) {
    if (event) {
      let value = event.target.value;
      this.setState({active: value});
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
      }
    });
  }

  render() {
    let selected = this.state.active;
    let dropdown_options = this.state.dropdowns[selected];
    let dropdown_fx = this.state.callbacks[selected];
    let dropdown_place = this.state.placeholders[selected];

    return (
      <div className="row">

        <Buttons
          active={this.state.active}
          handleButton={this.handleButton}
        />

        <div className="col-xs-8">
          <Dropdown
            placeholder={dropdown_place}
            options={dropdown_options}
            callback={dropdown_fx}
          />
        </div>
      </div>
    );
  }
};
