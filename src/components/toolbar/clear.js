import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {

  render() {
    return (
        <a className="btn btn-default" onClick={this.props.clearCallback}>
          <span className="glyphicon glyphicon-remove"></span>
        </a>
      );
  }
}