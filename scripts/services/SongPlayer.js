(function () {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        var currentAlbum = Fixtures.getAlbum();

        var getSongIndex = function (song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
         * @desc Buzz object audio file
         * @type {Object}
         */
        SongPlayer.currentSong = null;
        var currentBuzzObject = null;
        /**
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
        SongPlayer.currentTime = null;

        /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */
        var setSong = function (song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function () {
                $rootScope.$apply(function () {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };

        /**
         * @function stopSong
         * @desc stop currently playing song
         * @param {Object} song
         */
        var stopSong = function (song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        var playSong = function (song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        /**
         * @function play
         * @desc Play current or new song
         * @param {Object} song
         */
        SongPlayer.play = function (song) {
            song = song || SongPlayer.currentSong; //The first condition occurs when we call the methods from the Album view's song rows,                                                      // and the second condition occurs when we call the methods from the player bar.
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        /**
         * @function pause
         * @desc Pause current song
         * @param {Object} song
         */
        SongPlayer.pause = function (song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        /**
         * @function previous
         * @desc play previous song.  Go to last song if this is first song.
         * @param {Object}
         */
        SongPlayer.previous = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                // stopSong(song);
                var song = currentAlbum.songs[currentAlbum.songs.length - 1];
                setSong(song);
                playSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        /**
         * @function next
         * @desc play next song. Go back to first song if this is last song 
         * @param {Object}
         */
        SongPlayer.next = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= currentAlbum.songs.length) {
                // stopSong(song);
                var song = currentAlbum.songs[0];
                setSong(song);
                playSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
        SongPlayer.setCurrentTime = function (time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
