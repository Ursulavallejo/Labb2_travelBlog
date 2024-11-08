import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

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
