import { removeHighlights, removeRedundant, highlightWords, getFlattenAndFilteredKeywords } from './helpers';

const data = {};
let isExtEnabled = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 { color: black;}`;
document.head.appendChild(style);

const runHighlight = () => {
    if (isExtEnabled) {
        const keywords = getFlattenAndFilteredKeywords(data);
        highlightWords(document.body, keywords);
        removeRedundant(keywords);
    } else {
        removeHighlights();
    }
}

const syncDataWithPopUp = () => {
    chrome?.storage?.local?.get(['key'], function(result) {
        try {
            const res = JSON.parse(result.key);
            if(res.keywords) {
                data[res.id] = { keywords: res.keywords, isActive: res.isActive };
                console.log('UPDATED DATA', data);
            }
        } catch (e) {}
    });

    chrome?.storage?.local?.get(['isEnabled'], function(result) {
        try {
            isExtEnabled = result.isEnabled === 'true';
            runHighlight()
        } catch (e) {}
    });

    chrome?.storage?.local?.get(['clear'], function(result) {
        try {
            if(result.clear) {
                const res = JSON.parse(result.clear);

                if(res && res.id) {
                    delete data[res.id];
                }

            }
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
