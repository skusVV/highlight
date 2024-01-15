import React, { useState, useEffect } from 'react';
import { syncIsEnabledStorage } from '../utils/utils';
import './switcher.css';

const SAVED_IS_ENABLED_KEY = 'SAVED_IS_ENABLED_KEY';

const Switcher = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        const isSwitcherEnabled = localStorage.getItem(SAVED_IS_ENABLED_KEY);

        if(isSwitcherEnabled === 'true') {
            setIsEnabled(isSwitcherEnabled === 'true')
            syncIsEnabledStorage(true);
        }
    }, []);

    const onChangeSwitch = (e) => {
        const isChecked = e.target.checked;
        setIsEnabled(isChecked);
        localStorage.setItem(SAVED_IS_ENABLED_KEY, String(isChecked));
        syncIsEnabledStorage(isChecked);
    }

    return (
        <div className="switcher-wrapper">
            <span>{isEnabled ? 'Switch off' : 'Switch on'}</span>
            <label className="switch">
                <input type="checkbox" checked={isEnabled} onChange={onChangeSwitch}/>
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default Switcher;
