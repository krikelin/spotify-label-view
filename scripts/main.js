
require([
	'strings/main.lang',
  	'$api/models',
 	'$views/image#Image',
 	'$views/tabbar#TabBar',
 	'$views/list#List',
 	'$api/search#Search',
], function(mainStrings, models, Image, TabBar, List, Search) {
  'use strict';

  // We use the data-string attribute to localize elements
  var localizedElements = document.querySelectorAll('[data-string]');
  	for(var i = 0; i < localizedElements.length; i++) {
  		var elm = localizedElements[i];
  		console.log(elm);
  		elm.innerHTML = mainStrings.get(elm.dataset['string']);
  	}
  	var loadLabel = function (args) {
  		var label = {
  			title: args[0],
  			identifier: args[0]
  		};
  		// Clean
  		document.getElementById('lTopList').innerHTML = "";
  		document.getElementById('logo').innerHTML = "";


  		var user = models.User.fromURI('spotify:user:' + label.identifier);
  		if(user) {
  			var avatar = Image.forUser(user, {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
  			document.getElementById('logo').appendChild(avatar.node);
  		} else {
  			var avatar = Image.fromSource('img/label.png', {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
  			document.getElementById('logo').appendChild(avatar.node);
  		}
  		// Logo for label
  		
  		
  		var search = Search.search('label:' + label.identifier);
  		
  		// Create list of top tracks
  		console.log(search);
  		var lTopList = List.forCollection(search.tracks, {'layout': 'toplist', 'style': 'rounded', 'numItems': 5});
  		document.getElementById('lTopList').appendChild(lTopList.node);
  		lTopList.init();
  	};
  var tabBar = TabBar.withTabs([
    {id: 'overview', name: 'Overview', active: true}
  ]);
  tabBar.addToDom(document.getElementById('header'), 'after');
  // Find items
  models.application.addEventListener('arguments', function () {
  	models.application.load('arguments').done(function (a) {
  		loadLabel(a.arguments);
  	});
  })
  loadLabel(['krikelin']);

});
