require([
	'$views/list#List', 
	'$views/image#Image', 
	'$views/buttons#SubscribeButton'], 
	function (List, Image, SubscribeButton) {
	/**
	views module
	@module
	**/

	/**
	A playlist view
	@class
	**/
	exports.PlayView = function (playlist) {
		this.playlist = playlist;
		console.log("PL", playlist);
		this.node = document.createElement('table');
		var self = this;
		this.init = function () {
			console.log("Playlist", self.playlist);
			self.playlist.load('name', 'image').done(function (playlist) {
				
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');
				self.node.appendChild(td1);
				self.node.appendChild(td2);
				
				td1.setAttribute('width', '10%');
				td1.setAttribute('valign', 'top');
				td2.setAttribute('valign', 'top');

				var image = Image.forPlaylist(playlist);
				td1.appendChild(image.node);
				td2.innerHTML = "<span>" + playlist.name.decodeForText() + "<span><br />";
				var btnSubscribe = SubscribeButton.forPlaylist(playlist);
				td2.appendChild(btnSubscribe.node);

				// Create playlist
				var list = new List(playlist.tracks, {'fields': ['number', 'track', 'artist', 'popularity']});
				td2.appendChild(list.node);
				list.init();
				

			});
		}
	};
	exports.PlayView.forPlaylist = function (playlist) {
	
		return new exports.PlayView(playlist);
	};
});