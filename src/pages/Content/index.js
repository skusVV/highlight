import { removeHighlights, removeRedundant, highlightWords, getFlattenAndFilteredKeywords } from './helpers';

let data = {};
let isExtEnabled = true;
let visibilityStatus = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 { color: black;}`;
document.head.appendChild(style);

const blacklist = ['www.google.com'];

const runHighlight = () => {
    try {
        if(blacklist.includes(window.location.host) || !visibilityStatus) {
            return;
        }

        if (isExtEnabled) {
            const keywords = getFlattenAndFilteredKeywords(data);
            highlightWords(document.body, keywords);
            removeRedundant(keywords);
        } else {
            removeHighlights();
        }
    } catch (e) {
        // console.log('Hans Highlight: ', e)
    }
}

const syncDataWithPopUp = () => {
    chrome?.storage?.local?.get(['key'], function(result) {
        try {
            const res = JSON.parse(result.key);
            if(res) {
                data = res;
            }
        } catch (e) {}
    });

    chrome?.storage?.local?.get(['isEnabled'], function(result) {
        try {
            isExtEnabled = result.isEnabled === 'true';
            runHighlight()
        } catch (e) {}
    });
}

let storageInterval;

const init = () => {
    storageInterval = setInterval(() => {
        syncDataWithPopUp(); // it will run runHighlight
    }, 2000);
}
init();

// Switch ON/OFF when leave the website.
function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
        setTimeout(() => {
            syncDataWithPopUp()
            runHighlight();
        }, 500);
        visibilityStatus = true;
        init();
    } else {
        visibilityStatus = false;
        clearInterval(storageInterval);
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange);
