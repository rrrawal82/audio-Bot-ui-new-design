import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav class="navbar  border-bottom border-body"style={{marginLeft:'-45px',height:'75px',width:'112%',backgroundColor:'black',color:'white'}} data-bs-theme="dark">
            <div class="container">
               
                <form class="d-flex float-end" role="search" >
                {/* <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button class="btn btn-outline-success" type="submit">Search</button> */}
                    <a >Login</a>
                    <span>
                    Ritu Rawal</span>
                </form>
            </div>
        </nav>
    </div>
  )
}

export default Navbar