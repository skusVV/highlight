import React, { useState, useEffect } from 'react';
import Switcher from './components/Switcher';
import './Popup.css';
import TagField, { SAVED_KEYWORDS_KEY } from "./components/TagField";
import {
    getParsedValueFromStorage,
    setStringyValueToLocalStorage,
    syncDataStorage
} from './utils/utils';

const SAVED_TABS_KEY = 'SAVED_TABS_KEY';
const DATA_KEY = 'DATA_KEY';
const DEFAULT_TAB_ID = 0;
const MAX_TAB_COUNT = 5;
// TODO REFACTOR

const Popup = () => {
    const [tabs, setTabs] = useState(getParsedValueFromStorage(SAVED_TABS_KEY, [{ id: DEFAULT_TAB_ID }]))
    const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);
    const [data, setData] = useState(  getParsedValueFromStorage(DATA_KEY, []));

    useEffect(() => {
        if(tabs[tabs.length-1].id !==activeTabId) {
            setActiveTabId(tabs[tabs.length-1].id)
        }
    }, [tabs])

    const onRemovePanel = (id) => {
        if(tabs.length === 1) {
            return;
        }

        localStorage.removeItem(SAVED_KEYWORDS_KEY + id);
        const newTabs = tabs.filter(item => item.id !== id);
        setTabs(newTabs);
        setStringyValueToLocalStorage(SAVED_TABS_KEY, newTabs);
        const newData = data.filter(item => item.id !== id);
        setStringyValueToLocalStorage(DATA_KEY, newData);
        syncDataStorage(newData);
    }

    const addNewTab = () => {
        const id = Math.random();
        const newTabs = [...tabs, { id }];
        setTabs(newTabs);
        setActiveTabId(id);
        setStringyValueToLocalStorage(SAVED_TABS_KEY, newTabs);
    }

    const onSyncDataStorage = tabData => {
        const newData = [...data.filter(item => item.id !== tabData.id), tabData];
        setStringyValueToLocalStorage(DATA_KEY, newData);
        setData(newData);
        syncDataStorage(newData);
    }

    return (
    <div className="App">
        <Switcher />
        <div className="panels">
            {
                tabs.map((item, index) => (
                    <div className={`tab-item ${item.id === activeTabId? 'tab-item-selected' : ''} `} onClick={() => setActiveTabId(item.id)} >
                        <div className="tab-item-name">{`Tab ${index + 1}`}</div>
                        <div className="tab-item-close" onClick={() => onRemovePanel(item.id)}>&#x2715;</div>
                    </div>))
            }
            {
                tabs.length < MAX_TAB_COUNT &&
                <div
                    className="tab-item tab-plus"
                    onClick={addNewTab}>
                    +
                </div>
            }

        </div>
        <TagField activeTabId={activeTabId} onSyncDataStorage={onSyncDataStorage}/>
    </div>
  );
};

export default Popup;
