/**
 * @license
 * Copyright (c) 2023 Yuto Sato
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
/**
 * Class for generating the click to go menu for headers of your sites
 * @class 
 */
class MenuGenerator{
    ////////////////////private properties of the class begin////////
    /////////////////////////////////////////////////////////////////
    /**
     * assigned when constuction of this obj, only used in a #makeQuery
     * @type {string[]} seeds 
     */
    #seeds
     /**
     * assigned when wherein of this obj called, only used in a #makeQuery
     * @type {!string} where
     * @private
     */
    #where = "";
    /**
     * assigned when whose of this obj called, only used in a #makeQuery
     * @type {!string} who
     */
    #who = ""
    
    /**
     * list of list of strings liNames[depth] is a classNames at depth
     * @type {!Array.<Array. <string>>} liClsNames
     * @private
     */
    #liClsNames = [];
    /**
     * @type {Array. <function>} textTransformers
     * @private
     */
    #textTransformers = [];
    /**
     * @type {Array.<Array.<string>>} wrapperClasses
     * @private
     */
    #wrapperClasses = [];
    /**
     * @type {!string} wrapperTag
     */
    #wrapperTag = "ol";
    /**
     * @type {!string} wrapperId
     */
    #wrapperId = "";
    /////////////////////////////////////////////////////////////////
    ////////////////////private properties of the class end//////////


   
    ////////////////////private methods of the class begin///////////
    /////////////////////////////////////////////////////////////////
    /**
     * @returns {string}
     * @private
     */
    #makeQueryHelper(type,name){
	const t = type.trim().toLowerCase();
	const n = name.trim();
	const types = ["id", "class", "tag"];
	if (!types.includes(t)){
	    throw Error(`Invalid arg for type, '${type}' is neigther 'id', 'class' nor 'tag'`);
	}
	if (t === "id"){
	    return "#".concat(n);
	}else if (t === "class"){
	    return ".".concat(n);
	}else{
	    return n;
	}
    }
    /**
     * just for making up the query for querySelectorAll
     * @returns {string}
     */
    #makeQuery(){
	const qArray = this.#seeds.map( s => this.#where.concat(" ", s, this.#who) );
	return qArray.join(", ");
    }

    /**
     * return t if depth suffices  0 <= depth < #seeds.length
     * @param {!number} depth
     * @returns {boolean}
     */
    #depthValidP(depth){
	return (0 <= depth) && (depth < this.#seeds.length);
    }
    /**
     * check whether given funcion is a string to string fuction or not
     * @param {!function} func
     * @returns {boolean}
     */
    #transformerValidP(func){
	if (typeof(func) !== "function"){
	    return false;
	}
	let ret = null
	try{
	    ret = func("DummyString");
	}catch{
	    return false;
	}
	if (typeof(ret) === "string"){
	    return true;
	}else{
	    return false;
	}
    }

    
    /**
     * make up li node from the header node and depth of it
     * @param {!number} depth
     * @param {HTMLHeadingElement}    hNode
     * @param {?boolean} addClass
     * @param {?boolean} tfText
     * @param {?boolean} setOnclick
     * @returns {HTMLLIElement}
     */
    #makeLi(depth, hNode, addClass, tfText, setOnclick){
	const liNode = document.createElement("li");
	
	const onclicker = function(event){
	    event.target.targNode.scrollIntoView({
		behavior: "smooth",
		block:    "start",
		inline:   "start",  ///around here needs to be configurable(´・ω・｀)
	    })
	};
	const cls = this.#liClsNames[depth];
	const tf  = this.#textTransformers[depth];
	
	if (addClass&&cls){
	    liNode.classList.add(...cls);
	}
	let textContent = hNode.textContent;
	if (tfText&&tf){
	    textContent = tf(textContent);
	}
	liNode.append(textContent);
	if (setOnclick){
	    liNode.targNode = hNode;//assigning hNode itself for when clicked
	    liNode.addEventListener("click", onclicker);
	}
	return liNode;
    }
    /**
     * make up wrapper element which would hold li elements inside it
     * @param {!number} depth
     * @returns {HTMLOListElement}
     */
    #makeWrapper(depth){
	const wrapper = document.createElement(this.#wrapperTag);
	const classes = this.#wrapperClasses[depth];
	if (classes){
	    wrapper.classList.add(...classes);
	}
	return wrapper;
    }

    /**
     * may returns -1 which means somethig not header tag!!
     * @param {HTMLHeadingElement} hNode
     * @returns {number}
     */
    #getDepth(hNode){
	const hName = hNode.nodeName.toLowerCase();
	return this.#seeds.indexOf(hName);
    }
    /**
     * @returns {HTMLOListElement}
     */
    #generateMenu(){
	const qs = document.querySelectorAll(this.#makeQuery());
	if (qs.length === 0){
	    return this.#makeWrapper(0);
	}
	const containers = this.#seeds.map( (_, depth) => this.#makeWrapper(depth));
	// [<ol></ol>, <ol></ol>,... , <ol></ol>]
	let prevDepth = 0;
	let currentDepth = null;
	
	qs.forEach( hNode =>{//which means header node
	    currentDepth = this.#getDepth(hNode);
	    const diff= currentDepth - prevDepth;
	    if (0 <= diff){//simply inserts li elems
		containers[currentDepth].append(this.#makeLi(currentDepth, hNode, true, true, true));
		prevDepth = currentDepth;
	    }else{//this pattern incurs partial reduction of ol elems(´・ω・｀)
		for (let depth = prevDepth; depth !== currentDepth; depth--){
		    containers[depth-1].append(containers[depth]);
		    //partial redcution you'd better to refactor(´・ω・｀)
		    containers[depth] = this.#makeWrapper(depth);
		    //assigns new container
		}
		containers[currentDepth].append(this.#makeLi(currentDepth, hNode, true, true, true));
		prevDepth = currentDepth;
	    }
	} );//end of qs.forEach;
	//wrap up! nests all wrappers who has children(´・ω・｀)
	for (let idx = containers.length-1; idx !== 0; --idx){
	    if (containers[idx].hasChildNodes()){
		containers[idx-1].append(containers[idx]);
	    }
	}
	if (this.#wrapperId.length !== 0){
	    containers[0].setAttribute("id", this.#wrapperId);
	}
	return containers[0];
    }
    /////////////////////////////////////////////////////////////////
    ////////////////////private methods of the class end/////////////




    /////////////////PUBLIC METHODS of the class begin///////////////
    /////////////////////////////////////////////////////////////////
    /**
     * @constructor 
     * @param  {string[]} headers Heading tags you want to add in the generated menu(only h1, h2, h3, h4, h5, h6 in order are valid args)
     * @throws Will throw error when header tags are out of order like ("h4", "h2"), when some of args not header tag like ("some", "h4") or when arg null like ()
     */
    constructor(...headers){
	if (headers.length === 0){
	    throw Error("Void headers given arg whose length === 0");
	}
	const validHs = ["h1","h2","h3","h4","h5","h6"];
	const seeds = headers.map( h => h.trim().toLowerCase() );
	let startIdx = 0;
	seeds.forEach( (s, i) => {
	    const atIdx = validHs.indexOf(s, startIdx);
	    if (-1 !== atIdx){//if s is a valid tag name
		startIdx = (atIdx+1);//for keeping the order of headers 
	    }else{//if s is not a valid
		throw Error(`Invalid arg '${headers[i]}'(index at ${i}) is not a header tag or out of order`);
	    }
	} );//seeds.forEach
	this.#seeds = seeds;
    }
    //////////////////////for Restricting Header Targets///////////////////
    /**
     * Restricting targeting headers by assigning to where division headers belong
     * @param {!string} type Type is string whose value must be one of "id" "class" or "tag"
     * @param {!string} name
     * @returns {MenuGenerator} <code>this</code>
     */
    setHeaderDiv(type, name){
	this.#where = this.#makeQueryHelper(type, name);
	return this;
    }
    
    /**
     * Restricting targeting headers by assigning to what class headers belong
     * @param {string} type Type is string whose value must be one of "id" "class" or "tag"
     * @param {string} name
     * @returns {MenuGenerator} <code>this</code>
     */
    setHeaderClass(className){
	this.#who = this.#makeQueryHelper("class", className);
	return this;
    }

    ////////////////////For Modifying Generating Menu//////////////////////
    /**
     * Add class name to the li elements whose depth is depth.
     * @param {!number} depth (0 <= depth < headers.length)
     * @param {!string} className Should not holds space inside of it.
     * @throws Will throw when depth refers outside or className holds whitespace.
     * @returns {MenuGenerator} <code>this</code>
     */
    addLiClass(depth, className){
	if (!this.#depthValidP(depth)){
	    throw Error(`${depth} at depth is out of range`);
	}
	const cn = className.trim();
	if (cn.includes(" ")){//needs refactoring(´・ω・｀)...
	    throw Error(`${className} at className is invalid holding white-space`);
	}

	    
	if (!this.#liClsNames[depth]){
	    this.#liClsNames[depth] = [cn];
	}else{
	    this.#liClsNames[depth].push(cn);
	}
	return this;
    }
    /**
     * Add class name to the all li elements.
     * @param {!string} className
     * @returns {MenuGenerator} <code>this</code>
     */
    addLiClassAll(className){
	for (let idx = 0; idx < this.#seeds.length; idx++){
	    this.addLiClass(idx, className);
	}
	return this;
    }
    /**
     * Add class name to the wrapper elements whose depth is depth.
     * @param {!number} depth
     * @param {!string} className
     * @returns {MenuGenerator} <code>this</code>
     */
    addWrapperClass(depth, className){
	if (!this.#depthValidP(depth)){
	    throw Error(`${depth} at depth is out of range`);
	}
	const cn = className.trim();
	if (cn.includes(" ")) {
	    throw Error(`${className} at className is invalid holding white-space`);
	}
	
	
	if (!this.#wrapperClasses[depth]) {
	    this.#wrapperClasses[depth] = [cn];
	} else {
	    this.#wrapperClasses[depth].push(cn);
	}
	return this;
    }
    /**
     * Add class name to the all li elements.
     * @param {!string} className
     * @returns {MenuGenerator} <code>this</code>
     */
    addWrapperClassAll(className){
	for (let idx = 0; idx < this.#seeds.length; idx++){
	    this.addWrapperClass(idx, className);
	}
	return this;
    }
    
    /**
     * Set transformer of the textContent of li whose depth is depth
     * if it is not set, header's textContent would be so
     * @param {!function} func
     * @param {!number}  depth
     * @returns {MenuGenerator} <code>this</code>
     */
    setTextTransformer(depth, func){
	if (!this.#depthValidP(depth)){
	    throw Error(`${depth} at depth is out of range`);
	}
	if (!this.#transformerValidP(func)){
	    throw TypeError("func need to be a function: (string) => string");
	}
	this.#textTransformers[depth] = func;
	return this;
    }
    /**
     * Set transformer of the textContent of all li elements
     * if it is not set, header's textContent would be so
     * @param {!function} func
     * @returns {MenuGenerator} <code>this</code>
     */
    setTextTransformerAll(func){
	for (let idx = 0; idx < this.#seeds.length; idx++){
	    this.setTextTransformer(idx, func);
	}
	return this;
    }
    
    /**
     * Set wrapper tags of the menu generated.
     * @param {!string} tagName Only ol or ul is applicable.
     * @returns {MenuGenerator} <code>this</code>
     */
    setWrapperTag(tagName){
	const tn = tagName.trim();
	const validTags = ["ol", "ul"];
	if (!validTags.includes(tn)){
	    throw Error(`${tagName} is not a valid tag`);
	}
	this.#wrapperTag = tn;
	return this;
    }
    /**
     * Set id of the outermost wrapper
     * @param {!string} idName Should not hold space inside of it.
     * @throws Will throw when idName holds white space inside of it.
     * @returns {MenuGenerator} <code>this</code>
     */
    setWrapperId(idName){
	const id = idName.trim();
	if (id.includes(" ")){
	    throw Error(`invalid idName ${idName}`);
	}//should also check uniqueness?(´・ω・｀)
	this.#wrapperId = id;
	return this;
    }
    /**
     * Place the generated menu into the division query selects. 
     * @param {!string} query The same as for querySelector.
     * @param {?boolean} appendP If it is not falthy appends into the selected division.
     * @throws Will throw when query selects nothing.
     * @returns {null}
     */
    embedMenu(query, appendP){
	const targ = document.querySelector(query);
	if (!targ){
	    throw Error(`${query} you feed at query selects nothing`);
	}
	const menu = this.#generateMenu();
	if (appendP){
	    targ.append(menu);
	}else{
	    targ.prepend(menu);
	}
	return null;
    }
    /////////////////////////////////////////////////////////////////
    /////////////////PUBLIC METHODS of the class end/////////////////

}//end of MenuGenertaor Class Definition
