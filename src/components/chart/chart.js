import React      from 'react';
import Sankey   from './sankey';
import Prompt   from './prompts';

import 'bootstrap/dist/css/bootstrap.css';

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