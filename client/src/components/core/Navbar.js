import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    history.replace('/login');
  };

  return (
    <ul className="nav nav-pills bg-light">
      <li className="nav-item">
        <Link
          to={`/home/${sessionStorage.getItem('custID')}`}
          className="nav-link"
        >
          Home
        </Link>
      </li>
      <li>
        <Link to="/transactionhistory" className="nav-link">
          Transaction History
        </Link>
      </li>
      <li>
        <Link to="/addtransaction" className="nav-link">
          Add Transaction
        </Link>
      </li>
      <li className="nav-item" style={{ cursor: 'pointer' }}>
        <a onClick={handleLogout} className="nav-link">
          Sign Out
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
