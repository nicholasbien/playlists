var SpotifyAPI = {};

SpotifyAPI.timeout = 10000;

SpotifyAPI.getUserId = function(accessToken, callback) {
    var url = 'https://api.spotify.com/v1/me';
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function() {
        callback('The request timed out. Please try again');
    };
    xhr.onload = function() {
        if (xhr.status !== 200) {
            callback(xhr.responseText);
        } else {
            var response = JSON.parse(this.responseText);
            callback(null, response.id);
        }
    };
    xhr.open('GET', url);
    xhr.timeout = SpotifyAPI.timeout;
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.send();
}

SpotifyAPI.createPlaylist = function(accessToken, userId, playlistName, callback) {
    var url = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function() {
        callback('The request timed out. Please try again');
    };
    xhr.onload = function() {
        if (xhr.status !== 200 && xhr.status !== 201) {
            callback(xhr.responseText);
        } else {
            var response = JSON.parse(this.responseText);
            callback(null, response.id);
        }
    };
    xhr.open('POST', url);
    xhr.timeout = SpotifyAPI.timeout;
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var body = JSON.stringify({
        'name': playlistName,
        'public': false
    });
    xhr.send(body);
}

SpotifyAPI.addTracksToPlaylist = function(accessToken, userId, playlistId, spotifyURIs, callback) {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks';
    xhr.ontimeout = function() {
        callback('The request timed out. Please try again');
    };
    xhr.onload = function() {
        if (xhr.status !== 200 && xhr.status !== 201) {
            return callback(xhr.responseText);
        } else {
            callback(null);
        }
    };
    xhr.open('POST', url);
    xhr.timeout = SpotifyAPI.timeout;
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var body = JSON.stringify({
        'uris': spotifyURIs
    });
    xhr.send(body);
};