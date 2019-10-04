import MainSidebarMenu from 'src/components/menus/MainSidebarMenu';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

describe('<MainSidebarMenu /> should render', function () {
  const defaultProps = {
    sidebarVisible: true,
    toggleVisibility: () => {},
  };

  it('without blowing up', function () {
    const wrapper = shallow(<MainSidebarMenu { ...defaultProps } />);
    expect(wrapper).to.have.length(1);
  });

  it('with the correct components when sidebar visible', function () {
    const wrapper = shallow(<MainSidebarMenu { ...defaultProps } />);
    expect(wrapper.find(Sidebar), 'a Sidebar').to.have.length(1);
    expect(wrapper.find(Menu.Item), 'Menu.Items').to.have.length(10);
    expect(wrapper.find(Menu), 'Menu').to.have.length(1);
    expect(wrapper.find(Icon), 'Icon').to.have.length(2);
  });

  it('with the correct components when sidebar closed', function () {
    const wrapper = shallow(<MainSidebarMenu { ...defaultProps } sidebarVisible={ false } />);
    expect(wrapper.find(Sidebar), 'a Sidebar').to.have.length(1);
    expect(wrapper.find(Menu.Item), 'Menu.Items').to.have.length(10);
    expect(wrapper.find(Menu), 'Menu').to.have.length(1);
    expect(wrapper.find(Icon), 'Icon').to.have.length(2);
  });

  it('some usergroup Menu.Items', function () {
    const wrapper = shallow(
      <MainSidebarMenu
        { ...defaultProps }
        userGroups={ [
          { userGroupUuid: 'b', userGroupNickname: 'b' },
          { userGroupUuid: 'a', userGroupNickname: 'a' },
        ] }
      />,
    );
    expect(wrapper.find(Menu.Item), 'Menu.Items').to.have.length(10);
  });
});
