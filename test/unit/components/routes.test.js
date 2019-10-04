import PageRoutes from 'src/components/routes/PageRoutes';
import PrivateRoute from 'src/components/routes/PrivateRoute';
import PublicRoute from 'src/components/routes/PublicRoute';
import { Switch, Route, Redirect } from 'react-router-dom';

describe('<PageRoutes /> should render', function () {
  const defaultProps = {
    hasSecret: false,
    location: {},
    history: {},
  };

  it('without blowing up', function () {
    const wrapper = shallow(<PageRoutes { ...defaultProps } />);
    expect(wrapper).to.have.length(1);
  });

  it('a <Switch />', function () {
    const wrapper = shallow(<PageRoutes { ...defaultProps } />);
    expect(wrapper.find(Switch)).to.have.length(1);
  });

  it('6 <PrivateRoutes />s', function () {
    const wrapper = shallow(<PageRoutes { ...defaultProps } />);
    expect(wrapper.find(PrivateRoute)).to.have.length(6);
  });

  it('1 <PublicRoutes />s', function () {
    const wrapper = shallow(<PageRoutes { ...defaultProps } />);
    expect(wrapper.find(PublicRoute)).to.have.length(1);
  });

  it('1 <Routes />s', function () {
    const wrapper = shallow(<PageRoutes { ...defaultProps } />);
    expect(wrapper.find(Route)).to.have.length(1);
  });
});

describe('<PrivateRoute /> should render', function () {
  const testComponent = () => {};
  const defaultProps = {
    component: testComponent,
    hasSecret: false,
  };

  it('without blowing up', function () {
    const wrapper = shallow(<PrivateRoute { ...defaultProps } />);
    expect(wrapper).to.have.length(1);
  });

  it('a <Route /> with <Redirect /> when not authenticated', function () {
    const wrapper = shallow(<PrivateRoute { ...defaultProps } />);
    expect(wrapper.find(Route)).to.have.length(1);
    expect(wrapper.props().render(wrapper.props()).type, 'render with redirect').to.eql(Redirect);
  });

  it('a <Route /> with <Component /> when authenticated', function () {
    const wrapper = shallow(
      <PrivateRoute { ...defaultProps } hasSecret />,
    );
    expect(wrapper.find(Route)).to.have.length(1);
    expect(wrapper.props().render(wrapper.props()).type, 'render with Component').to.equal(testComponent);
  });
});

describe('<PublicRoute /> should render', function () {
  const testComponent = () => {};
  const defaultProps = {
    component: testComponent,
    hasSecret: false,
  };

  it('without blowing up', function () {
    const wrapper = shallow(<PublicRoute { ...defaultProps } />);
    expect(wrapper).to.have.length(1);
  });

  it('a <Route /> with <Component /> when not authenticated', function () {
    const wrapper = shallow(
      <PublicRoute { ...defaultProps } />,
    );
    expect(wrapper.find(Route)).to.have.length(1);
    expect(wrapper.props().render(wrapper.props()).type, 'render with Component').to.equal(testComponent);
  });

  it('a <Route /> with <Redirect /> when authenticated', function () {
    const wrapper = shallow(<PublicRoute { ...defaultProps } hasSecret />);
    expect(wrapper.find(Route)).to.have.length(1);
    expect(wrapper.props().render(wrapper.props()).type, 'render with redirect').to.eql(Redirect);
  });
});
