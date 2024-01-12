import { removeHighlights, removeRedundant, highlightWords, getFlattenAndFilteredKeywords } from './helpers';

let data = {};
let isExtEnabled = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 { color: black;}`;
document.head.appendChild(style);

const blacklist = ['www.google.com'];

const runHighlight = () => {
    try {
        if(blacklist.includes(window.location.host)) {
            return
        }

        if (isExtEnabled) {
            const keywords = getFlattenAndFilteredKeywords(data);
            highlightWords(document.body, keywords);
            removeRedundant(keywords);
        } else {
            removeHighlights();
        }
    } catch (e) {
        console.log('Hans Highlight: ', e)
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
let runHighlightInterval;

const init = () => {
    storageInterval = setInterval(() => {
        syncDataWithPopUp();
    }, 1000);

    runHighlightInterval = setInterval(() => {
        runHighlight();
    }, 3000);
}
init();

// Switch ON/OFF when leave the website.
function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
        setTimeout(() => {
            syncDataWithPopUp()
            runHighlight();
        }, 500);
        init();
    } else {
        clearInterval(storageInterval);
        clearInterval(runHighlightInterval);
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange);
