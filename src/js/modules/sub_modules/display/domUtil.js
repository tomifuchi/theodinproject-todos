//Great short helpers for DOM elements
//DOM elements creation and setting attributes
const c = (elm) => document.createElement(elm); //(c)reate
const tc = (target, val) => {target.textContent = val; return target}; //(t)ext(c)ontent
const sa = (target, attrib, val) => {target.setAttribute(attrib, val); return target}; //(s)et(a)ttribute
const ap = (target, ...objs) => {objs.forEach(obj => target.appendChild(obj)); return target};//(ap)pendChild

//(c)reate element with (a)trribute
const cea = (elm, attrib) => {
    const i = c(elm);
    for(prop in attrib) {
        sa(i, prop, attrib[prop]);
    }
    return i;
};

//Clearing child of a DOM elements
//(cl)ear node's (c)hilds
const clc = (node) => {
    if(node.hasChildNodes()){
        [...node.childNodes].forEach((child) => {
             node.removeChild(child)
        });
    }
}

//DOM querying
//Element
const qc = (elm, child) => elm.querySelector(child); //(q)uery element's (c)hild
const qcf = (elm) =>  (child) => elm.querySelector(child); //(q)uery element's (c)hild (f)ixed
//Attributes
const qa = (elm, attrib) => elm.querySelector(attrib); //For multiple different targets, (q)uery (attribute)
const qafe = (elm) => (attrib) => elm.querySelector(attrib); //For fixed querying, (q)uery (a)ttribute (f)ixed (e)lement
const qafa = (attrib) => (elm) => elm.querySelector(attrib); //For fixed querying, (q)uery (a)ttribute (f)ixed (a)ttribute

module.exports = {
    //Creation
    c, tc, sa, ap, cea,
    //Clearing
    clc,
    //Querying
    qc, qcf, qa, qafe, qafa
}