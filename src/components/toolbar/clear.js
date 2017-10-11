import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {

  render() {
    return (
        <a className="btn btn-default" title="Clear courses from chart." onClick={this.props.clearCallback}>
          <span className="glyphicon glyphicon-remove-circle clearButton"></span>
        </a>
      );
  }
}