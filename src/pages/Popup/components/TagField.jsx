import React, { useState, useEffect } from 'react';
import './tag-field.css';

const SAVED_KEYWORDS_KEY = 'SAVED_KEYWORDS_KEY';

const TagField = () => {
    const [keywords, setKeywords] = useState([]);
    const [color, setColor] = useState('#ffdd00');
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
            const newKeywords = [{value: value.toLowerCase(), color: color}, ...keywords];
            saveKeywords(newKeywords);
            setValue('');
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSave();
        }
    }

    const onRemove = (item) => {
        const newKeywords = keywords.filter(keyword => keyword !== item);
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
                        return <div key={item}
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
