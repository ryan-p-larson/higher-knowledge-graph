import React      from 'react';
import Sankey  from './sankeyChart';
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
  constructor (props, context) {
    super(props, context);

    this.state = {
       width: 960,
       height: 500
    };
    this.measure = this.measure.bind(this);
  }

  /**
    * @method
    * @description Set's the chart height/width state based on the parent div=row.
    * @param {passive} ref - Parent row div needs to have a ref set.
    * @returns Sets parent state dimensions.
    */
  measure() {
    this.setState({
      height: this.divRef.clientHeight,
      width: this.divRef.clientWidth
    });
  }

  componentDidMount() {
    // Once our div mounts we should update it's dimensions
    this.measure();
  }
  componentWillMount () {
    // Add a listener to adjust on resize
    window.addEventListener('resize', this.measure, false);
  }
  componentWillUnmount () {
    // Get rid of our listener.
    window.removeEventListener('resize', this.measure, false);
  }

  render() {
    return (
        <div ref={element => this.divRef = element} className="row sankeyChart justify-content-center">
          <div className="col-xs-12">
            {(this.props.links.length > 0) ?
              <Sankey
                nodes={this.props.nodes}
                links={this.props.links}
                width={this.state.width}
                height={this.state.height}
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
