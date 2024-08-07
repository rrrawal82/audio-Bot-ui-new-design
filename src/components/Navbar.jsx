import React from 'react'
import '../index.css';
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
      <nav
        className="navbar border-bottom border-body"
        style={{
          height: '75px',
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          padding: '0 15px'
        }}
        data-bs-theme="dark"
      >
        <div className="container">
          <form className="d-flex justify-content-end align-items-center float-end" role="search">
            <Link to="/login"> Login</Link>
            <span className="text-white"></span>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;