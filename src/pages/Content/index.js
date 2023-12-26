

let keywords = [];
let isExtEnabled = true;

const style = document.createElement('style');
style.textContent = `.highlight-element-ex-243 {  color: black;}`;
document.head.appendChild(style);

function isAlreadyHighlighted(node) {
    return node.parentNode.className === 'highlight-element-ex-243';
}

function highlightWords(node) {
    if (node.nodeType === 3 && !isAlreadyHighlighted(node)) { // Text node
        let text = node.nodeValue;
        let replacedText = text;
        let color = 'yellow';

        keywords.forEach(keyword => {
            const regex = new RegExp(keyword.value, 'gi');
            color = keyword.color;
            replacedText = replacedText.replace(regex, (match) => {
                return `<span class="highlight-element-ex-243" style="background-color: ${color}">${match}</span>`;
            });
        });

        if (replacedText !== text) {
            let newNode = document.createElement('span');
            newNode.innerHTML = replacedText;
            node.parentNode.replaceChild(newNode, node);
        }
    } else if (node.nodeType === 1) { // Element node
        node.childNodes.forEach(child => highlightWords(child));
    }
}
function removeHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight-element-ex-243');

    highlightedElements.forEach(element => {
        const textNode = document.createTextNode(element.textContent);

        element.parentNode.replaceChild(textNode, element);
    });
}

function removeRedundant() {
    const highlightedElements = document.querySelectorAll('.highlight-element-ex-243');
    const keywordsValues = keywords.map(item => item.value)
    const itemsToRemove = new Array(...highlightedElements).filter(item => !keywordsValues.includes(item.innerText.toLowerCase()));
    itemsToRemove.forEach(item => {
        const textNode = document.createTextNode(item.textContent);

        item.parentNode.replaceChild(textNode, item);
    });
}

const runHighlight = () => {
    if (isExtEnabled) {
        highlightWords(document.body);
        removeRedundant();
    } else {
        removeHighlights();
    }
}


const init = () => {
    if(!window?.location?.origin?.toLowerCase().includes('linkedin')) {
        return;
    }

    setInterval(() => {
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
    }, 1000);

    setInterval(() => {
        runHighlight();
    }, 3000);
}

init();
