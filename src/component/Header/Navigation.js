import React from 'react'
import './Nav.css';
import { Link, NavLink } from 'react-router-dom'

function Navigation() {
    return (
            <div className="topnav">
                <NavLink to="/" activeclassname="active" >Home</NavLink>
                <NavLink to="/upload">Create new book</NavLink>
            </div>
    )
}

export default Navigation;
