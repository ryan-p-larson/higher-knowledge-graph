import React      from 'react';
import Sankey   from './sankey';
import Prompt   from './prompts';

import 'bootstrap/dist/css/bootstrap.css';

/**
  * @class
  * @description React Component in charge of handling the chart display.
  * @param {string} view - Describes the type of view the app is in.
  * @param {string} active - Formatted label of the active data subset.
  * @param {array} nodes - Array of course objects (can be empty)
  * @param {array} links - Array of objects linking courses (can be empty)
  * @param {function} callback - Callback for each view, creating graph for each.
  * @returns Either a chart if data is valid, else a prompt of charts to choose.
  */
export default class extends React.Component {
  render() {
    return (
        <div className="row">
          <div className="col-xs-12">
            {(this.props.links.length > 0) ?
              <Sankey
                nodes={this.props.nodes}
                links={this.props.links}
                nodeCallback={this.props.courseCallback}
              />
              :
              <Prompt
                active={this.props.active}
                view={this.props.view}
                courseCallback={this.props.courseCallback}
                majorCallback={this.props.majorCallback}
                deptCallback={this.props.deptCallback}
              />
            }
          </div>
        </div>
      );
  }
}
