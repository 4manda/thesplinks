import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header } from 'semantic-ui-react';

export class FixedBack extends React.Component {
  render() {
    return (
      <Segment
        basic
        textAlign={ this.props.textAlign }
        className={ `${this.props.className} fixed-back__container` }>
        <div className="fixed-back__image" />
        { this.props.segment ? (
          <Segment
            style={{ maxWidth: this.props.innerWidth }}
            className="fixed-back__content component__centered">
            <Header as="h2" textAlign="center">{ this.props.header }</Header>
            { this.props.children }
          </Segment>
        ) : this.props.children }
      </Segment>
    );
  }
}

FixedBack.propTypes = {
  header: PropTypes.string,
  className: PropTypes.string,
  innerWidth: PropTypes.string,
  textAlign: PropTypes.string,
  children: PropTypes.node,
  segment: PropTypes.bool,
};

FixedBack.defaultProps = {
  header: '',
  className: '',
  innerWidth: '95%',
  textAlign: 'center',
  children: <div />,
  segment: false,
};

export default FixedBack;
