import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';

export class Splash extends React.Component {
  render() {
    return (
      <Segment basic textAlign="center" className="page--secret height-100 width--450px component__centered">
        <Header as="h1">
          The Splinks Wedding
        </Header>
      </Segment>
    );
  }
}

export default Splash;
