import React, { useState, useEffect } from 'react';
import './tag-field.css';

const SAVED_KEYWORDS_KEY = 'SAVED_KEYWORDS_KEY';

const colors = [
    '#51ba4c',
    '#e4a8b6',
    '#b5faba',
    '#ee0ab4',
    '#908410',
    '#31f973',
    '#c0751e',
    '#db5851',
    '#d971ff',
    '#fd0674',
    '#c1fb04',
    '#fb055f',
    '#de7203',
    '#ce540d',
    '#a9c970',
    '#c8511a',
    '#4b8973',
    '#e86b5d',
    '#14bc88',
    '#c20074',
    '#d78c00',
    '#58a658',
    '#7fd47d',
    '#f96642',
    '#10dc81',
    '#61f9de',
    '#d1747e',
    '#de3348',
    '#e0c41d',
    '#a4fdfb',
    '#1f60e9',
    '#3ad49e'
];



const TagField = () => {
    const [keywords, setKeywords] = useState([]);
    const [color, setColor] = useState(colors[Math.floor(Math.random()*colors.length)]);
    const [value, setValue] = useState('');

    useEffect(() => {
        getKeywordsFromStorage();
    }, []);

    const getKeywordsFromStorage = () => {
        if(localStorage.getItem(SAVED_KEYWORDS_KEY)) {
            try {
                const res = JSON.parse(localStorage.getItem(SAVED_KEYWORDS_KEY));
                if(res && res.length) {
                    setKeywords(res);
                    saveKeywords(res);
                }
            } catch (e) {

            }
        }
    }

    const saveKeywords = newKeywords => {
        localStorage.setItem(SAVED_KEYWORDS_KEY, JSON.stringify(newKeywords))
        setKeywords(newKeywords);

        if(chrome.storage) {
            chrome.storage.local.set({ key:  JSON.stringify(newKeywords) }, function() {
                console.log('Value is set to ' + JSON.stringify(newKeywords));
            });
        }
    }


    const onSave = () => {
        if(value) {
            const alreadyExists = keywords.some(item => item.value === value);
            if(alreadyExists) {
                setValue('');
                return;
            }

            const newKeywords = [{value: value.toLowerCase(), color: color}, ...keywords];
            saveKeywords(newKeywords);
            setValue('');
            setColor(colors[Math.floor(Math.random()*colors.length)]);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSave();
        }
    }

    const onRemove = (item) => {
        const newKeywords = keywords.filter(keyword => keyword.value !== item.value);
        saveKeywords(newKeywords);
    }

    const changeColor = (e) => {
        setColor(e.target.value)
    }
    return (
        <div className="tag-field">
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
    );
};

export default TagField;
