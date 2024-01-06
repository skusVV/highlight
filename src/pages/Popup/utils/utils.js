export const syncDataStorage = (data) => {
    if(chrome.storage) {
        chrome.storage.local.set({ key:  JSON.stringify(data) }, function() {
            console.log('Store updated with value: ' + JSON.stringify(data));
        });
    }
}

export const syncClearStorage = (data) => {
    if(chrome.storage) {
        chrome.storage.local.set({ clear:  JSON.stringify(data) }, function() {
            console.log('Store updated with value: ' + JSON.stringify(data));
        });
    }
}

export const syncIsEnabledStorage = isChecked => {
    if(chrome.storage) {
        chrome.storage.local.set({ isEnabled:  String(isChecked) }, function() {
            console.log('isEnabled is set to ' + String(true));
        });
    }
}