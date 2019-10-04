import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Table, Button, Checkbox, Input } from 'semantic-ui-react';

export class PropertyTable extends React.Component {
  render() {
    const valueContent = row => {
      const value = _.get(this.props.propObj, row[1]);
      if (row[2] === 'checkbox') {
        return (
          <Checkbox
            name={ row[1] }
            checked={ value }
            onChange={ this.props.handleChange }
            readOnly={ !this.props.isEditing }
            disabled={ !this.props.isEditing }
          />
        );
      }
      return this.props.isEditing ? (
        <Input
          transparent
          icon={{ name: 'pencil', color: 'blue' }}
          value={ value || value === 0 ? value : '' }
          placeholder={ row[0] }
          name={ row[1] }
          type={ row[2] || 'text' }
          onChange={ this.props.handleChange }
        />
      ) : value;
    }

    return (
      <Table
        unstackable
        definition
        collapsing
        className="component__centered"
        renderBodyRow={ (row, idx) => ({
          key: row[0],
          cells: [
            { key: row[0], content: row[0], textAlign: 'right' },
            { key: row[1], content: valueContent(row) },
          ],
        }) }
        tableData={ this.props.tableData }
      />
    );
  }
}

PropertyTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.array).isRequired,
  isEditing: PropTypes.bool,
  handleChange: PropTypes.func,
  propObj: PropTypes.object.isRequired,
};

PropertyTable.defaultProps = {
  isEditing: false,
};

export default PropertyTable;
