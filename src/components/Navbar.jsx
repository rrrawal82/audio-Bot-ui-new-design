import React , {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import '../index.css';
const Navbar = () => {
  const {currentUser}=useContext(AuthContext)
  return (
    <div>
      <nav
        className="navbar border-bottom border-body"
        style={{
          height: '75px',
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          padding: '0 15px',
        }}
        data-bs-theme="dark"
      >
        <div className="container d-flex justify-content-end align-items-center">
          <form className="d-flex align-items-center" role="search">
              {currentUser ?(
              <span><span className="text-white me-3">{currentUser?.username}</span>

              <span className="text-white me-3"><Link to="/login" className="text-white text-decoration-none">
                    Logout
              </Link></span></span>):
              ( <Link to="/login" className="text-white text-decoration-none">
              Login
              </Link>)
              }
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
