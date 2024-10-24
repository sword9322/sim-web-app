import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import Content from './components/Content';
import Dashboard from './components/Dashboard'
import About from './components/About'
import MyProfile from './components/MyProfile'
import UserForm from './components/UserForm'
import UserTable from './components/UserTable';

function App() {
  const [menuVisible, setMenuVisible] = useState(true);

  const toggleSideMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Router>
      <div className='root'>
        <TopBar onToggleMenu={toggleSideMenu}></TopBar>
        <div className='container'>
          {menuVisible && <SideMenu/>}
          <Content isFullSize={!menuVisible}>
            <Routes>
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/myprofile' element={<MyProfile/>}/>
              <Route path='/userForm' element={<UserForm/>}/>
              <Route path='/userTable' element={<UserTable/>}/>
            </Routes>
          </Content>
        </div>
      </div>
    </Router>
  );
}

export default App;
