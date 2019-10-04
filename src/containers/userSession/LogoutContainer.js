import Logout from 'src/components/auth/Logout';
import { logout } from 'src/actions/userSession';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  null,
  mapDispatchToProps,
)(Logout);
