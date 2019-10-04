import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Segment, Form, List, Message, Loader, Header } from 'semantic-ui-react';
import { frontEndTwilioPhoneNumberValidator } from 'kit/lib/utils';
import {
  REG_NAME,
  REG_PHONE,
  REG_EMAIL,
} from 'src/constants';

const findInviteForms = {
  name: {
    order: 0,
    header: 'Please enter your name',
    onSubmit: '_findInviteByName',
    values: [
      { title: 'firstName', required: true },
      { title: 'lastName', required: true},
    ],
  },
  email: {
    order: 1,
    header: 'Please enter your email address.',
    onSubmit: '_findInviteByEmail',
    values: [{ title: 'email', type: 'email', required: true }],
  },
  mobile: {
    order: 2,
    header: 'Please enter your mobile phone number.',
    onSubmit: '_findInviteByMobile',
    values: [{
      title: 'mobilePhone',
      type: 'phone',
      placholder: 'xxx-xxx-xxxx',
      required: true,
    }],
  },
  address: {
    order: 3,
    header: 'Please enter the street address that the invite was sent to.',
    onSubmit: '_findInviteByAddress',
    values: [{ title: 'streetAddress', required: true }],
  },
  'no-match': {
    order: 4,
    header: 'We could not locate your invitation with the information you provided.',
  },
  code: {
    order: 5,
    header: '',
    onSubmit: '_submitCodeVerification',
    values: [{ title: 'verificationCode', required: true }],
  },
};

export class GetRsvpForm extends React.Component {
  constructor(props) {
    super(props);
    const { page } = props.match.params;
    const { error, warning } = props.location.state || {};
    let currentForm = 'name';
    if (page) {
      currentForm = page;
    } else if (props.memberEventInvitees[0]) {
      currentForm = 'code';
    } else if (props.member.memberLocation) {
      currentForm = 'no-match';
    } else if (props.member.memberMobile) {
      currentForm = 'address';
    } else if (props.member.memberEmail) {
      currentForm = 'mobile';
    } else if (props.member.firstName && props.member.lastName) {
      currentForm = 'email';
    }
    this.state = {
      currentForm,
      firstName: props.member.firstName || '',
      lastName: props.member.lastName || '',
      email: props.member.memberEmail || '',
      mobilePhone: props.member.memberMobile || '',
      streetAddress: props.member.memberLocation ? props.member.memberLocation.address1 : '',
      verificationCode: '',
      error: error || '',
      warning: warning || '',
    };
    this._handleChange = this._handleChange.bind(this);
    this._findInviteByName = this._findInviteByName.bind(this);
    this._findInviteByEmail = this._findInviteByEmail.bind(this);
    this._findInviteByMobile = this._findInviteByMobile.bind(this);
    this._findInviteByAddress = this._findInviteByAddress.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const { error, warning } = this.props.location.state || {};
    if (!_.isEqual(page, prevProps.match.params.page) && page) {
      this.setState({
        error: error || '',
        warning: warning || '',
        currentForm: page,
      });
    }
    if (this.props.memberEventInvitees[0] && !prevProps.memberEventInvitees[0]) {
      this.setState({
        email: this.props.member.memberEmail,
        currentForm: 'code',
      });
    }
  }

  _handleChange(e, { name, value }) {
    if (this.state.warning) {
      this.setState({ warning: '' });
    }
    this.setState({ [name]: value });
  }

  _handleUpdateMemberResponse = action => {
    if (action.type === 'UPDATE_MEMBER_SUCCESS') {
      this.props.trySelectInvitations(this.props.member).then(act => {
        if (act.type === 'SELECT_MEMBER_EVENT_INVITEE_SUCCESS') {
          const match = _.find(act.response, ['memberUuid', this.props.member.memberUuid]);
          if (match) {
            // Handle successful match when verification required
            this.props.history.push({
              pathname: '/rsvp',
              state: {
                form: 'code',
                warning: '',
                error: '',
              },
            });
          } else {
            const nextForm = _.findKey(findInviteForms, f => (
              f.order === findInviteForms[this.state.currentForm].order + 1
            ));
            this.props.history.push({
              pathname: `/rsvp/${nextForm}`,
              state: {
                warning: this.state.currentForm,
              },
            });
          }
        } else {
          const nextForm = _.findKey(findInviteForms, f => (
            f.order === findInviteForms[this.state.currentForm].order + 1
          ));
          this.props.history.push({
            pathname: `/rsvp/${nextForm}`,
            state: {
              warning: this.state.currentForm,
            },
          });
        }
      });
    } else {
      this.setState({
        error: <div>Beep, bop, boop. An error occurred. Please try again, or <Link to="/home/contact">contact us</Link> directly.</div>,
        warning: '',
        currentForm: 'no-match',
      });
      this.props.history.push({
        pathname: '/rsvp/no-match',
      });
    }
  }

