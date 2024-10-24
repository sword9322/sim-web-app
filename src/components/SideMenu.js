import React from 'react';
import './SideMenu.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';

// Define the TopBar component
function SideMenu({ onToggleMenu }) {
    return (
        <div className="side-menu">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" exact className={({isActive}) => isActive ? 'active' : ''}>
                            <FontAwesomeIcon icon={faHome} className='icon'/>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>
                            <FontAwesomeIcon icon={faInfoCircle} className='icon'/>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/myprofile" className={({isActive}) => isActive ? 'active' : ''}>
                            <FontAwesomeIcon icon={faUser} className='icon'/>
                            My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/userForm" className={({isActive}) => isActive ? 'active' : ''}>
                            <FontAwesomeIcon icon={faUser} className='icon'/>
                            User Form
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/userTable" className={({isActive}) => isActive ? 'active' : ''}>
                            <FontAwesomeIcon icon={faUser} className='icon'/>
                            Manage Users
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default SideMenu;
