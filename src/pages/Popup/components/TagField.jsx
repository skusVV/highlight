import React, { useState, useEffect } from 'react';
import './tag-field.css';
import { getRandomColor } from '../colors';
import { syncStorage } from '../utils/utils';
export const SAVED_KEYWORDS_KEY = 'SAVED_KEYWORDS_KEY';
export const IS_ACTIVE_KEY = 'IS_ACTIVE_KEY';
export const MINIMAL_KEYWORD_LENGTH = 3;

const TagField = ({ activeTabId }) => {
    const savedKeywordsKey = `${SAVED_KEYWORDS_KEY}_${activeTabId}`;
    const isActiveKey = `${IS_ACTIVE_KEY}_${activeTabId}`;
    const [keywords, setKeywords] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [color, setColor] = useState(getRandomColor());
    const [value, setValue] = useState('');

    useEffect(() => {
        getKeywordsFromStorage();
    }, [] );

    useEffect(() => {
        setKeywords([]);
        setColor(getRandomColor());
        setValue('');
        const isTabActive = localStorage.getItem(isActiveKey)
            ? localStorage.getItem(isActiveKey) === 'true'
            : true;
        setIsActive(isTabActive);

        getKeywordsFromStorage(isTabActive);
    }, [ activeTabId ]);

    const getKeywordsFromStorage = (isTabActive) => {
        if(localStorage.getItem(savedKeywordsKey)) {
            try {
                const res = JSON.parse(localStorage.getItem(savedKeywordsKey));
                if(res && res.length) {
                    setKeywords(res);
                    saveKeywords(res, isTabActive);
                }
            } catch (e) {}
        }
    }

    const saveKeywords = (newKeywords, isTabActive) => {
        localStorage.setItem(savedKeywordsKey, JSON.stringify(newKeywords))
        setKeywords(newKeywords);

        syncStorage({ keywords: newKeywords, isActive: isTabActive, id: activeTabId });
    }


    const onSave = () => {
        if(!value || value.trim().length < MINIMAL_KEYWORD_LENGTH) {
           return;
        }

        const alreadyExists = keywords.some(item => item.value === value);

        if(alreadyExists) {
            setValue('');
            return;
        }

        const newKeywords = [{value: value.toLowerCase().trim(), color: color}, ...keywords];
        saveKeywords(newKeywords, isActive);
        setValue('');
        setColor(getRandomColor());
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSave();
        }
    }

    const onRemove = (item) => {
        const newKeywords = keywords.filter(keyword => keyword.value !== item.value);
        saveKeywords(newKeywords, isActive);
    }

    const changeColor = (e) => {
        setColor(e.target.value)
    }

    const onChangeSwitch = (e) => {
        const isChecked = e.target.checked;
        setIsActive(isChecked);
        localStorage.setItem(isActiveKey, String(isChecked));

        syncStorage({ keywords, isActive: isChecked, id: activeTabId });
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
