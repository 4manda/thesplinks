import { Secret } from 'src/containers/userSession/SecretContainer';
import { Link } from 'react-router-dom';
import SecretForm from 'src/components/auth/SecretForm';

// To test that required props are being passed to the component
before(() => {
  sinon.stub(console, 'error').callsFake(warning => { throw new Error(warning); });
});

after(() => { console.error.restore(); });

describe('<Secret /> should render', function () {
  const defaultProps = {
    submitSecret: () => {},
  };

  it('without blowing up', function () {
    const wrapper = shallow(<Secret { ...defaultProps } />);
    expect(wrapper).to.have.length(1);
  });

  it('<SecretForm /> component', function () {
    const wrapper = shallow(<Secret { ...defaultProps } />);
    expect(wrapper.find(SecretForm)).to.have.length(1);
  });

  it('a <Link /> to /forgot', function () {
    const wrapper = shallow(<Secret { ...defaultProps } />);
    expect(wrapper.find(Link).filter('[to="/forgot"]')).to.have.length(1);
  });
});
