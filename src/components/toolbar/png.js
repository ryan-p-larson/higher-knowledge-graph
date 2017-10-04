import React            from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {
  render() {
    let svg = document.getElementById('sankeyChart');
    return (
        <div className="row">
          <div className="col-xs-12">
            <a href="#" className="pull-right btn btn-primary btn-success">
              <span className="glyphicon glyphicon-cloud-download"></span> Download Image
            </a>
          </div>
        </div>
      );
  }
}
