/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';
import { Form, Grid, List, Image, Button, Header } from 'semantic-ui-react';
import apiActions from 'src/actions/api';

const {
  selectUserAccount,
  selectUserEmail,
  updateUserAccount,
  updateUserEmail,
  insertUserEmail,
  deleteUserEmail,
} = apiActions.citizenActions;

export class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ..._.cloneDeep(props),
      edit: false,
    };
    this._toggleEditing = this._toggleEditing.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._addEmail = this._addEmail.bind(this);
    this._deleteEmail = this._deleteEmail.bind(this);
    this._cancelEdit = this._cancelEdit.bind(this);
  }

  componentDidMount() {
    this.props.selectUserAccount();
    this.props.selectUserEmail();
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.fullName, this.props.fullName) ||
      !_.isEqual(nextProps.mobilePhone, this.props.mobilePhone) ||
      !_.isEqual(nextProps.address, this.props.address) ||
      !_.isEqual(nextProps.aptSuite, this.props.aptSuite) ||
      !_.isEqual(nextProps.city, this.props.city) ||
      !_.isEqual(nextProps.stateProvince, this.props.stateProvince) ||
      !_.isEqual(nextProps.zipPostal, this.props.zipPostal) ||
      !_.isEqual(nextProps.country, this.props.country) ||
      !_.isEqual(nextProps.userEmails, this.props.userEmails)
    ) {
      this.setState(_.cloneDeep(nextProps));
    }
  }

  _toggleEditing() {
    if (this.state.edit) {
      this._handleSubmit();
      this.setState(_.cloneDeep(this.props));
    }
    this.setState({ edit: !this.state.edit });
  }

  _handleChange(e, { name, value, checked, 'data-index': index }) {
    if (name === 'userEmail') {
      const userEmails = _.cloneDeep(this.state.userEmails);
      userEmails[index].userEmail = value;
      this.setState({ userEmails });
    } else if (name === 'primaryEmail') {
      const userEmails = this.state.userEmails.map((email, idx) => ({
        ...email,
        isPrimary: idx === index && (checked || email.isPrimary),
      }));
      this.setState({ userEmails });
    } else {
      this.setState({ [name]: value });
    }
  }

  _addEmail() {
    const userEmails = _.cloneDeep(this.state.userEmails);
    userEmails.push({
      userEmailUuid: '',
      userEmail: '',
      isPrimary: false,
    });
    this.setState({ userEmails });
  }

  _deleteEmail(index) {
    const userEmails = _.cloneDeep(this.state.userEmails);
    if (userEmails.length - 1 === index && !userEmails[index].userEmailUuid) {
      // remove last element in the array if not in original props
      userEmails.splice(index, 1);
    } else {
      delete userEmails[index];
    }
    this.setState({ userEmails });
  }

  _handleSubmit() {
    if (
      !_.isEqual(this.state.fullName, this.props.fullName) ||
      !_.isEqual(this.state.mobilePhone, this.props.mobilePhone) ||
      !_.isEqual(this.state.address, this.props.address) ||
      !_.isEqual(this.state.aptSuite, this.props.aptSuite) ||
      !_.isEqual(this.state.city, this.props.city) ||
      !_.isEqual(this.state.stateProvince, this.props.stateProvince) ||
      !_.isEqual(this.state.zipPostal, this.props.zipPostal) ||
      !_.isEqual(this.state.country, this.props.country)
    ) {
      this.props.updateUserAccount({
        queryParams: `username=eq.${this.props.username}`,
        bodyArgs: {
          full_name: this.state.fullName,
          mobile_phone: this.state.mobilePhone || '',
          address: this.state.address || '',
          apt_suite: this.state.aptSuite || '',
          city: this.state.city || '',
          state_province: this.state.stateProvince || '',
          zip_postal: this.state.zipPostal || '',
          country: this.state.country || '',
        },
        headers: { Prefer: 'return=representation' },
      });
    }
    if (!_.isEqual(this.state.userEmails, this.props.userEmails)) {
      _.forEach(this.state.userEmails, (email, idx) => {
        if (!email) {
          this.props.deleteUserEmail({
            queryParams: `user_email_uuid=eq.${this.props.userEmails[idx].userEmailUuid}`,
            headers: { Prefer: 'return=representation' },
          });
        } else if (email.userEmail.trim()) {
          if (!this.props.userEmails[idx]) {
            this.props.insertUserEmail({
              bodyArgs: {
                username: this.props.username,
                user_email: email.userEmail,
                is_primary: email.isPrimary,
              },
              headers: { Prefer: 'return=representation' },
            });
          } else if (!_.isEqual(email, this.props.userEmails[idx])) {
            this.props.updateUserEmail({
              queryParams: `user_email_uuid=eq.${email.userEmailUuid}`,
              bodyArgs: {
                user_email: email.userEmail,
                is_primary: email.isPrimary,
              },
              headers: { Prefer: 'return=representation' },
            });
          }
        }
      });
    }
  }

  _cancelEdit() {
    this.setState({
      ..._.cloneDeep(this.props),
      edit: false,
    });
  }

  render() {
    let page;
    if (this.state.edit) {
      page = (
        <Form>
          <Form.Group inline widths="equal">
            <Form.Field>
              <Image src={ this.props.userAccountPicture } avatar />
              <span>{ this.props.username }</span>
            </Form.Field>
            <Form.Input
              label="Full Name: "
              name="fullName"
              id="fullName"
              value={ this.state.fullName }
              onChange={ this._handleChange }
              required
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Input
              label="Mobile: "
              name="mobilePhone"
              id="mobilePhone"
              value={ this.state.mobilePhone || '' }
              onChange={ this._handleChange }
            />
          </Form.Group>
          <Form.Group inline widths="equal">
            <Form.Input
              label="Address: "
              name="address"
              id="address"
              value={ this.state.address || '' }
              onChange={ this._handleChange }
            />
            <Form.Input
              label="Apt/Suite: "
              name="aptSuite"
              id="aptSuite"
              value={ this.state.aptSuite || '' }
              onChange={ this._handleChange }
            />
          </Form.Group>
          <Form.Group inline widths="equal">
            <Form.Input
              label="City: "
              name="city"
              id="city"
              value={ this.state.city || '' }
              onChange={ this._handleChange }
            />
            <Form.Input
              label="State/Province: "
              name="stateProvince"
              id="stateProvince"
              value={ this.state.stateProvince || '' }
              onChange={ this._handleChange }
            />
            <Form.Input
              label="Zip/Postal: "
              name="zipPostal"
              id="zipPostal"
              value={ this.state.zipPostal || '' }
              onChange={ this._handleChange }
            />
            <Form.Input
              label="Country: "
              name="country"
              id="country"
              value={ this.state.country || '' }
              onChange={ this._handleChange }
            />
          </Form.Group>
          <Header>Emails: </Header>
          <List>
            { this.state.userEmails.map((email, idx) => {
              if (!email) {
                return null;
              }
              return (
                <List.Item key={ email.userEmailUuid }>
                  <Form.Group>
                    <Form.Input
                      name="userEmail"
                      data-index={ idx }
                      value={ email.userEmail }
                      onChange={ this._handleChange }
                    />
                    <Form.Checkbox
                      name="primaryEmail"
                      data-index={ idx }
                      checked={ email.isPrimary }
                      label="Primary"
                      onChange={ this._handleChange }
                    />
                    <a
                      href="#"
                      onClick={ () => this._deleteEmail(idx) }>
                      Delete
                    </a>
                  </Form.Group>
                </List.Item>
              );
            }) }
            <List.Item>
              <Button
                title="Add Email"
                content="+"
                onClick={ this._addEmail }
              />
            </List.Item>
          </List>
        </Form>
      );
    } else {
      page = (
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column>
              <Image src={ this.props.userAccountPicture } avatar />
              <span>{ this.props.username }</span>
            </Grid.Column>
            <Grid.Column>
              Full Name: { this.props.fullName }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              Mobile: { this.props.mobilePhone }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              Address: { this.props.address }
            </Grid.Column>
            <Grid.Column>
              Apartment/Suite: { this.props.aptSuite }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              City: { this.props.city }
            </Grid.Column>
            <Grid.Column>
              State/Province: { this.props.stateProvince }
            </Grid.Column>
            <Grid.Column>
              Zip: { this.props.zipPostal }
            </Grid.Column>
            <Grid.Column>
              Country: { this.props.country }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header>Emails: </Header>
              <List>
                { this.props.userEmails.map(email => (
                  <List.Item key={ email.userEmailUuid }>
                    { email.userEmail } { email.isPrimary ? '(Primary)' : '' }
                  </List.Item>
                )) }
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <div>
        <Header>
          <Button
            content={ this.state.edit ? 'submit' : 'edit' }
            primary={ this.state.edit }
            onClick={ this._toggleEditing }
            floated="right"
          />
          { this.state.edit ? (
            <Button
              content="cancel"
              onClick={ this._cancelEdit }
              floated="right"
            />
          ) : null }
          User Account Settings
        </Header>
        { page }
      </div>
    );
  }
}

