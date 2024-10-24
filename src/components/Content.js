import React from 'react';
import './content.css'; // Make sure to create and import a CSS file for Content

function Content({ isFullSize, children }) {
    return (
        <div className={`content ${isFullSize ? 'full-size' : ''}`}>
            {children}
        </div>
    );
}

export default Content;
