import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import { Segment, Header, Table, List } from 'semantic-ui-react';

export class UserHome extends React.Component {
  render() {
    const {
      userAccount: {
        username,
        firstName,
        lastName,
        middleName,
        suffix,
        prefix,
        isStaff,
        userAccountPicture,
        location,
      },
      userGroups,
      members,
      memberRoles,
      setCurrentMember,
    } = this.props;
    const adminMembers = memberRoles.filter(mr => (
      ['owner', 'manager'].includes(mr.memberRole)
    )).map(mr => mr.memberUuid);
    return (
      <Segment basic className="user-home">
        <Header as="h2" textAlign="center">User Home</Header>
        <Segment vertical>
          <Header>Your Account</Header>
          <Table
            definition
            collapsing
            className="component__centered"
            renderBodyRow={ (row, idx) => ({
              key: row[0],
              cells: [
                { key: row[0], content: row[0], textAlign: 'right' },
                { key: row[1], content: row[1] },
              ],
            }) }
            tableData={ [
              ['Username', username],
              ['Prefix', prefix],
              ['First Name', firstName],
              ['Middle Name', middleName],
              ['Last Name', lastName],
              ['Suffix', suffix],
              ['Picture', userAccountPicture],
            ] }
          />
        </Segment>
        <Segment vertical>
          <Header as="h4">Manage Your User Groups</Header>
          <List>
            { members.filter(m => adminMembers.includes(m.memberUuid)).map(m => {
              const ug = userGroups.filter(ug => ug.userGroupUuid === m.userGroupUuid)[0];
              if (ug) {
                return (
                  <List.Item key={ ug.userGroupUuid}>
                    <Link
                      to={ `/user/${ug.userGroupUuid}/` }
                      onClick={ () => {
                        setCurrentMember(m.memberUuid, ug.userGroupUuid);
                      } }>
                      { ug.userGroupTitle }
                    </Link>
                  </List.Item>
                );
              }
              return null;
            }) }
          </List>
        </Segment>
        <Segment vertical>
          <Header as="h4" textAlign="center">View User Groups</Header>
          <List>
            { members.map(m => {
              const ug = userGroups.filter(ug => ug.userGroupUuid === m.userGroupUuid)[0];
              if (ug) {
                return (
                  <List.Item key={ ug.userGroupUuid}>
                    <Link
                      to="/home"
                      onClick={ () => {
                        setCurrentMember(m.memberUuid, ug.userGroupUuid);
                      } }>
                      { ug.userGroupTitle }
                    </Link>
                  </List.Item>
                );
              }
              return null;
            }) }
          </List>
        </Segment>
      </Segment>
    );
  }
}

UserHome.propTypes = {
  userAccount: PropTypes.object.isRequired,
  userGroups: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  memberRoles: PropTypes.array.isRequired,
  setCurrentMember: PropTypes.func.isRequired,
};

export default UserHome;
