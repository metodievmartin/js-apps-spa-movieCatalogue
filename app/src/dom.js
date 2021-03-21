export function e(type, attributes, ...content) {
    let newEl = document.createElement(type);

    Object.entries(attributes).forEach(([attribute, value]) => {
        newEl[attribute] = value;
    });

    content.forEach(e => {
        if (typeof e === 'string') {
            newEl.innerHTML = e;
        } else {
            newEl.appendChild(e);
        }
    });

    return newEl;
}