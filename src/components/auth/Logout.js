import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Segment } from 'semantic-ui-react';

class Logout extends React.Component {
  constructor() {
    super();
    this._handleLogoutClick = this._handleLogoutClick.bind(this);
    this._handleGoBack = this._handleGoBack.bind(this);
  }

  _handleLogoutClick(e) {
    e.preventDefault();
    this.props.logout();
    this.props.history.push({ pathname: '/' });
  }

  _handleGoBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const logoutFormMarkup = () => {
      switch (this.props.contentType) {
        case 'page':
          return (
            <Segment className="page-logout">
              <p>Are you sure you would like to logout?</p>
              <Button
                onClick={ this._handleLogoutClick }
                content="Logout"
                className="logout-btn--logout"
              />
            </Segment>
          );
        default:
          return (
            <Modal className="page-logout--modal" defaultOpen onClose={ this._handleGoBack } closeIcon="close">
              <Modal.Header content="Logout" />
              <Modal.Content>
                Are you sure you want to logout?
              </Modal.Content>
              <Modal.Actions>
                <Button
                  content="Cancel"
                  onClick={ this._handleGoBack }
                  className="logout-btn--cancel"
                />
                <Button
                  content="Logout"
                  onClick={ this._handleLogoutClick }
                  className="logout-btn--logout"
                />
              </Modal.Actions>
            </Modal>
          );
      }
    };

    return (
      <div>{ logoutFormMarkup() }</div>
    );
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  contentType: PropTypes.string,
};

Logout.defaultProps = {
  contentType: 'modal',
};

export default Logout;
