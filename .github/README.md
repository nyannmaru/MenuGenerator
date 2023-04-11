# MenuGenerator
## Synopsis

As its name suggests this package generates click-to-go menu for your site.<br>

Collects header(only h1, h2, ... h6) tags of the site, distributes headers due ids<br>
And then generates and places menu elements(menu, nav, ul or ol) somewhere you like.

## Methods of MenuGenerator
Almost every(=other than **embedMenu**) APIs in MenuGenerator is self-referencial so you can use it with method chain.<br>
### List of Methods
> <font color="brown">Belows are mehtods for selecting headers more precisely  </font>

| Method Name | Method Discription |
| :----: | :-----------------------: |
| constructor(...headers) |	headers is Array of string "h1", "h2", etc. You can determine which header elements to be collected.|
| setHeadersDivision(type, name) | type is either **"id"**, **"class"** or **"tag"**, you can restrict which divisions headers to be collected|
| setHeadersClassName(cName) | cName is a string object if you set this headers with the class name to be selected |


> <font color="brown">Belows are mehtods for modifying the generated menu  </font>

| Method Name | Method Discription |
| :----: | :-----------------------: |
| setWrapperTag(tagName) | tagName is either **"menu"**, **"nav"**, **"ul"** or **"ol"** this determines which element to be used as a container. If you do not select this "ul" is selected |
| setWrapperId(idName) | idName is a string object if you set this, the generated menu to have this id attribute. |
| prependMenu(textContent, href) | textContent and href is a string object. You can add "```<li><a href="href">textContent</a></li>```" element to the head of the generated menu |
| appendMenu(textContent, href) | Basically the same with **prependMenu** but to the bottom of the menu |
| addWrapperClassNames(depth, className) | Add class name to the  |
| addLiClassName(depth, className) | depth is a number and className is a string object. If you set this all li element of the generated menu whose nesting level is depth to have its class attribute |
| addAllLiClassName(className) | Basically the same with the **addLiClassName** but for all nesting levels |
| setIdTransformers(depth, functor) | depth is a number object and functor is a Function object which takes one string object as an argument and returns one string object. this transoformer would be used when making the id value of the headers with nesting level is depth. when you do not set this one default setter ```textContent => "chapter_" + textContent``` would be used  |
| setTextTransformers(depth, functor) | Basically the same with the **setIdTransformers** but for making textContents of a elements|

> <font color="brown">Belows are mehtods for placing the generated menu  </font>

| Method Name | Method Discription |
| :----: | :-----------------------: |
| embedMenu(selector) | selector is a string object, selector is the same with one of **querySelector**. Appends the generated menu element to the selected element |



## How to use with examples
