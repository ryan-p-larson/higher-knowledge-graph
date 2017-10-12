import React     from 'react';
import Png	from './png';


export default class extends React.Component {
  render() {
    return (
      <div className="subnav">
        <nav>
          <ul className="nav nav-pills pull-left">
            <li role="presentation"><a href="https://github.com/ryan-p-larson/higher-knowledge-graph">Github</a></li>
            <li role="presentation"><a href="https://github.com/ryan-p-larson/hackathon">Data</a></li>
          </ul>
        </nav>

        <nav>
          <ul className="nav nav-pills pull-right">
            <li role="presentation"><a id="signature" className="navbar-text disabled">Ryan Larson | 2017</a></li>
            <li role="presentation"><Png active={this.props.active} /></li>
          </ul>
        </nav>

      </div>
      );
  }
}