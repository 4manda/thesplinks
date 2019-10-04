import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message, Segment } from 'semantic-ui-react';

const errorMessages = {
  offline: 'You are currently offline. Please connect to the internet to login.',
  error: 'Technical Issues. Please try again later.',
  unauthorized: 'Unauthorized. Please verify that you have the correct username and password.',
};

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      staySignedIn: true,
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleSubmit() {
    this.props.signIn(
      this.state.username,
      this.state.password,
    ).then(action => {
      if (action.type === 'SIGN_IN_FAIL') {
        this.setState({ password: '' });
      }
    });
  }

  _handleChange(e, { name, value, type, checked }) {
    e.preventDefault();
    if (type === 'checkbox') {
      this.setState({ [name]: checked });
    } else {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form className="form--login" onSubmit={ this._handleSubmit }>
        <Message
          compact
          error
          content={ errorMessages[this.props.error] }
          visible={ !!this.props.error }
          attached="top"
        />
        <Segment attached={ this.props.error ? 'bottom' : false }>
          <Form.Input
            required
            fluid
            name="username"
            id="input-username"
            type="text"
            icon="user"
            iconPosition="left"
            value={ this.state.username }
            placeholder="Username"
            onChange={ this._handleChange }
          />
          <Form.Input
            required
            fluid
            name="password"
            type="password"
            icon="lock"
            iconPosition="left"
            value={ this.state.password }
            placeholder="Secret Password"
            onChange={ this._handleChange }
            autoComplete="off"
          />
          <Form.Button
            fluid
            primary
            content="Login"
            disabled={ !this.state.username || !this.state.password }
          />
          <Form.Checkbox
            label="Stay signed in on this device"
            name="staySignedIn"
            className="checkbox--stay"
            checked={ this.state.staySignedIn }
            onChange={ this._handleChange }
          />
        </Segment>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  error: PropTypes.string.isRequired,
  signIn: PropTypes.func.isRequired,
};

export default LoginForm;