  _findInviteByName() {
    if (
      REG_NAME.test(this.state.firstName.trim()) &&
      REG_NAME.test(this.state.lastName.trim())
    ) {
      return this.props.updateMember({
        bodyArgs: {
          first_name: this.state.firstName.trim(),
          last_name: this.state.lastName.trim(),
        },
      }).then(this._handleUpdateMemberResponse);
    }
    return this.setState({ error: 'Name as wrong format' });
  }

  _findInviteByEmail() {
    if (REG_EMAIL.test(this.state.email.trim())) {
      return this.props.updateMember({
        bodyArgs: { member_email: this.state.email.trim() },
      }).then(this._handleUpdateMemberResponse);
    }
    return this.setState({ error: 'Please enter a valid email.' });
  }

  _findInviteByMobile() {
    // if (frontEndTwilioPhoneNumberValidator(this.state.mobile)) {
    if (REG_PHONE.test(this.state.mobilePhone.trim())) {
      return this.props.updateMember({
        bodyArgs: { member_mobile: this.state.mobilePhone.trim() },
      }).then(this._handleUpdateMemberResponse);
    }
    return this.setState({ error: 'Please enter a valid mobile phone number.' });
  }

  _findInviteByAddress() {
    if (this.state.streetAddress.trim()) {
      this.props.updateMember({
        bodyArgs: { member_location: `(${this.state.streetAddress.trim()},,,,,,,,,)` },
      }).then(this._handleUpdateMemberResponse);
    }
    return this.setState({ error: 'Please enter a street address' });
  }

  _submitCodeVerification = () => {
    if (this.state.verificationCode.trim()) {
      this.props.validateEmail(
        this.state.verificationCode.trim(),
        this.props.member.memberUuid,
        this.props.memberEventInvitees[0].memberEventInviteeUuid,
      );
    }
  }

  render() {
    if (!_.keys(findInviteForms).includes(this.state.currentForm)) {
      return <Redirect to="/rsvp" />;
    }
    let body;
    const page = findInviteForms[this.state.currentForm];
    if (this.state.currentForm === 'no-match') {
      body = (
        <Segment basic>
          <Segment basic vertical compact className="component__centered" textAlign="left">
            <List relaxed>
              { [
                { name: 'name', value: `${this.state.firstName} ${this.state.lastName}` },
                { name: 'email', value: `${this.state.email}` },
                { name: 'mobile', value: `${this.state.mobilePhone}` },
                { name: 'address', value: `${this.state.streetAddress}` },
              ].map((content, index) => (
                <List.Item key={ content.name }>
                  { _.startCase(content.name) }: { content.value }
                  <List.Content floated="right">
                    <Link to={ `/rsvp/${content.name}` }>edit</Link>
                  </List.Content>
                </List.Item>
              )) }
            </List>
          </Segment>
          <Segment basic>
            <div>We may be experiencing technical issues. Please try again later.</div>
            <div>Feel free to also <Link to="/home/contact">contact us</Link> directly.</div>
          </Segment>
        </Segment>
      );
    } else {
      if (this.state.currentForm === 'verificationCode') {
        page.header = `We found a match! We just need to verify that it is you. A code was sent to ${this.props.member.memberEmail}. Please submit that code to view and update your invitation.`;
      }
      body = (
        <Form onSubmit={ this[page.onSubmit] }>
          <Form.Group inline unstackable>
            { page.values.map(val => {
              return (
                <Form.Input
                  key={ val.title }
                  required={ val.required }
                  name={ val.title }
                  type={ val.type || 'text' }
                  value={ this.state[val.title] }
                  title={ _.startCase(val.title) }
                  placeholder={ val.placeholder || _.startCase(val.title) }
                  onChange={ this._handleChange }
                  fluid={ page.values.length > 1 }
                  width={ page.values.length > 1 ? 8 : 16 }
                />
              );
            }) }
          </Form.Group>
          <Form.Button
            primary
            disabled={ page.values.some(val => val.required && !this.state[val.title]) }
            content="Submit"
          />
        </Form>
      );
    }
    return (
      <div>
        { this.state.warning && this.state.currentForm !== 'no-match' && (
          <Message warning>
            <div>Sorry, we did not find an invitation that matched</div>
            <List>
              { findInviteForms[this.state.warning].values.map(val => (
                <List.Item key={ val.title }>{ _.startCase(val.title) }: { this.state[val.title] }</List.Item>
              )) }
            </List>
            <div><Link to={ `/rsvp/${this.state.warning}` }>Go Back</Link></div>
          </Message>
        ) }
        <Segment basic className={ `get-rsvp__${this.state.currentForm}` }>
          <Header as="h4">{ page.header }</Header>
          { body }
        </Segment>
        { this.state.error && <Message error content={ this.state.error } /> }
      </div>
    );
  }
}

GetRsvpForm.propTypes = {
  member: PropTypes.object.isRequired,
  memberEventInvitees: PropTypes.array.isRequired,
  validateEmail: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  trySelectInvitations: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default GetRsvpForm;
