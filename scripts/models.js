/**
models
@module
**/
require([
	'$api/models',
	'$api/search#Search',
	'$api/library#Library'],
	function (models, Search, Library) {
		/**
		Label
		@class
		@inherits Loadable
		**/
		exports.Label = function (uri) {
			function getIdentifier(label) {
			  	if(label == 'record union') {
			  		return "recordunionmusic";
			  	}
			  	if(label == 'krikelin') {
			  		return "drsounds"
			  	}
			  	return label;
			}
		 	function getSearch(label) {
			  		if(label == 'krikelin') {
			  			return 'label:krikelin OR artist:\"Dr. Sounds\"';
			  		}
			  		if(label == 'spotify') {
			  			return 'year:0-3000';
			  		}
			  		return 'label:' + label;
		  	}
			console.log("uri", uri);
			this.uri = uri;
			var self = this;
			if(!uri.indexOf('spotify:label:') == 0) {
				throw "Invalid URI";
			}
			this._load = function (e) {
				var labelId = this.uri.split(':')[2];
				this.resolve('name', labelId);
				this.resolve('image', 'img/label.png');
				var search = Search.search(getSearch(labelId));
				this.resolve('tracks', search.tracks);
				this.resolve('albums', search.albums);
				this.resolve('artists', search.artists);
				var user = models.User.fromURI('spotify:user:' + getIdentifier(labelId));
				if(user) {
					user.load('name', 'image').done(function (user) {
						self.resolve('user', user);
						self.resolve('name', user.name);
						// Get playlists for view
			  			var library = Library.forUser(user);
			  			library.load('published').done(function (library) {
			  				console.log('t', library);
			  				self.resolve('playlists', library.published);
			  				self.resolveDone(); 
			  			});
			  			self.resolveDone(); 
					});
				} else {
					self.resolve('image', 'img/label.png');
					self.resolveDone(); 
				}
			};
		};
		exports.Label.prototype = new models.Loadable();
		models.Loadable.define(exports.Label, ['name', 'tracks', 'albums', 'playlists', 'image', 'artists'], '_load');


});