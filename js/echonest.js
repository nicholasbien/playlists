var EchoNestAPI = {};

EchoNestAPI.timeout = 10000;

EchoNestAPI.getPlaylist = function(artist, genre, numResults, callback) {
    var url = 'http://developer.echonest.com/api/v4/playlist/static'
        + '?api_key=ABFI7P4WHSMYRUEJ4'
        + '&bucket=id:spotify'
        + '&bucket=tracks'
        + '&results=' + numResults;

    if (artist) {
        url += '&type=artist-radio'
        + '&artist=' + encodeURIComponent(artist);
    }
    if (genre) {
        url += '&type=genre-radio'
        + '&genre=' + encodeURIComponent(genre);
    }
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function() {
        callback('The request timed out. Please try again');
    };
    xhr.onload = function() {
        if (xhr.status !== 200) {
            return callback(xhr.responseText);
        } else {
            var response = JSON.parse(xhr.responseText);
            if (response.response.status.code === 5) {
                callback('No results could be found. Please try again.');
            } else {
                var songs = response.response.songs;
                var spotifyURIs = songs.map(function(song) {
                    var tracks = song.tracks;
                    if (tracks.length === 0) {
                        return null;
                    } else {
                        return tracks[0].foreign_id;
                    }
                });
                spotifyURIs = spotifyURIs.filter(function(uri) {
                    return uri !== null;
                });
                callback(null, spotifyURIs);
            }
        }
    };
    xhr.open('GET', url);
    xhr.timeout = EchoNestAPI.timeout;
    xhr.send();
};