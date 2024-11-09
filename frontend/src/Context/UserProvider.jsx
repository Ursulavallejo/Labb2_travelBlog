import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    ID: localStorage.getItem('ID') || null,
    username: localStorage.getItem('username') || '',
  });

  const setID = (ID) => setUser((prevUser) => ({ ...prevUser, ID }));
  const setUsername = (username) =>
    setUser((prevUser) => ({ ...prevUser, username }));

  return (
    <UserContext.Provider value={{ ...user, setID, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
