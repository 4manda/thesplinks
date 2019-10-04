import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Segment, Header, Button } from 'semantic-ui-react';
import { PropertyTable } from 'src/components/lib';
import { snakeCaseObject, convertLocationToComposite } from 'kit/lib/utils';

export class ObjectSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      primaryObj: props.primaryObj,
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.primaryObj, prevProps.primaryObj)) {
      this.setState({ primaryObj: this.props.primaryObj });
    }
  }

  _handleChange = (e, { name, value, checked, type }) => {
    const copy = _.cloneDeep(this.state.primaryObj);
    if (type === 'checkbox') {
      _.set(copy, name, checked); 
    } else {
      _.set(copy, name, value); 
    }
    this.setState({ primaryObj: copy });
  }

  _handleClickEdit = () => {
    this.setState({ isEditing: true });
  }

  _handleClickCancel = () => {
    this.setState({
      isEditing: false,
      primaryObj: this.props.primaryObj,
    });
  }

  _handleClickSave = () => {
    const bodyArgs = _.mapValues(snakeCaseObject(this.state.primaryObj), (val, key) => {
      if (val && val.address1) {
        return convertLocationToComposite(val);
      }
      return val;
    });

    this.props.updateObj({
      queryParams: `${_.snakeCase(this.props.pkey)}=eq.${this.props.primaryObj[this.props.pkey]}`,
      bodyArgs,
    });
    this.setState({ isEditing: false });
  }

  render() {
    const {
      primaryObj,
      primaryObjName,
      headerText,
      editableData,
      otherObjs,
      otherData,
    } = this.props;

    return (
      <Segment basic className={ `${_.kebabCase(primaryObjName)}-summary` }>
        <Header>{ headerText(primaryObj) }</Header>
        <Segment vertical>
          <Header as="h4" textAlign="center">
            { _.startCase(primaryObjName) } Summary
            { this.state.isEditing ? (
              <Button.Group floated="right">
                <Button primary onClick={ this._handleClickSave } content="Save" />
                <Button onClick={ this._handleClickCancel } content="X" title="Cancel"/>
              </Button.Group>
            ) : (
              <Button floated="right" onClick={ this._handleClickEdit } content="Edit" />
            ) }
          </Header>
          <PropertyTable
            isEditing={ this.state.isEditing }
            handleChange={ this._handleChange }
            propObj={ this.state.primaryObj }
            tableData={ editableData }
          />
        </Segment>
        { !!otherObjs && !!otherData && (
          <Segment vertical>
            <Header as="h4" textAlign="center">Other Details</Header>
            <PropertyTable
              propObj={{
                ...otherObjs,
                [primaryObjName]: primaryObj,
              }}
              tableData={ otherData }
            />
          </Segment>
        ) }
      </Segment>
    );
  }
}

ObjectSummary.propTypes = {
  primaryObj: PropTypes.object.isRequired,
  primaryObjName: PropTypes.string.isRequired,
  pkey: PropTypes.string.isRequired,
  updateObj: PropTypes.func.isRequired,
  headerText: PropTypes.func.isRequired,
  editableData: PropTypes.arrayOf(PropTypes.array),
  otherObjs: PropTypes.object,
  otherData: PropTypes.arrayOf(PropTypes.array),
};

export default ObjectSummary;
