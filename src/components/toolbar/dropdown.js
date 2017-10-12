import React from 'react';

import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

export default class extends React.Component {

  /**
    * @constructor
    * @description Creates a dropdown object which can be used to search or select.
    * @returns React-select component ready to be populated.
    */
  constructor() {
    super();

    // Bind Functions to React Component
    this.filterOptions = this.filterOptions.bind(this);
  }

  /**
    * @method
    * @description Creates an array of options for react-select-fast-filter-options,
    * so the dropdown can have a faster lookup.
    * @param {array} options - Our state options.
    * @returns Options for our dropdown's fast-select.
    */
  filterOptions() {
    const option = this.props.options;
    return createFilterOptions(option);
  }

  /**
    * @method
    * @description Method permitting Component to update. Only updates if the props
    * contain our data. Otherwise we just have empty dropdowns.
    * @this this refers to our dropdown component.
    * @returns Sets our component state to reflect our incoming data.
    */
  componentWillReceiveProps(nextProps) {
      return nextProps.options !== undefined;
  }

  /**
    * @method
    * @description Renders the Dropwdown component.
    * @returns Div containing only the dropdown and it's options.
    */
  render() {
    // custom arrows for search bar
    let custom_arrow = () => <span className="glyphicon glyphicon-search"></span>;

    return (
      <Select
        name="searchbar"
        maxHeight={300}
        optionHeight={30}
        options={this.props.options}

        value={this.props.value}
        resetValue={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.callback}
        arrowRenderer={custom_arrow}
      />
      );
  }
}
