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
    this.state = {
      options: [],
      value: "one",
      placeholder: 'Select...'
    };

    // Bind Functions to React Component
    this.handleChange = this.handleChange.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
  }

  /**
    * @method
    * @description Temporary method to change the value of the dropdown.
    * @param {event} - Event triggered by dropdown changing value.
    * @this This refers to the react-select dropdown object.
    * @returns A newly set state reflecting the changed value.
    */
  handleChange(event) {
    console.log(event.value);
    if (event !== null) this.setState({value: event.value});
  }

  /**
    * @method
    * @description Creates an array of options for react-select-fast-filter-options,
    * so the dropdown can have a faster lookup.
    * @param {array} options - Our state options.
    * @returns Options for our dropdown's fast-select.
    */
  filterOptions() {
    const option = this.state.options;
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
      if (nextProps.data !== undefined) {
          return this.setState({
            options: nextProps.data,
            placeholder: nextProps.placeholder
          });
      }
  }

  /**
    * @method
    * @description Renders the Dropwdown component.
    * @returns Div containing only the dropdown and it's options.
    */
  render() {
    return (
      <Select
        name="form-field-name"
        options={this.state.options}

        value={this.state.value}  //"PSY:1001"
        //resetValue="one"
        placeholder={this.state.placeholder}

        onChange={this.props.callback}
        //onChange={this.handleChange}
      />
      );
  }
}
