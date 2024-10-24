import './Hamburger.css';
import React from 'react';

function Hamburger({onClick}){
    return(
        <div className='hamburger' onClick={onClick}>
            <div className='bar'></div>
            <div className='bar'></div>
            <div className='bar'></div>
        </div>
    )
}

export default Hamburger;