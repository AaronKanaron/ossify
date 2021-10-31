// __          __  _             _             _                _       _____ _____  _  __
// \ \        / / | |           | |           | |              | |     / ____|  __ \| |/ /
//  \ \  /\  / /__| |__    _ __ | | __ _ _   _| |__   __ _  ___| | __ | (___ | |  | | ' / 
//   \ \/  \/ / _ \ '_ \  | '_ \| |/ _` | | | | '_ \ / _` |/ __| |/ /  \___ \| |  | |  <  
//    \  /\  /  __/ |_) | | |_) | | (_| | |_| | |_) | (_| | (__|   <   ____) | |__| | . \ 
//     \/  \/ \___|_.__/  | .__/|_|\__,_|\__, |_.__/ \__,_|\___|_|\_\ |_____/|_____/|_|\_\
//                        | |             __/ |                                           
//                        |_|            |___/                                            



window.onSpotifyWebPlaybackSDKReady = () => {
	//The main constructor for initializing the Web Playback SDK. It should contain an object with the player name, volume and access token.
	const player = new Spotify.Player({
		name: "Aaron",
		getOAuthToken: callback => { callback(localStorage.getItem("access_token")); },
		volume: 0.5
	});

	//VARIABLES
	let duration_ms = 0
	let position_ms = 0



	// Ready
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID: %c' + device_id, "color: #0099cc");
	});



	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});

	player.addListener('initialization_error', ({ message }) => { 
		console.error(message);
	});

	player.addListener('authentication_error', ({ message }) => {
		console.error(message);
	});

	player.addListener('account_error', ({ message }) => {
		console.error(message);
	});

	//FUNCTION BUTTONS
	
	document.getElementById('togglePlay').onclick = function() {
		player.togglePlay();
	};

	document.getElementById('nextTrack').onclick = function() {
		player.nextTrack().then(() => {
			console.log('Skipped to next track!');
		});
	};

	document.getElementById('prevTrack').onclick = function() {
		player.previousTrack().then(() => {
			console.log('Set to previous track!');
		});
	};


	document.getElementById('volume').addEventListener("change", (event) => {
		player.setVolume(event.target.value/100).then(() => {
			console.log("Volume Changed To:%c " + event.target.value + "%", "color: #00695c")
		})
	})

	//Change Place In Song
	document.getElementById('seek').addEventListener("change", (event) => {
		player.seek(duration_ms * (event.target.value / 100)).then(() => {
			console.log("Seeked " + duration_ms * (event.target.value / 100) + "ms into the song, out of: " + duration_ms)
		})
	})


	player.connect().then(success => {
		if (success) {
			console.log('%cThe Web Playback SDK successfully connected to Spotify!', "color: #0c925f");
		}
		else {
			console.log('%cThe Web Playback SDK successfully connected to Spotify!', "color: #ff4444");
		}
	})
	
	player.addListener('player_state_changed', ({
		position,
		track_window: { current_track }
	}) => {
		console.log(current_track);
		position_ms = position;
		duration_ms = current_track.duration_ms
		renderText("track_name", current_track.name)
		renderText("track_artist", current_track.artists)

	});

	//UPDATE PROGRESSBAR
	setInterval(() => {
		// currentPlaying("https://api.spotify.com/v1/me/player/currently-playing")
		console.log(position_ms*100/duration_ms + "% of the track")
		document.getElementById('seek').value = position_ms*100/duration_ms
	}, 500);
}

console.log(localStorage.getItem("access_token"))

async function currentPlaying(url) {
	//Get CurrentPlaying
	fetch("https://api.spotify.com/v1/me/player/currently-playing", { 
		method: "GET",
		headers: {
			"Accept": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("access_token"),
			"Content-Type": "application/json"
		}
	}).then(function(response) {
		return response.text();
	}).then(function(data) {
		console.log(data);
	})
}




function renderText(element, text) {
	if(typeof(document.getElementById(element)) != undefined && document.getElementById(element) != null) {
		Array.from(document.querySelectorAll("#"+element)).forEach((element) => {
			if(Array.isArray(text)){
				text.map((map_element) =>{
					element.innerHTML = ""
					element.innerHTML += map_element.name;
				})
			} else{
				element.innerHTML = text;
			}
		})
	} else{
		console.log("%cNo Element found for: " + element, "color:#FF0000")
	}
}