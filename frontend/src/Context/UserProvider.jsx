import { useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';

export function UserProvider({ children }) {
  const [ID, setID] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedID = localStorage.getItem('ID');
    const storedUsername = localStorage.getItem('username');
    if (storedID) setID(storedID);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <UserContext.Provider value={{ ID, setID, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
