export function queryProp(elm) {
    return (attrib) => elm.querySelector(attrib);
}

export function queryPropVal(elm) {
    return (query) => elm.querySelector(query).value;
}

export function clearNodeChilds(node) {
    if(node.hasChildNodes()){
        [...node.childNodes].forEach((child) => {
             node.removeChild(child)
        });
    }
}

export function addToElem(target, ...nodes) {
    nodes.forEach(node => {
        target.appendChild(node);
    });
}