export const syncStorage = data => {
    if(chrome.storage) {
        chrome.storage.local.set({ key:  JSON.stringify(data) }, function() {
            console.log('Store updated with value: ' + JSON.stringify(data));
        });
    }
}