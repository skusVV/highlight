export const syncDataStorage = (data) => {
    if(chrome.storage) {
        chrome.storage.local.set({ key:  JSON.stringify(data) }, function() {
            console.log('Store updated with value: ' + JSON.stringify(data));
        });
    }
}

export const syncIsEnabledStorage = isChecked => {
    if(chrome.storage) {
        chrome.storage.local.set({ isEnabled:  String(isChecked) }, function() {
            console.log('isEnabled is set to ' + String(isChecked));
        });
    }
}

export const setStringyValueToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const getParsedValueFromStorage = (key, defaultValue) => localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : defaultValue;