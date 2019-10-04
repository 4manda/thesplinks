import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import FixedBack from 'src/components/lib/FixedBack';
import RegisterForm from 'src/components/auth/RegisterForm';
import { register } from 'src/actions/userSession';

export class Register extends React.Component {
  render() {
    return (
      <FixedBack className="page__register authenticate-box">
        <RegisterForm
          error={ this.props.error }
          register={ this.props.register }
          history={ this.props.history }
        />
        <Segment tertiary>
          <div>Already have an account or invite secret?{ ' ' }</div>
          <div>
            <Link to="/login" className="link--login">Login</Link>
            { ' ' }or{ ' ' }
            <Link to="/secret" className="link--secret">Enter Secret</Link>
          </div>
        </Segment>
      </FixedBack>
    );
  }
}

Register.propTypes = {
  error: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  error: !state.globalState.isOnline ? 'offline' : state.globalState.error,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({ register }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register);
