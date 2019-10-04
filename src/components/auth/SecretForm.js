import React from 'react';
import PropTypes from 'prop-types';
import { MD5 } from 'crypto-js';
import { Form, Segment, Message } from 'semantic-ui-react';

const errorMessages = {
  offline: 'You are currently offline. Please connect to the internet.',
  error: 'Technical Issues. Please try again later.',
  unauthorized: 'Unauthorized. Verify that you have the correct secret and try again.',
};
class SecretForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: '',
      userGroup: '',
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleSubmit() {
    const secret = this.state.secret; //MD5(this.state.secret).toString();
    return this.props.insertMember({
      headers: {
        'X-Secret': secret,
        ...!this.props.currentUserGroup && { 'X-Group': this.state.userGroup },
      },
      payload: { secret },
    }).then(action => {
      if (action.type === 'INSERT_MEMBER_FAIL') {
        this.setState({ secret: '' });
      }
    });
  }

  _handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Form className="form--secret" onSubmit={ this._handleSubmit }>
        <Segment attached="top">
          To view the event, enter the secret from the back of your invite.
        </Segment>
        <Segment attached={ this.props.error ? true : 'bottom' }>
          { !this.props.currentUserGroup && (
            <Form.Input
              required
              fluid
              name="userGroup"
              id="input-user-group"
              type="text"
              icon="users"
              iconPosition="left"
              value={ this.state.userGroup }
              placeholder="WeddingPartyName.com"
              onChange={ this._handleChange }
            />
          ) }
          <Form.Input
            required
            fluid
            name="secret"
            id="input-secret"
            type="text"
            icon="lock"
            iconPosition="left"
            value={ this.state.secret }
            placeholder="secret"
            onChange={ this._handleChange }
          />
          <Form.Button
            fluid
            primary
            content="Submit Secret"
            disabled={ !this.state.secret && (
              !this.props.currentUserGroup || !this.state.userGroup
            ) }
          />
        </Segment>
        <Message
          compact
          error
          content={ errorMessages[this.props.error] }
          visible={ !!this.props.error }
          attached="bottom"
        />
      </Form>
    );
  }
}

SecretForm.propTypes = {
  error: PropTypes.string.isRequired,
  currentUserGroup: PropTypes.string,
  insertMember: PropTypes.func.isRequired,
};

SecretForm.defaultProps = {
  currentUserGroup: undefined,
};

export default SecretForm;
