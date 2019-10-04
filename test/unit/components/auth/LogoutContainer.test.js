import Logout from 'src/components/auth/Logout';
import { Button, Modal, Segment } from 'semantic-ui-react';
import createHistory from 'history/createBrowserHistory';

describe('<Logout /> should render', function () {
  describe('default as a "modal"', function () {
    const defaultProps = {
      logout: () => {},
      history: {},
    };

    it('without blowing up', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper).to.have.length(1);
    });

    it('as a <Modal />', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper.find(Modal)).to.have.length(1);
    });

    it('with two <Button /> components', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper.find(Button)).to.have.length(2);
    });

    it('and call _handleLogoutClick function when Logout button clicked', sinonTest(function () {
      const handleLogoutSpy = this.spy(Logout.prototype, '_handleLogoutClick');
      const logoutSpy = this.spy();
      const eventArgs = { preventDefault: () => {} };
      const history = createHistory();
      const pushHomeSpy = this.spy(history, 'push');
      const wrapper = shallow(
        <Logout
          { ...defaultProps }
          logout={ logoutSpy }
          history={ history }
        />,
      );

      wrapper.find(Button).filter('[content="Logout"]').simulate('click', eventArgs);
      expect(handleLogoutSpy, 'handleLogoutSpy').to.have.been.calledOnce;
      expect(logoutSpy, 'logoutSpy').to.have.been.calledOnce;
      expect(pushHomeSpy, 'pushHomeSpy').to.have.been.calledOnce;
    }));

    it('and call _handleGoBack function when Cancel button clicked', sinonTest(function () {
      const handleGoBackSpy = this.spy(Logout.prototype, '_handleGoBack');
      const eventArgs = { preventDefault: () => {} };
      const history = createHistory();
      const goBackSpy = this.spy(history, 'goBack');
      const wrapper = shallow(
        <Logout
          { ...defaultProps }
          history={ history }
        />,
      );

      wrapper.find(Button).filter('[content="Cancel"]').simulate('click', eventArgs);
      expect(handleGoBackSpy, 'handleGoBackSpy').to.have.been.calledOnce;
      expect(goBackSpy, 'goBackSpy').to.have.been.calledOnce;
    }));
  });

  describe('as a "page"', function () {
    const defaultProps = {
      contentType: 'page',
      logout: () => {},
      history: {},
    };

    it('without blowing up', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper).to.have.length(1);
    });

    it('as a <Segment />', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper.find(Segment)).to.have.length(1);
    });

    it('with one <Button />', function () {
      const wrapper = shallow(<Logout { ...defaultProps } />);
      expect(wrapper.find(Button)).to.have.length(1);
    });

    it('and call _handleLogoutClick function when Logout button clicked', sinonTest(function () {
      const handleLogoutSpy = this.spy(Logout.prototype, '_handleLogoutClick');
      const logoutSpy = this.spy();
      const eventArgs = { preventDefault: () => {} };
      const history = createHistory();
      const pushHomeSpy = this.spy(history, 'push');
      const wrapper = shallow(
        <Logout
          { ...defaultProps }
          logout={ logoutSpy }
          history={ history }
        />,
      );

      wrapper.find(Button).filter('[content="Logout"]').simulate('click', eventArgs);
      expect(handleLogoutSpy, 'handleLogoutSpy').to.have.been.calledOnce;
      expect(logoutSpy, 'logoutSpy').to.have.been.calledOnce;
      expect(pushHomeSpy, 'pushHomeSpy').to.have.been.calledOnce;
    }));
  });
});
