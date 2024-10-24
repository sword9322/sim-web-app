import React from 'react';
import Hamburger from './Hamburger';
import './TopBar.css'

// Define the TopBar component
function TopBar({ onToggleMenu }) {
    return (
        <div className="top-bar">
            <Hamburger onClick={onToggleMenu} />
        </div>
    );
}

export default TopBar;
