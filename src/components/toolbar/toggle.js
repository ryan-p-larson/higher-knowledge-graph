import React from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {edit: false};
  }

  render() {
    var label_str = (this.state.edit === true) ? 'Edit': 'Explore';
    return (
        <label>
          <Toggle
            defaultChecked={this.state.edit}
            icons={{
              checked: null,
              unchecked: null,
            }}
            //onChange={this.handleSoupChange} 
          />
          <span>{label_str}</span>
        </label>
      );
  }
}