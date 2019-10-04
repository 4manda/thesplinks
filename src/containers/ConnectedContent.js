import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import FixedBack from 'src/components/lib/FixedBack';
import { getCurrentUserGroupState } from 'src/selectors';

export class ConnectedContent extends React.Component {
  render() {
    const Component = this.props.component;
    if (this.props.isMainPage) {
      return (
        <Component
          { ...this.props.userGroupState }
          className={ this.props.className }
          history={ this.props.history }
        />
      );
    }
    return (
      <FixedBack
        segment
        textAlign="left"
        header={ this.props.title }
        className={ `${this.props.className} page__${this.props.name}` }>
        <Component
          { ...this.props.userGroupState }
          className={ this.props.className }
          history={ this.props.history }
        />
      </FixedBack>
    );
  }
}

ConnectedContent.propTypes = {
  component: PropTypes.func.isRequired,
  userGroupState: PropTypes.shape({
    userGroup: PropTypes.object.isRequired,
    member: PropTypes.object.isRequired,
    events: PropTypes.array,
    venues: PropTypes.array,
  }).isRequired,
  className: PropTypes.string,
  history: PropTypes.object,
  isMainPage: PropTypes.bool,
};

ConnectedContent.defaultProps = {
  className: '',
  history: undefined,
  isMainPage: false,
};

const mapStateToProps = state => ({
  userGroupState: getCurrentUserGroupState(state),
});

export default connect(
  mapStateToProps,
)(ConnectedContent);
