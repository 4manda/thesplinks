import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Table, Button, Input } from 'semantic-ui-react';

export class PropertyTable extends React.Component {
  render() {
    return (
      <Table
        definition
        collapsing
        className="component__centered"
        renderBodyRow={ (row, idx) => ({
          key: row[0],
          cells: [
            { key: row[0], content: row[0], textAlign: 'right' },
            { key: row[1], content: <Input transparent value={ row[1] } /> },
          ],
        }) }
        tableData={ this.props.tableData }
      />
    );
  }
}

PropertyTable.propTypes = {
  tableData: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    if (!_.isArray(propValue[key]) || propValue[key].length !== 2) {
      return new Error(
        `Invalid prop ${propFullName} supplied to ${componentName}. Expected an array of arrays of length 2.`
      );
    }
  }).isRequired,
};

export default PropertyTable;
