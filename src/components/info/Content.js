import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header } from 'semantic-ui-react';
import FixedBack from 'src/components/lib/FixedBack';

export class Content extends React.Component {
  render() {
    const sections = this.props.sections.map(sec => {
      if (sec.hidden) return null;
      return (
        <Segment basic key={ sec.title }>
          <Header as="h3">
            { sec.title }
            <Header.Subheader>{ sec.description }</Header.Subheader>
          </Header>
          { sec.content }
        </Segment>
      );
    });
    if (this.props.isMainPage) {
      return (
        <Segment
          basic
          className={ `${this.props.className} page__${this.props.name}` }>
          { sections }
        </Segment>
      );
    }
    return (
      <FixedBack
        segment
        textAlign="left"
        header={ this.props.title }
        className={ `${this.props.className} page__${this.props.name}` }>
        { sections }
      </FixedBack>
    );
  }
}

Content.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  component: PropTypes.func,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.node,
    }).isRequired,
  ),
  className: PropTypes.string,
  isMainPage: PropTypes.bool,
};

Content.defaultProps = {
  className: '',
  isMainPage: false,
};

export default Content;
