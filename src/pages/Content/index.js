import { removeHighlights, removeRedundant, highlightWords, getFlattenAndFilteredKeywords } from './helpers';

let data = {};
let isExtEnabled = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 { color: black;}`;
document.head.appendChild(style);

const runHighlight = () => {
    if (isExtEnabled) {
        console.log('DATA', data);
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
            if(res) {
                data = res;
                // data[res.id] = { keywords: res.keywords, isActive: res.isActive };
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
