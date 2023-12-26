import React from 'react';
import Switcher from './components/Switcher';
import './Popup.css';
import TagField from "./components/TagField";



const Popup = () => {
  return (
    //    HAS TO BE WELL STYLED
    <div className="App">
        <Switcher />
        <TagField />
    </div>
  );
};

export default Popup;
