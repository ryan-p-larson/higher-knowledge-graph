import React            from 'react';

import { loadAllData, setChartTitle }  from './Utilities';
import { setGraphState, clearChartState } from './Utilities';
import { courseCallback, majorCallback, deptCallback , modalCallback} from './Utilities';

import Toolbar          from './components/toolbar/toolbar';
import Chart              from './components/chart/chart';
import Bottombar     from './components/bottombar/bottombar';
import Modal            from './components/chart/modal';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


class App extends React.Component {
  constructor() {
    super()

    this.state = {
      view: 'Load',
      active: 'Select an option from the dropdown.',

      graph: {},

      majors: {},
      major_dropdown_options: [],
      course_dropdown_options: [],
      department_dropdown_options: [],

      nodes: [],
      links: [],
      
      isOpen: false,
      modalData: {}
    };

    // Bind functions
    this.setGraphState = setGraphState.bind(this);
    this.setChartTitle = setChartTitle.bind(this);

    // Controller functions
    this.majorCallback = majorCallback.bind(this);
    this.courseCallback = courseCallback.bind(this);
    this.deptCallback = deptCallback.bind(this);
    this.clearCallback = clearChartState.bind(this);

    // Modal functions
    this.modalCallback = modalCallback.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  /**
    * @description On mounting, load all data and set our state.
    * @returns Our Component's state will be initialized.
  */
  componentWillMount() { loadAllData(data => this.setState(data)); }

  // Modal Stuff
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }



  render() {
    return (
      <div className="App">

        <Toolbar
          course_dropdown_options={this.state.course_dropdown_options}
          major_dropdown_options={this.state.major_dropdown_options}
          department_dropdown_options={this.state.department_dropdown_options}
          courseCallback={this.courseCallback}
          majorCallback={this.majorCallback}
          deptCallback={this.deptCallback}
          clearCallback={this.clearCallback}
        />

        <div className="row">
          <div className="col-xs-12">
              <h5 className="chartTitle">
                {this.setChartTitle(this.state.active, this.state.view)}
              </h5>
          </div>
        </div>

        <hr className="chartHR"/>

        <Chart
          view={this.state.view}
          active={this.state.active}
          nodes={this.state.nodes}
          links={this.state.links}
          courseCallback={this.courseCallback}
          majorCallback={this.majorCallback}
          deptCallback={this.deptCallback}
          modalCallback={this.modalCallback}
        />

        <hr className="chartHR"/>

        <Bottombar active={this.state.active}/>

        <Modal
          isOpen={this.state.isOpen}
          toggleModal={this.toggleModal}
          modalData={this.state.modalData}
        />

      </div>
    );
  }
}

export default App;
