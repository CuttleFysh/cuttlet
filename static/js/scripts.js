
var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');

button_login_twitch.addEventListener('click', loginTwitch, false);
button_login_youtube.addEventListener('click', loginYoutube, false);

function loginTwitch() {
    console.log('Logging into Twitch');
}

function loginYoutube() {
    console.log('Logging into YouTube');
}
