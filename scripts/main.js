
require([
	'strings/main.lang',
  	'$api/models',
 	'$views/image#Image',
 	'$views/tabbar#TabBar',
 	'$views/list#List',
 	'$views/buttons',
 	'$api/search#Search',
 	'sp://label/scripts/views#PlayView',
 	'$api/library#Library'
], function(mainStrings, models, Image, TabBar, List, buttons, Search, PlayView, Library) {
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
  		document.getElementById('playlists').innerHTML = "";

  		document.getElementById('toolbar').innerHTML = "";

  		var user = models.User.fromURI('spotify:user:' + label.identifier);
  		if(user) {
  			var avatar = Image.forUser(user, {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
  			document.getElementById('logo').appendChild(avatar.node);
  			user.load('name').done(function (user) {
  				console.log(user);
  				document.getElementById("ltitle").innerHTML = mainStrings.get('title', user.name.decodeForText());
  			});
  			var subscribeButton = buttons.SubscribeButton.forUser(user);
  			document.getElementById('toolbar').appendChild(subscribeButton.node);

  			// Get playlists for view
  			var library = Library.forUser(user);
  			library.load('published').done(function (library) {
  				console.log('t', library);
  				library.published.snapshot(0, 100).done(function (playlists) {
  					console.log('d', playlists.length);
  					for(var i = 0; i < playlists.length; i++) {
  						console.log('a');
  						var playlist = playlists.get(i);
  						console.log("P", playlist);
	  					var playView = PlayView.forPlaylist(playlist);
	  					console.log('f', playView);
	  					document.getElementById('playlists').appendChild(playView.node);
	  					console.log(playView.node);
	  					playView.init();
	  				}
  				});
  			});
	  		
  		} else {
  			var avatar = Image.fromSource('img/label.png', {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
  			document.getElementById('logo').appendChild(avatar.node);
  			document.getElementById("ltitle").innerHTML = mainStrings.get('title', label.title.decodeForText());
  		
  		}
  		// Logo for label
  		
  		
  		var search = Search.search('label:' + label.identifier);
  		
  		// Create list of top tracks
  		console.log(search);
  		var lTopList = List.forCollection(search.tracks, {'layout': 'toplist', 'style': 'rounded', 'numItems': 5});
  		document.getElementById('lTopList').appendChild(lTopList.node);
  		lTopList.init();
  		lTopList.focus();
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
  loadLabel(['spotify']);

});
