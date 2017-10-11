import React     from 'react';
import Buttons   from './buttons';
import Dropdown  from './dropdown';
import Clear      from './clear';

/**
  * @class
  * @description Component responsible for our user input. Uses two sub-modules
  * to build a dynamically displayed toolbar.
  */
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
        "Course": props.courseCallback,
        "Clear": props.clearCallback
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

  /**
    * @method
    * @description Method to set the newly selected button when it's selected.
    * @param {event} - Event object, fired 'onClick' from our buttons sub-module.
    * @returns Toolbar state set with new active view.
    */
  handleButton(event) {
    if (event) {
      let value = event.target.value;
      this.setState({active: value});
    }
  }

  /**
    * @method
    * @description Only update state if the properties contain valid data.
    */
  shouldComponentUpdate(nextProps) {
    return nextProps.department_dropdown_options.length > 1;
  }

  /**
    * @method
    * @description We only need to set our data intensive properties, the
    * functions and placeholder's have been set in the constructor.
    */
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
    // Grab the active view from our state.
    let selected = this.state.active;

    // Hold the appropriate datum for rendering our dropdown.
    let dropdown_options = this.state.dropdowns[selected];
    let dropdown_fx = this.state.callbacks[selected];
    let dropdown_place = this.state.placeholders[selected];

    return (
      <div className="row">

        <Buttons
          active={this.state.active}
          handleButton={this.handleButton}
        />

        <div className="col-xs-7">
          <Dropdown
            placeholder={dropdown_place}
            options={dropdown_options}
            callback={dropdown_fx}
          />
        </div>

        <div className="col-xs-1">
          <Clear clearCallback={this.state.callbacks.Clear}/>
        </div>
      </div>
    );
  }
};
