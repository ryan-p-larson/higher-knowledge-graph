import React     from 'react';
import Png	from './png';


export default class extends React.Component {
  render() {
    return (
      <div className="subnav">
        <nav>
          <ul className="nav pull-left">
            <li className="nav-item"><a className="nav-link" href="https://github.com/ryan-p-larson/higher-knowledge-graph">Github</a></li>
            <li className="nav-item"><a className="nav-link" href="https://github.com/ryan-p-larson/hackathon">Data</a></li>
          </ul>
        </nav>

        <nav>
          <ul className="nav pull-right">
            <li className="nav-item"><Png active={this.props.active} /></li>
          </ul>
        </nav>

      </div>
      );
  }
}
