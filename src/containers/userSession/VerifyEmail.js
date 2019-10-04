import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { verifyEmail } from 'src/actions/userSession';
import apiActions from 'src/actions/api';

const { selectUserInvite } = apiActions.citizenActions;

export class VerifyEmail extends React.Component {
  componentDidMount() {
    this.props.verifyEmail(
      this.props.match.params.userEmailUuid,
      this.props.match.params.userEmailToken,
    ).then(action => {
      if (action.type === 'VERIFY_SUCCESS') {
        this.props.selectUserInvite({ defaultQuery: {} });
        this.props.history.push('/');
      }
    });
  }

  render() {
    return <div>Verifying your account...</div>;
  }
}

VerifyEmail.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  selectUserInvite: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    verifyEmail,
    selectUserInvite,
  }, dispatch)
);

export default connect(
  null,
  mapDispatchToProps,
)(VerifyEmail);
