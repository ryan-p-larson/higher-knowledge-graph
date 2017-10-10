import React            from 'react';

import { loadAllData }  from './Utilities';
import { setGraphState} from './Utilities';
import { courseCallback, majorCallback, deptCallback } from './Utilities';

import Toolbar          from './components/toolbar/toolbar';
import Sankey           from './components/sankey';
import Png              from './components/toolbar/png';
import Prompt           from './components/chart/prompts';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


class App extends React.Component {
  constructor() {
    super()

    this.state = {
      graph: {},
      majors: {},

      major_dropdown_options: [],
      course_dropdown_options: [],
      department_dropdown_options: [],

      title: "No courses displayed",
      nodes: [],
      links: [],

      curriculum: []
    };

    // Bind functions
    this.setGraphState = setGraphState.bind(this);

    // Controller functions
    this.majorCallback = majorCallback.bind(this);
    this.courseCallback = courseCallback.bind(this);
    this.deptCallback = deptCallback.bind(this);
  }


  /**
    * @description On mounting, load all data and set our state.
    * @returns Our Component's state will be initialized.
  */
  componentWillMount() { loadAllData(data => this.setState(data)); }

  render() {
    console.log(this.state);

    return (
      <div className="App">

        <Toolbar
          course_dropdown_options={this.state.course_dropdown_options}
          major_dropdown_options={this.state.major_dropdown_options}
          department_dropdown_options={this.state.department_dropdown_options}
          courseCallback={this.courseCallback}
          majorCallback={this.majorCallback}
          deptCallback={this.deptCallback}
        />

        <div className="row">
          <div className="col-xs-12">
            <h5 className="chartTitle">{this.state.title}</h5>
          </div>
        </div>

        <hr className="chartHR"/>

        <div className="row">
          <div className="col-xs-12">
            {(this.state.links.length > 0) ?
              <Sankey
                nodes={this.state.nodes}
                links={this.state.links}
                nodeCallback={this.courseCallback}
              />
              :
              <Prompt
                courseCallback={this.courseCallback}
                majorCallback={this.majorCallback}
                deptCallback={this.deptCallback}
              />
            }
          </div>
        </div>

        <hr className="chartHR"/>
        <Png/>

      </div>
    );
  }
}

export default App;
