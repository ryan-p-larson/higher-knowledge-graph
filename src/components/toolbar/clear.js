import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';


export default class extends React.Component {
  /**
    * @method
    * @description Method to set button style as active or disabled.
    * @param {string} active - Formatted label of active view.
    * @returns {string} css class for download button.
    */
  setStyle(view) {
    let base_style = "btn btn-default pull-right";

    // Loading screen has nothing to clear: don't display anything.
    if (view === 'Load') return base_style + ' disabled';
    return base_style;
  }

  render() {
    return (
        <a
          className={this.setStyle(this.props.view)}
          title="Clear courses from chart."
          onClick={this.props.clearCallback}
        >
          <span className="glyphicon glyphicon-remove-circle clearButton">X</span>
        </a>
      );
  }
}
