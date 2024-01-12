import React, { useState, useEffect } from 'react';
import './tag-field.css';
import { getRandomColor } from '../colors';
import { getParsedValueFromStorage, setStringyValueToLocalStorage } from '../utils/utils';
export const SAVED_KEYWORDS_KEY = 'SAVED_KEYWORDS_KEY';
export const IS_ACTIVE_KEY = 'IS_ACTIVE_KEY';
export const MINIMAL_KEYWORD_LENGTH = 3;

const getActiveKeyStoredValue = key => localStorage.getItem(key)
    ? localStorage.getItem(key) === 'true'
    : true

const TagField = ({ activeTabId, onSyncDataStorage }) => {
    const savedKeywordsKey = `${SAVED_KEYWORDS_KEY}_${activeTabId}`;
    const isActiveKey = `${IS_ACTIVE_KEY}_${activeTabId}`;
    const [keywords, setKeywords] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [color, setColor] = useState(getRandomColor());
    const [value, setValue] = useState('');

    useEffect(() => {
        setKeywords([]);
        setColor(getRandomColor());
        setValue('');
        const isTabActive = getActiveKeyStoredValue(isActiveKey);

        setIsActive(isTabActive);
        getKeywordsFromStorage();
    }, [ activeTabId ]);

    const getKeywordsFromStorage = () => {
        if(localStorage.getItem(savedKeywordsKey)) {
            try {
                const res = getParsedValueFromStorage(savedKeywordsKey, []);
                if(res && res.length) {
                    setKeywords(res);
                }
            } catch (e) {}
        }
    }

    const saveKeywords = (newKeywords, isTabActive) => {
        setStringyValueToLocalStorage(savedKeywordsKey, newKeywords);
        setKeywords(newKeywords);

        onSyncDataStorage({ keywords: newKeywords, isActive: isTabActive, id: activeTabId });
    }

    const onSave = () => {
        if(!value || value.trim().length < MINIMAL_KEYWORD_LENGTH) {
           return;
        }

        if(keywords.some(item => item.value.toLowerCase().trim() === value.toLowerCase().trim())) { // alreadyExists
            setValue('');
            return;
        }


        saveKeywords([ { value: value.toLowerCase().trim(), color: color, id: Math.random() }, ...keywords], isActive);
        setValue('');
        setColor(getRandomColor());
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSave();
        }
    }

    const onRemove = (item) => {
        saveKeywords(keywords.filter(keyword => keyword.id !== item.id), isActive);
    }

    const changeColor = (e) => {
        setColor(e.target.value)
    }

    const onChangeSwitch = (e) => {
        const isChecked = e.target.checked;

        setIsActive(isChecked);
        setStringyValueToLocalStorage(isActiveKey, isChecked);
        onSyncDataStorage({ keywords, isActive: isChecked, id: activeTabId });
    }

    return (
        <div className="tag-field">
            <div className="tag-field-wrapper">
                <div className="tag-field-header">
                    <input type="color" value={color} onChange={changeColor} className="tag-field-header-color"/>
                    <input className="tag-field-header-input"
                           type="text"
                           value={value}
                           onKeyDown={handleKeyDown}
                           onChange={e => setValue(e.target.value)}/>

                    <button className="tag-field-header-button"
                            onClick={onSave}>Save</button>
                </div>
                <div className="tag-field-content">
                {
                    keywords.map(item => {
                        return <div key={item.value}
                                    style={{background: item.color}}
                                    className="tag-field-content-item">
                            <div>{item.value}</div>
                            <div className="tag-field-content-item-remove"
                                 onClick={() => onRemove(item)}>&#10005;</div>
                        </div>
                    })
                }
            </div>
            </div>
            <div className="tab-switcher" style={{background: 'rgb(235, 235, 235)'}}>
                <div className="switcher-wrapper switcher-wrapper-small">
                    <span>{isActive ? 'Disable tab' : 'Enable tab'}</span>
                    <label className="switch switch-small">
                        <input type="checkbox" checked={isActive} onChange={onChangeSwitch}/>
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TagField;
