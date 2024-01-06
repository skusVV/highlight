export function removeHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight-element-ex-243');

    highlightedElements.forEach(element => {
        const textNode = document.createTextNode(element.textContent);

        element.parentNode.replaceChild(textNode, element);
    });
}

export function isAlreadyHighlighted(node) {
    return node.parentNode.className === 'highlight-element-ex-243';
}

export function removeRedundant(keywords) {
    const highlightedElements = document.querySelectorAll('.highlight-element-ex-243');
    const keywordsValues = keywords.map(item => item.value)
    const itemsToRemove = new Array(...highlightedElements).filter(item => !keywordsValues.includes(item.innerText.toLowerCase()));
    itemsToRemove.forEach(item => {
        const textNode = document.createTextNode(item.textContent);

        item.parentNode.replaceChild(textNode, item);
    });
}

export function highlightWords(node, keywords) {
    if (node.nodeType === 3 && !isAlreadyHighlighted(node) && node.tagName !== 'STYLE') { // Text node
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
    } else if (node.nodeType === 1 && node.tagName !== 'STYLE') { // Element node
        node.childNodes.forEach(child => highlightWords(child, keywords));
    }
}
function flatten(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}


export const getFlattenAndFilteredKeywords = keywordsData => {
    const res = Object.values(keywordsData)
        .filter(item => item.isActive)
        .map(item => item.keywords);

    return flatten(res)
}