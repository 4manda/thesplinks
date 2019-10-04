import { App } from 'src/app';
import { Message, Sidebar, Loader } from 'semantic-ui-react';
import Idle from 'kit/lib/idle';
import { localStorage } from 'kit/lib/utils';
import Helmet from 'react-helmet';
import PageRoutes from 'src/components/routes/PageRoutes';
import MainSidebarMenu from 'src/components/menus/MainSidebarMenu';

describe('<App />', function () {
  const defaultProps = {
    hasSecret: false,
    unselectUserGroup: () => {},
    enterUserGroup: () => {},
    logout: () => {},
    isLoading: false,
    history: {},
  };

  describe('should render', function () {
    it('without blowing up', function () {
      const wrapper = shallow(<App { ...defaultProps } />);
      expect(wrapper).to.have.length(1);
    });

    it('<Helmet /> component', function () {
      const wrapper = shallow(<App { ...defaultProps } />);
      expect(wrapper.find(Helmet)).to.have.length(1);
    });

    it('<Message /> and <PageRoutes /> when not authenticated', function () {
      const wrapper = shallow(<App { ...defaultProps } />);
      expect(wrapper.find(PageRoutes)).to.have.length(1);
      expect(wrapper.find(MainSidebarMenu)).to.have.length(0);
      expect(wrapper.find(Sidebar.Pushable)).to.have.length(0);
    });

    it('<MainSidebarMenu />, <Sidebar /> when authenticated', function () {
      const wrapper = shallow(
        <App
          { ...defaultProps }
          hasSecret
          currentUsername="testUser"
        />,
      );
      expect(wrapper.find(MainSidebarMenu), 'MainSidebarMenu').to.have.length(1);
      expect(wrapper.find(Sidebar.Pushable), 'Pushable').to.have.length(1);
      expect(wrapper.find(Sidebar.Pusher), 'Pusher').to.have.length(1);
      expect(wrapper.find(PageRoutes)).to.have.length(1);
    });

    it('<Loader /> when isLoading true', function () {
      const wrapper = shallow(<App { ...defaultProps } isLoading />);
      expect(wrapper.find(Loader)).to.have.length(1);
    });
  });

  describe('should handle', function () {
    it('toggleMainSidebarVisibility of sidebar', function () {
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.instance()._toggleMainSidebarVisibility();
      expect(wrapper.state().mainSidebarVisible).to.eql(true);
      wrapper.instance()._toggleMainSidebarVisibility();
      expect(wrapper.state().mainSidebarVisible).to.eql(false);
    });

    it('hideSidebar', function () {
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.instance()._toggleMainSidebarVisibility();
      expect(wrapper.state().mainSidebarVisible).to.eql(true);
      wrapper.instance()._hideSidebar();
      expect(wrapper.state().mainSidebarVisible).to.eql(false);
    });

    it('handleMessageDismiss', function () {
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.setState({ messageVisible: true });
      expect(wrapper.state().messageVisible).to.eql(true);
      wrapper.instance()._handleMessageDismiss();
      expect(wrapper.state().messageVisible).to.eql(false);
    });

    it('componentWillMount with messageVisible (Message shows when authenticated)', function () {
      const wrapper = shallow(
        <App
          { ...defaultProps }
          hasSecret
          currentUsername="testUser"
          authStatusMessage="testMessage"
        />,
      );
      expect(wrapper.state().messageVisible).to.eql(true);
      expect(wrapper.find(Message)).to.have.length(1);
    });

    it('componentWillReceiveProps and show Message (Message shows when unauthenticated)', sinonTest(function () {
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.setProps({ authStatusMessage: 'testMessage' });
      expect(wrapper.state().messageVisible).to.eql(true);
      expect(wrapper.find(Message)).to.have.length(1);
    }));

    it('componentWillReceiveProps and start idle timer', sinonTest(function () {
      const idleStartStub = this.stub(Idle.prototype, 'start');
      const getItemStub = this.stub(localStorage, 'getItem').returns(undefined);
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.setProps({
        hasSecret: true,
        currentUsername: 'testUser',
      });
      expect(idleStartStub).to.have.been.calledOnce;
      expect(getItemStub).to.have.been.calledOnce;
    }));

    it('componentWillReceiveProps and will not start idle timer', sinonTest(function () {
      const idleStartStub = this.stub(Idle.prototype, 'start');
      const getItemStub = this.stub(localStorage, 'getItem').returns('savedUsername');
      const wrapper = shallow(<App { ...defaultProps } />);

      wrapper.setProps({
        hasSecret: true,
        currentUsername: 'testUser',
      });
      expect(idleStartStub).to.have.not.been.called;
      expect(getItemStub).to.have.been.calledOnce;
    }));

    it('_awayCallback', sinonTest(function () {
      const logoutStub = this.stub();
      const wrapper = shallow(<App { ...defaultProps } logout={ logoutStub } />);

      wrapper.instance()._awayCallback();
      expect(logoutStub).to.have.been.calledOnce;
      expect(wrapper.instance().idle.isAway).to.eql(false);
    }));
  });
});
