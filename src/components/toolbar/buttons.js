import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {handleButton: props.handleButton};

    // Bind functions
    this.createButton = this.createButton.bind(this);
  }

  createButton(d, active) {
    const style = (d) => (d === active) ? 'btn btn-primary' : 'btn btn-outline-secondary';
    return (
        <button key={d} value={d} type="radio" className={style(d)} onClick={this.state.handleButton}>{d}</button>
    );
  }

  render() {
    let buttons = ["Department", "Major", "Course"].map(d => this.createButton(d, this.props.active));
    return (
        <div className="col-xs-4 text-center">
            {buttons}
        </div>
      );
  }
}
