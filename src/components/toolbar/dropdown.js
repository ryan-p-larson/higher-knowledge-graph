import React from 'react';

import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
      value: "one",
      placeholder: 'Select...'
    };

    // Bind Functions
    this.handleChange = this.handleChange.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
  }

  handleChange(event) {
    console.log(event.value);
    if (event !== null) this.setState({value: event.value});
  }

  filterOptions() {
    const option = this.state.options;
    return createFilterOptions(option);
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.data !== undefined) {
          return this.setState({
            options: nextProps.data,
            placeholder: nextProps.placeholder
          });
      }
  }

  render() {
    
    return (
      <Select
        name="form-field-name"
        value={this.state.value}  //"PSY:1001"
        //resetValue="one"
        options={this.state.options}
        placeholder={this.state.placeholder}
        onChange={this.props.callback}
        //onChange={this.handleChange}
      />
      );
  }
}