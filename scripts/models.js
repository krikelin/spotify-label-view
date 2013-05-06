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
			/*function getIdentifier(label) {
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
		  	}*/
			console.log("uri", uri);
			this.uri = uri;
			var self = this;
			if(!uri.indexOf('spotify:label:') == 0) {
				throw "Invalid URI";
			}
			this._load = function (e) {
				var xmlHttp = new XMLHttpRequest();
				var labelId = this.uri.split(':')[2];
				xmlHttp.onreadystatechange = function () {
					if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
						var json = eval("(" + xmlHttp.responseText + ")"); // TODO change this
						self.resolve('name', labelId);
						self.resolve('image', 'img/label.png');
						var search = Search.search("label:" + labelId);
						self.resolve('tracks', search.tracks);
						self.resolve('albums', search.albums);
						self.resolve('artists', search.artists);
						if(typeof(json['label']) !== 'undefined') {
							console.log(json);
							if(json['label']['Label']['user'] != null) {
								var user = models.User.fromURI('spotify:user:' + json['label']['Label']['user']);
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
							} else {
								self.resolve('image', 'img/label.png');
								self.resolveDone(); 
							}
						} else {
							self.resolve('image', 'img/label.png');
							self.resolveDone(); 
						}
					}
				};
				xmlHttp.open("GET", "http://ws28.spotify.com/labels/view/" + labelId + ".json", true);
				xmlHttp.send(null);
			};
		};
		exports.Label.prototype = new models.Loadable();
		exports.Label.fromURI = function (uri) {
			return new exports.Label(uri);
		}
		models.Loadable.define(exports.Label, ['name', 'tracks', 'albums', 'user', 'playlists', 'image', 'artists'], '_load');


});