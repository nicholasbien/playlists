function authorizeUser(event) {
    event.preventDefault();

    var status = document.getElementById('status');

    var selected = document.querySelector('input[name="type"]:checked');
    if (selected) {
        var playlistType = selected.value;
        localStorage.setItem('playlistType', playlistType);
        var query = document.getElementById('query').value;
        if (query != '') {
            localStorage.setItem('query', query);
        window.location = 'https://accounts.spotify.com/authorize?client_id=999d4ee5cddc4a53aa942ac43799a5f8&response_type=token&scope=playlist-modify-private&redirect_uri=' + window.location + '&show_dialog=true';
        } else {
            status.innerHTML = 'Please enter a search query.'
        }
    } else {
        status.innerHTML = 'Please select a playlist type.';
    }
    
    return false;
}

(function() {
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    var params = getHashParams();

    var accessToken = params.access_token;
    //var state = params.state;
    //var storedState = localStorage.getItem(stateKey);

    if (accessToken) {
        history.pushState(null, null, '/playlists');

        var status = document.getElementById('status');
        status.innerHTML = 'Creating your playlist...';

        var playlistType = localStorage.getItem('playlistType');
        var query = localStorage.getItem('query');

        String.prototype.capitalize = function(){
            return this.toLowerCase().replace( /\b\w/g, function (m) {
                return m.toUpperCase();
            });
        };

        var playlistName = query.capitalize() + ': Recommended';

        var artist, genre;
        if (playlistType == 'artist') {
            artist = query;
            genre = null;
        } else {
            genre = query;
            artist = null;
        }

        SpotifyAPI.getUserId(accessToken, function(error, userId) {
            if (error) status.innerHTML = error;
                else EchoNestAPI.getPlaylist(artist, genre, 20, function(error, spotifyURIs) {
                if (error) status.innerHTML = error;
                else SpotifyAPI.createPlaylist(accessToken, userId, playlistName, function(error, playlistId) {
                    if (error) status.innerHTML = error;
                    else SpotifyAPI.addTracksToPlaylist(accessToken, userId, playlistId, spotifyURIs, function(error) {
                        if (error) status.innerHTML = error;
                        else reportSuccess(userId, playlistId);
                    });
                });
            });
        });

        function reportSuccess(userId, playlistId) {
            status.innerHTML = 'Success! View your playlist '
                + '<a href="https://open.spotify.com/user/' + userId 
                + '/playlist/' + playlistId 
                + '" target="_blank" style="text-decoration: underline;">here</a> or in the Spotify app.';
        }
    }
})();