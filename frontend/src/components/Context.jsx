import { useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';

export function UserProvider({ children }) {
  const [ID, setID] = useState(null);

  useEffect(() => {
    const storedID = localStorage.getItem('ID');
    if (storedID) {
      setID(storedID);
    }
  }, []);

  return (
    <UserContext.Provider value={{ ID, setID }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
