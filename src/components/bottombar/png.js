import React            from 'react';
import * as saveSvgAsPng from 'save-svg-as-png';

import 'bootstrap/dist/css/bootstrap.css';


/**
  * @class
  * @description React Component to download SVG as PNG.
  * @returns Bootstrap button with onClick functionality.
  */
export default class extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.setStyle = this.setStyle.bind(this);
  }

  /**
    * @method
    * @description Method to download our SVG as an image.
    * @param {string} active - Formatted label of active view.
    * @returns {.png} Image file of current view.
    */
  onClick(active) {
    // check validity
    if (active.slice(0, 6) === 'Select') return;

    let f = active + '.png';
    let opts = {
      backgroundColor: '#ffffff',
      encoderOptions: 0.9,
      width: 960,
      height: 500
    }
    return saveSvgAsPng.saveSvgAsPng(document.getElementById('sankeyChart'), f, opts);
  }

  /**
    * @method
    * @description Method to set button style as active or disabled.
    * @param {string} active - Formatted label of active view.
    * @returns {string} css class for download button.
    */
  setStyle(active) {
    let base_style = 'pull-right btn btn-outline-primary'

    // Loading/prompts don't display anything. Thus they're disabled
    if (active.slice(0, 6) === 'Select') return base_style + ' disabled';
    return base_style;
  }


  render() {
    let active = this.props.active;
    return (
      <a 
        className={this.setStyle(active)}
        title="Click this button to download an image of the current chart."
        onClick={() => this.onClick(active)}
      >
        <span className="glyphicon glyphicon-cloud-download"></span> Download Image
      </a>
      );
  }
}
