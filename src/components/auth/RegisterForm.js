import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Message } from 'semantic-ui-react';
import {
  REG_NAME,
  REG_INITIAL,
  REG_EMAIL,
  REG_USERNAME,
} from 'src/constants';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      middle: '',
      last: '',
      username: '',
      email: '',
      password: '',
      error: props.error || '',
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleSubmit() {
    if (!REG_USERNAME.test(this.state.username)) {
      return this.setState({ error: 'Please only use a-z, A-Z, 0-9 and _ for your username.' });
    }
    if (!REG_EMAIL.test(this.state.email)) {
      return this.setState({ error: 'Please provide a valid email.' });
    }
    const name = `${this.state.first} ${this.state.middle}${this.state.middle ? ' ' : ''}${this.state.last}`;
    return this.props.register(
      this.state.username,
      name,
      this.state.email,
      this.state.password,
    ).then(action => {
      if (action.type === 'REGISTER_SUCCESS') {
        this.setState({ error: '' });
        this.props.history.push('/');
      } else {
        this.setState({
          password: '',
          error: 'Error creating the account.',
        });
      }
    });
  }

  _handleChange(e, { name, value }) {
    if (value !== '') {
      switch (name) {
        case 'first':
        case 'last': {
          if (!REG_NAME.test(value)) return;
          break;
        }
        case 'middle': {
          if (!REG_INITIAL.test(value)) return;
          break;
        }
        default:
      }
    }
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Form onSubmit={ this._handleSubmit } className="form--register">
        <Message
          compact
          error
          content={ this.state.error }
          visible={ !!this.state.error }
          attached="top"
        />
        <Segment attached={ this.state.error ? 'bottom' : false }>
          <Form.Group inline unstackable>
            <Form.Input
              required
              name="first"
              type="text"
              icon="user"
              iconPosition="left"
              value={ this.state.first }
              title="First Name"
              placeholder="First"
              onChange={ this._handleChange }
              fluid
              width={ 7 }
            />
            <Form.Input
              name="middle"
              type="text"
              value={ this.state.middle }
              title="Middle Initial"
              placeholder="M"
              onChange={ this._handleChange }
              fluid
              width={ 3 }
            />
            <Form.Input
              required
              name="last"
              type="text"
              value={ this.state.last }
              title="Last Name"
              placeholder="Last"
              onChange={ this._handleChange }
              fluid
              width={ 6 }
            />
          </Form.Group>
          <Form.Input
            required
            fluid
            name="username"
            type="text"
            icon="user"
            iconPosition="left"
            value={ this.state.username }
            placeholder="Username"
            onChange={ this._handleChange }
          />
          <Form.Input
            required
            name="email"
            type="email"
            icon="mail"
            iconPosition="left"
            value={ this.state.email }
            placeholder="email@example.com"
            onChange={ this._handleChange }
          />
          <Form.Input
            required
            name="password"
            type="password"
            icon="lock"
            iconPosition="left"
            value={ this.state.password }
            placeholder="Password"
            onChange={ this._handleChange }
            autoComplete="off"
          />
          <Form.Button
            fluid
            primary
            disabled={
              !this.state.first || !this.state.last || !this.state.username ||
              !this.state.email || !this.state.password
            }
            content="Submit"
          />
        </Segment>
      </Form>
    );
  }
}

RegisterForm.propTypes = {
  error: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default RegisterForm;