UserSettings.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  userAccountPicture: PropTypes.string,
  mobilePhone: PropTypes.string,
  address: PropTypes.string,
  aptSuite: PropTypes.string,
  city: PropTypes.string,
  stateProvince: PropTypes.string,
  zipPostal: PropTypes.string,
  country: PropTypes.string,
  userEmails: PropTypes.array,
  selectUserAccount: PropTypes.func.isRequired,
  selectUserEmail: PropTypes.func.isRequired,
  updateUserAccount: PropTypes.func.isRequired,
  updateUserEmail: PropTypes.func.isRequired,
  insertUserEmail: PropTypes.func.isRequired,
  deleteUserEmail: PropTypes.func.isRequired,
};

UserSettings.defaultProps = {
  username: '',
  fullName: '',
  userAccountPicture: '',
  mobilePhone: '',
  address: '',
  aptSuite: '',
  city: '',
  stateProvince: '',
  zipPostal: '',
  country: '',
  userEmails: [],
};

const mapStateToProps = state => ({
  ...state.citizen.userAccounts[0],
  userEmails: state.citizen.userEmails,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    selectUserAccount,
    selectUserEmail,
    updateUserAccount,
    updateUserEmail,
    insertUserEmail,
    deleteUserEmail,
  }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettings);
/* eslint-enable jsx-a11y/anchor-is-valid */
