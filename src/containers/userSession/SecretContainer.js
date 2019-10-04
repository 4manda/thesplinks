import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import FixedBack from 'src/components/lib/FixedBack';
import SecretForm from 'src/components/auth/SecretForm';
import apiActions from 'src/actions/api';

export class Secret extends React.Component {
  render() {
    const { currentUserGroup, currentUser, insertMember, error, isAppOnline } = this.props;
    return (
      <FixedBack className="page__secret authenticate-box">
        <SecretForm
          currentUserGroup={ currentUserGroup }
          error={ error }
          insertMember={ insertMember }
        />
        <Segment tertiary hidden>
          { currentUser ? (
            <div>
              Go back to your{ ' ' }
              <Link to="/user" className="link--user">User Account</Link>
            </div>
          ) : (
            <div>
              <div>Want to create your own account or already have one?</div>
              <Link to="/register" className="link--register">Register</Link>
              { ' ' } or { ' ' }
              <Link to="/login" className="link--login">Login</Link>
            </div>
          ) }
        </Segment>
      </FixedBack>
    );
  }
}

Secret.propTypes = {
  currentUserGroup: PropTypes.string,
  currentUser: PropTypes.string,
  error: PropTypes.string.isRequired,
  insertMember: PropTypes.func.isRequired,
};

Secret.defaultProps = {
  currentUserGroup: undefined,
  currentUser: undefined,
};

const mapStateToProps = state => ({
  error: !state.globalState.isOnline ? 'offline' : state.globalState.error,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    insertMember,
  } = apiActions[ownProps.currentUser ? 'citizenActions' : 'publicActions'];

  return bindActionCreators({
    insertMember,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Secret);
