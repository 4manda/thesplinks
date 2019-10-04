import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import RsvpButton from 'src/containers/rsvp/RsvpButton';
import ConnectedContent from 'src/containers/ConnectedContent';
import Content from 'src/components/info/Content';
import content from 'src/content/group';
import { MOBILE_SCREEN_WIDTH } from 'src/constants';

const visiblePages = content.filter(p => p.inMainPage && !p.hidden);

class SinglePage extends React.Component {
  constructor() {
    super();
    this.state = {
      screenWidth: window.screen.width,
      width: window.innerWidth,
      height: window.innerHeight,
      bodyHeight: 0,
      topVisible: true,
    };
    this.lastScrollY = 0;
    this._handleScroll = this._handleScroll.bind(this);
    this._calculateScreenSize = this._calculateScreenSize.bind(this);
    this._handleResize = _.debounce(this._calculateScreenSize, 200);
    this.checkTopInterval = undefined;
//    this.scrollInterval = undefined;
  }

  componentDidMount() {
    window.addEventListener('load', this._scrollToMatch);
    window.addEventListener('resize', this._handleResize);
    this.checkTopInterval = setInterval(() => {
      if (this.lastScrollY === 0 && !this.state.topVisible) {
        this.setState({ topVisible: true });
      } else if (this.lastScrollY !== 0 && this.state.topVisible) {
        this.setState({ topVisible: false });
      }
    }, 300);
//    this.scrollInterval = setInterval(this._handleScroll, 10);
    this._calculateScreenSize();
    this._scrollToMatch();
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props.match.params;
    const navId = !!this.props.location.state && this.props.location.state.navHistoryId;
    const prevNavId = !!prevProps.location.state && prevProps.location.state.navHistoryId;
    if (
      !_.isEqual(navId, prevNavId) ||
      !_.isEqual(page, prevProps.match.params.page)
    ) {
      this._scrollToMatch();
    }
    if (this.container && (
      !_.isEqual(this.container.scrollHeight, this.state.bodyHeight) ||
      !_.isEqual(window.innerWidth, this.state.width) ||
      !_.isEqual(window.innerHeight, this.state.height)
    )) {
      this._calculateScreenSize();
    }
  }

  componentWillUnmount() {
    this._handleResize.cancel();
    clearInterval(this.checkTopInterval);
//    clearInterval(this.scrollInterval);
    window.removeEventListener('load', this._scrollToMatch);
    window.removeEventListener('resize', this._handleResize);
  }

  _scrollToMatch = () => {
    const { page } = this.props.match.params;
    if (visiblePages.map(p => p.name).includes(page)) {
      this[page].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (page) {
      this.props.history.push(`/home`);
    }
  }

  _calculateScreenSize() {
    this.setState({
      screenWidth: window.screen.width,
      width: window.innerWidth,
      height: window.innerHeight,
      bodyHeight: this.container ? this.container.scrollHeight : 0,
    });
  }

  _componentInViewPort = (el, height, currentTop) => {
    if (el.offsetTop > currentTop + height || el.offsetTop + height < currentTop) {
      return false;
    }
    return true;
  }

  _setPosition = (page, immediate = false) => {
    if (this[page.name] && this._componentInViewPort(this[page.name], this.state.height, this.lastScrollY)) {
      let offsetTop = this[page.name].offsetTop;
      if (offsetTop < 0) {
        offsetTop = 0;
      }
      if (page.speed > 1) {
        offsetTop = offsetTop + ((page.speed - 1) * this.state.height / 2);
      }
      const toValue = Math.round(((this.lastScrollY - offsetTop) * page.speed) * 2) / 2;
      const translate3d = `translate3d(0px, ${toValue}px, 1px) scale(1) rotate(0deg)`;
      this[page.name].childNodes[0].style['-webkit-transform'] = translate3d;
      this[page.name].childNodes[0].style['-moz-transform'] = translate3d;
      this[page.name].childNodes[0].style['-ms-transform'] = translate3d;
      this[page.name].childNodes[0].style['-o-transform'] = translate3d;
      this[page.name].childNodes[0].style.transform = translate3d;
    }
  }

  _moveItems = () => {
    if (this.lastScrollY >= 0 && this.lastScrollY <= (this.state.bodyHeight - this.state.height)) {
      _.forEach(visiblePages, page => this._setPosition(page));
    }
  }

  _handleScroll(e) {
    if (this.lastScrollY !== e.target.scrollTop) {
      this.lastScrollY = e.target.scrollTop;
      if (this.state.screenWidth <= MOBILE_SCREEN_WIDTH) {
        window.requestAnimationFrame(this._moveItems);
      }
    }
  }
  
  render() {
    const isLandscape = this.state.width > this.state.height;
    return (
      <div
        ref={ node => this.container = node }
        onScroll={ this._handleScroll }
        className={ `height-100 single-page ${this.state.screenWidth <= MOBILE_SCREEN_WIDTH ? 'small-device' : 'large-device'}` }>
          <RsvpButton
            className="rsvp-button__page"
            size="large"
          />
          { visiblePages.map((page, ind) => {
            const isFirst = ind === 0;
            const isLast = ind + 1 === visiblePages.length;
            const backgroundImage = `url(${isLandscape || !page.imagePort ? page.image : page.imagePort})`;
            const title = (
              <div className="parallax__header">
                { page.title }
              </div>
            );
            let arrow;
            if (isLast) {
              arrow = (
                <div
                  className="arrow arrow__up"
                  onClick={ () => {
                    if (this.props.match.params.page === 'top') {
                      this._scrollToMatch();
                    }
                    this.props.history.push('/home/top');
                  } }
                />
              );
            } else {
              const nextPage = visiblePages[ind + 1].name;
              arrow = (
                <div
                  className={ `arrow arrow__down ${isFirst ? 'fadeInAndOut' : ''}` }
                  onClick={ () => {
                    if (this.props.match.params.page === nextPage) {
                      this._scrollToMatch();
                    }
                    this.props.history.push(`/home/${nextPage}`);
                  } }
                />
              );
            }
            const contentSection = (
              <div className="parallax__content">
                { arrow }
                { page.component ? (
                  <ConnectedContent
                    className="page_parallax"
                    history={ this.props.history }
                    component={ page.component }
                    isMainPage
                    { ...page }
                  />
                ) : (
                  <Content
                    className="page_parallax"
                    isMainPage
                    { ...page }
                  />
                ) }
              </div>
            );
            if (this.state.screenWidth <= MOBILE_SCREEN_WIDTH) {
              return (
                <div
                  key={ page.name }
                  id={ page.name }
                  ref={ node => this[page.name] = node }
                  className="parallax__container">
                  <div
                    className={ `image__${page.name} parallax__image` }
                    style={{
                      backgroundImage,
                      height: page.speed > 1 ? `${((page.speed - 1) * 200) + 100}vh` : '100vh',
                      ...page.imageStyle,
                    }}
                  />
                  { title }
                  { contentSection }
                </div>
              );
            }
            return (
              <div
                key={ page.name }
                id={ page.name }
                ref={ node => this[page.name] = node }
                className="parallax__container">
                <div
                  style={{
                    backgroundImage,
                    ...page.imageStyle,
                  }}
                  className={ `image__${page.name} parallax__image` }>
                  <div className="parallax__content-contain">
                    { title }
                    { (isFirst || isLast) && contentSection }
                  </div>
                </div>
                { (!isFirst && !isLast) && contentSection }
              </div>
            );
          } )}
      </div>
    );
  }
}

SinglePage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      page: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default SinglePage;
