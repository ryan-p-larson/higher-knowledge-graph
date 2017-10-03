import React    from 'react';
import Dropdown from './dropdown';

export default class extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-3">
          <Dropdown
            placeholder={"Department"}
            data={this.props.department_dropdown_options}
            callback={this.props.departmentCallback}
          />
        </div>

        <div className="col-xs-3">
          <Dropdown
            placeholder={"Major"}
            data={this.props.major_dropdown_options}
            callback={this.props.majorCallback}
          />
        </div>

        <div className="col-xs-6">
          <Dropdown
            placeholder={"Course"}
            data={this.props.course_dropdown_options}
            callback={this.props.courseCallback}
          />
        </div>
      </div>
    );
  }
};
