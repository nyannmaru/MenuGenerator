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
