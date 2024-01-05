// TODO Upwork <span>Report</span>s issue.
import { removeHighlights, removeRedundant, highlightWords } from './helpers';

// most likely need to use set with key of tabId
// const data = {
//     'tab-1': {
//         keywords: [],
//         isExtEnabled: true
//     },
// }
let keywords = [];
let isExtEnabled = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 { color: black;}`;
document.head.appendChild(style);


const runHighlight = () => {
    if (isExtEnabled) {
        highlightWords(document.body, keywords);
        removeRedundant(keywords);
    } else {
        removeHighlights();
    }
}

const syncDataWithPopUp = () => {
    chrome?.storage?.local?.get(['key'], function(result) {
        try {
            keywords = JSON.parse(result.key)
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
