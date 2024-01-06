import React, { useState, useEffect } from 'react';
import Switcher from './components/Switcher';
import './Popup.css';
import TagField, {SAVED_KEYWORDS_KEY} from "./components/TagField";
import { syncStorage } from './utils/utils';

const SAVED_TABS_KEY = 'SAVED_TABS_KEY';
const DEFAULT_TAB_ID = 0;
const MAX_TAB_COUNT = 5;

const Popup = () => {
    const [tabs, setTabs] = useState(
localStorage.getItem(SAVED_TABS_KEY)
            ? JSON.parse(localStorage.getItem(SAVED_TABS_KEY))
            : [{ id: DEFAULT_TAB_ID }]
    )
    const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

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
        setTabs(tabs.filter(item => item.id !== id));
        syncStorage({ id });
    }

    const addNewTab = () => {
        const id = Math.random();
        const newTabs = [...tabs, { id }];
        setTabs(newTabs);
        setActiveTabId(id);
        localStorage.setItem(SAVED_TABS_KEY, JSON.stringify(newTabs));
    }

    return (
    //    HAS TO BE WELL STYLED
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
        <TagField activeTabId={activeTabId}/>
    </div>
  );
};

export default Popup;
