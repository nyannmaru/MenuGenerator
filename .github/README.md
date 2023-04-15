MenuGenerator
====================

## Overview

<figure>
<img src="./pic/menGenOverview.png" width="97%" height="auto" alt="overview">
<figcaption align="center">Overviwe of MenuGenerator</figcaption>
</figure>

`MenuGenerator` is the class for the `automatic generation` of `the click to go navigation menu` to the due heading elements inside of your site.  

All things MenuGenerator does and you have to do is

1. Collecting heading elements
2. Generating due click-to-go menu
3. Embedding the menu somewhere you like


## Specific-Terms
In order to use methods of MenuGenerator corrctly there exists few words that you have to understand beforehand.  
Perhap it is simply caused by my shitty nomenclature though...(´・ω・｀)

 | TERM    | MEANING                                          |
 |---------|:------------------------------------------------:|
 | Wrapper | HTML Tag in where all li elements would be hold. In the upper picture, sginifies <font color="green">`ol`</font> elements |
 | Heading Elements | Only `h1`, `h2`, `h3`, `h4`, `h5`, `h6`(case-insensitive) |
 | Depth   | 0 <= Depth < 6 is a natural number which would be distibuted to each heading elemnts, li elements and wrapper elements as its index-number, when you call the constructor. In the upper picture `h1` is indexed to depth = 0, and `h2` done to depth = 1. |
 | TextTranformer | This is a `function` which takes `one string` object and returns `one string` object. ex) ```javascript text => text + "appendix"``` etc |


## Methods
	
	There exists three patterns method. 
	
	 
1. Determins whose class or where heading elements should be taken into account
	
2. Modifies the generating menu
	 
3. Embeds the generated menu

All methods except for `embedMenu` is self-referencial so you can call them in a method chaining style.

### Determiners
 | NAME    |   DESCRIPTION                                    |
 |---------|:------------------------------------------------:|
 | constructor | Makes MenuGenerator object. Array of some of heading elements in orders are valid argument such as like `MenuGenerator("h2", "h4")` , this instance is to treat heading elements `h2`, `h4` as `target headings`. At the same time indexes depth `0` to `h2` and depth `1` to `h4`. But `MenuGenerator("h4", "h2")` is not valid, because it is out of order(smaller heading comes first), `MenuGenerator("haha", "h2")` is also not valid, because "haha" is not a heading element. |
 | setHeaderClass | This `restricts` targeting headings by assigning specific className |
 | setHeaderDiv   | This `restricts` targeting headings by assigning to where headings belong |
 
 
### Modifiers
 | NAME    |   DESCRIPTION                                    |
 |---------|:------------------------------------------------:|
 | addLiClass | Add class attributes to the generating menu's li at specific depth. |
 | addLiClassAll | The same with `addLiClass` but for all depth. |
 | addWrapperClass | Add class attributes to the generating menu's wrapper tag at specific depth. |
 | addWrapperClassAll | The same with `addWrapperClass` but for all depth. |
 | setTextTransformer | This is to to modify the textContent of generating menu's li elements at specific depth. TextTransformer would be take a textContent of heading elemnts and its return value would be a textContent of the li. If not set default textTranformer ```javascript (tc) => tc```would be used. |
 | setTextTransformerAll | The same with `setTextTransformer` but for all depth. |
 | setWrapperTag | This is to select the wrapper tag. only either `ul` or `ol` are available. If not set `ol` is selected |
 | setWrapperId | This is to set the outermost wrapper's id attribute |


### Embedder
 | NAME    |   DESCRIPTION                                    |
 |---------|:------------------------------------------------:|
 | embedMenu | This is to embed the generated menu somewhere you like on DOM object |



## How-To-Use

If you want to use MenuGenerator on your site add next line into `head` tag(using `jsdelivr`)

```html
<script src="https://cdn.jsdelivr.net/gh/nyannmaru/MenuGenerator@main/MenuGenerator.js"></script>
```

Or `Download` MenuGenerator and `paste` it into `script` tag(I strongly recommend this way, since I'm not knowing about git well, I may cause debacle...(´・ω・｀))


### Examples
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>MenGenDemo</title>
	<script src="https://cdn.jsdelivr.net/gh/nyannmaru/MenuGenerator@main/MenuGenerator.js" async></script>
	<script>
     addEventListener("load", () => {
	 const mg = new MenuGenerator("h2", "h3");
	 //you can call methods in a chain
	 mg.setHeaderDiv("tag", "main")//only inside <main></main>
	   .addLiClass(0,"chapter_num").addLiClass(1,"section_name")
	   .addLiClassAll("click_togo_menu")
	   .setTextTransformer(1,
			       /**
				* @param {!string} tc
				* @returns {!string}
				*/
			       tc => {
				   const bidx = tc.indexOf("boy");
				   tc = tc.replace("girl", "boy");
				   if (bidx !== -1){
				       tc = tc.substr(0,bidx) + "girl" + tc.substr(bidx+"boy".length);
				   }
				   return tc;
	   })//"boy meets girl" ==> "girl meets boy"
	   .embedMenu("#container");
     });

    </script>
    <style>
     /*clarify the position of nav*/
     .red{color: red;}
     /*make scrolls noticible*/
     h2 + div{min-height: 50vh;}
     h3 + div{min-height: 50vh;}
     
    </style>
  </head>
  <body>
    <header>
      <h1>Site-Title</h1>
      <h2>site-discription</h2>
    </header>
    <aside>
      <p class="red">======NAV TOP=======</p>
      <nav id="container"></nav>
      <p class="red">======NAV BOTTOM======</p>
    </aside>
    <main>
      <h2>Chapter1</h2>
      <div>
	<h3>boy meets girl</h3>
	<div>
	  <p>
	    when the day was bright sunny day...
	  </p>
	</div>
	<h3>they quarrel with each other</h3>
	<div>
	  <p>
	    the reason was so trivial that nobody can recall...
	  </p>
	</div>
	<h3>they come to peace</h3>
	<div>
	  <p>
	    they noticed the fact that they'd both forgotten the reason.
	  </p>
	</div>
      </div>
      <h2>Chapter2</h2>
      <div>
	<h3>boy's rival shows up</h3>
	<div>
	  <p>
	    he saw the other boy shows up from behind the door...
	  </p>
	</div>
	<h3>calmness bofore the storm</h3>
	<div>
	  <p>
	    she said "I went shopping with my sister"...
	  </p>
      </div>
    </main>
    <footer>

    </footer>
  </body>
</html>
```

If you `Copy and Paste` this `HTML` and `Open in some Browser`, you can see a coarse(because it it simple ol li elements, it's your job to stylize them) navigation menu, and if you click or tap some of them you can ensure click to go utility.


## At-Last

I may add css examples for stylizing them in the future.  
Have a happy webDev(´・ω・｀)
