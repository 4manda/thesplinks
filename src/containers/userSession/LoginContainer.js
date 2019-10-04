import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import FixedBack from 'src/components/lib/FixedBack';
import { featureIsActive } from 'kit/lib/utils';
import LoginForm from 'src/components/auth/LoginForm';
import { signIn } from 'src/actions/userSession';

export class Login extends React.Component {
  render() {
    return (
      <FixedBack className="page__login authenticate-box">
        <LoginForm
          error={ this.props.error }
          signIn={ this.props.signIn }
        />
        <Segment tertiary>
          <div>Don&apos;t have an account?</div>
          <div>
            <Link to="/register" className="link--register">Register</Link>
            { ' ' }or{ ' ' }
            <Link to="/secret" className="link--secret">Provide Secret Code</Link>
          </div>
        </Segment>
        { featureIsActive('forgotUserPass') && (
          <Segment tertiary>
            <div>Did you forget something?</div>
            <Link to="/usernamehelp">username</Link>
            { ' ' }or{ ' ' }
            <Link to="/passwordhelp">password</Link>
          </Segment>
        ) }
      </FixedBack>
    );
  }
}

Login.propTypes = {
  error: PropTypes.string.isRequired,
  signIn: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  error: !state.globalState.isOnline ? 'offline' : state.globalState.error,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signIn,
  }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
