
require([
	'strings/main.lang',
  	'$api/models',
 	'$views/image#Image',
 	'$views/tabbar#TabBar',
 	'$views/list#List',
 	'$views/buttons',
 	'$api/search#Search',
 	'sp://label/scripts/views#PlayView',
 	'$api/library#Library',
 	'sp://label/scripts/models'
], function(mainStrings, models, Image, TabBar, List, buttons, Search, PlayView, Library, omodels) {
  'use strict';
  
      // We use the data-string attribute to localize elements
      var localizedElements = document.querySelectorAll('[data-string]');
      	for(var i = 0; i < localizedElements.length; i++) {
      		var elm = localizedElements[i];
      		console.log(elm);
      		elm.innerHTML = mainStrings.get(elm.dataset['string']);
      	}
      	var loadLabel = function (args) {
          var label = omodels.Label.fromURI('spotify:label:krikelin');
          label.load('name', 'playlists', 'user', 'image').done(function (label) {
 
        		// Clean
        		document.getElementById('lTopList').innerHTML = "";
        		document.getElementById('logo').innerHTML = "";
        		document.getElementById('playlists').innerHTML = "";

        		document.getElementById('toolbar').innerHTML = "";
        		document.getElementById('artists').innerHTML = "";

        		console.log(label.image);

      			var avatar = null;
            if(label.user) {
              avatar = Image.forUser(label.user, {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
            } else {
              avatar = Image.fromSource(label.image, {width: 128, height: 128, style: 'rounded', 'placeholder': 'user', 'title': label.title});
      			}
            console.log(avatar.node);
            document.getElementById('logo').appendChild(avatar.node);
      			if(label.user) {
      				document.getElementById("ltitle").innerHTML = mainStrings.get('title', label.name.decodeForText());
      			
      			   var subscribeButton = buttons.SubscribeButton.forUser(label.user);
      			   document.getElementById('toolbar').appendChild(subscribeButton.node);
            }
            if(label.playlists) {
        			label.playlists.snapshot(0, 50).done(function (playlists) {
                console.log('d', playlists.length);
                for(var i = 0; i < playlists.length; i++) {
                  console.log('a');
                  var playlist = playlists.get(i);
                  if(playlist == null)
                    continue;
                  console.log("P", playlist);
                  var playView = PlayView.forPlaylist(playlist);
                  console.log('f', playView);
                  document.getElementById('playlists').appendChild(playView.node);
                  console.log(playView.node);
                  playView.init();
                }
              });
  	  		  }
        	
        		// Logo for label
        		
        			// Create list of top tracks
        	
        		var lTopList = List.forCollection(label.tracks, {throbber: 'hide-content', 'layout': 'toplist', 'style': 'rounded', 'numItems': 10});
        		document.getElementById('lTopList').appendChild(lTopList.node);
        		lTopList.init();
        		lTopList.focus();

        		var lTopArtists = List.forCollection(label.artists, {throbber: 'hide-content', 'type': 'artists', 'style': 'rounded', 'header': 'no', 'numItems': 10, 'fields':['image', 'artist']});
        		document.getElementById('artists').appendChild(lTopArtists.node);
        		lTopArtists.init();
          });
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
