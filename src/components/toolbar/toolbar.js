import React from 'react';
import Dropdown from './dropdown';

export default class extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-3">
          <Dropdown
            data={this.props.major_dropdown_options}
            placeholder={"Major"}
            callback={this.props.majorCallback}
          />
        </div>

        <div className="col-xs-6">
          <Dropdown
            data={this.props.course_dropdown_options}
            placeholder={"Course"}
            callback={this.props.courseCallback}
          />
        </div>

        <div className="col-xs-3">
          <Dropdown
            data={this.props.department_dropdown_options}
            placeholder={"Department"}
            callback={this.props.departmentCallback}
          />
        </div>
      </div>
    );
  }
};
