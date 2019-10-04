import SecretForm from 'src/components/auth/SecretForm';
import { Form } from 'semantic-ui-react';

describe('<SecretForm /> ', function () {
  const defaultProps = {
    submitSecret: () => {},
  };

  describe('should render', function () {
    it('without blowing up', function () {
      const wrapper = shallow(<SecretForm { ...defaultProps } />);
      expect(wrapper).to.have.length(1);
    });

    it('a <Form /> component', function () {
      const wrapper = shallow(<SecretForm { ...defaultProps } />);
      expect(wrapper.find(Form)).to.have.length(1);
    });

    it('an username <Form.Input /> with an initial state of ""', function () {
      const wrapper = shallow(<SecretForm { ...defaultProps } />);
      expect(wrapper.find(Form.Input)).to.have.length(1);
      expect(wrapper.find(Form.Button)).to.have.length(1);
      expect(wrapper.state().secret).to.eql('');
    });
  });

  describe('should handle', function () {
    it('_handleChange of secret', function () {
      const eventArgs = { preventDefault: () => {} };
      const componentArgs = { name: 'secret', value: 'superSecret' };
      const wrapper = shallow(<SecretForm { ...defaultProps } />);

      wrapper.instance()._handleChange(eventArgs, componentArgs);
      expect(wrapper.state().secret).to.eql('superSecret');
    });

    it('_handleSubmit', sinonTest(function () {
      const submitSpy = this.spy();
      const submitSecret = () => {
        submitSpy();
        return Promise.resolve();
      };
      const eventArgs = { preventDefault: () => {} };
      const wrapper = shallow(<SecretForm { ...defaultProps } submitSecret={ submitSecret } />);

      wrapper.instance()._handleSubmit(eventArgs);
      expect(submitSpy).to.have.been.calledOnce;
    }));
  });
});
