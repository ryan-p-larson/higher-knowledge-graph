import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {active: "Department"};

    // undefined functions
    this.createButton = this.createButton.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      active: props.active,
      handleToggle: props.handleToggle
    });
  }

  createButton(d) {
    var highlight = this.state.active === d.text;
    var style = (highlight) ? 'btn btn-primary' : 'btn btn-outline-secondary';
    return <button key={d.text} value={d.text} type="button" className={style} onClick={this.state.handleToggle}>{d.text}</button>;
  }

  render() {
    let buttons = [{text: "Department"}, {text: "Major"}, {text: "Course"}]
      .map(d => this.createButton(d));
    return (
        <div className="col-xs-4 text-center">
            {buttons}
        </div>
      );
  }
}