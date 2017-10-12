import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

/**
  * @class
  * @description React component to create a trio of radio toggle buttons.
  * @param {method} handleButton - Method from our parent toolbar, to handle change
  * @returns Component with radio buttons and a parent defined callback.
  */
export default class extends React.Component {
  constructor(props) {
    super(props);
    // Bind functions
    this.state = {handleButton: props.handleButton};
    this.createButton = this.createButton.bind(this);
  }

  /**
    * @method
    * @description Creates a button for a 'explore' view
    * @param {string} d - String specifying our view button to create
    * @param {string} active - Currently active view, used to select button style
    * @returns {<button>} - HTML Button.
    */
  createButton(d, active) {
    const style = (d) => {
      let view_style = {
        'Department': 'btn-warning',
        'Major': 'btn-success',
        'Course': 'btn-info'
      };
      let btn_style = (d === active) ? view_style[d]+' active' : view_style[d];
      return  'btn ' + btn_style + ' viewBtn';
    }
    return (
        <button key={d} value={d} type="radio" className={style(d)} onClick={this.state.handleButton}>{d}</button>
    );
  }

  render() {
    let buttons = ["Department", "Major", "Course"].map(d => this.createButton(d, this.props.active));
    return (
<<<<<<< HEAD
        <div className="col-xs-12 col-md-6 col-lg-4 text-center viewButtons">
=======
        <div className="col-xs-12 col-md-4 text-center viewButtons">
>>>>>>> 39f7e283836eb4dbbf1162a29ac9a47c6f09840e
          <div className="btn-group" role="group" aria-label="Data views">
            {buttons}
          </div>
        </div>
      );
  }
}
