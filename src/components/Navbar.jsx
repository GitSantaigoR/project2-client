import React from 'react';
import {Link} from 'react-router-dom'



const Navbar = () => {
  return (
    <div className='navbar'>
        <div>
            <Link to='/'>
                <h1>Bookish Bliss</h1>
            </Link>
        </div>
        <div>
            <Link to='/favorites'>
            <h3>Your Favorites</h3>
            </Link>
        </div>
    </div>
  )
}

export default Navbar
