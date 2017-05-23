const CLIENT_ID_TWITCH = 'dyjm5o0cd24spkozqiyy3gue584olj';
const CLIENT_ID_YOUTUBE = '1050192004499-7vn2paspfb0r96m5kvh18hi5h2q68k2g.apps.googleusercontent.com';
const API_KEY_YOUTUBE = 'AIzaSyAdCxzlvqQS1653t0sAB4STdHbP2fzvr1E';

// For testing:
// to find twitch user id, use GET request in browser:
// https://api.twitch.tv/kraken/search/channels?query="onlinechannel"&client_id=dyjm5o0cd24spkozqiyy3gue584olj
// For youtube use chilled_cow stream lofi hip hop (check if it is online):
// UCSJ4gkVC6NrvII8umztf0Ow
// or use to find a live straming channels
// https://www.googleapis.com/youtube/v3/search?type=channel&q={{channel name}}&maxResults=25&part=snippet&key=AIzaSyAdCxzlvqQS1653t0sAB4STdHbP2fzvr1E
// var info_channels = document.getElementById('info_connected_channels');
// var twitch_id = info_channels.getAttribute('data-twitch-id');
// var youtube_id = info_channels.getAttribute('data-youtube-id');
var twitch_id = '41314239';
var youtube_id = 'UC-lHJZR3Gqxm24_Vd_AJ5Yw';

var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');
var button_logout_twitch = document.getElementById('button_logout_twitch');
var button_logout_youtube = document.getElementById('button_logout_youtube');
var button_reload_channels_info = document.getElementById('button_reload_channels_info');

if (button_login_twitch) button_login_twitch.addEventListener('click', loginTwitch, false);
if (button_login_youtube) button_login_youtube.addEventListener('click', loginYoutube, false);
if (button_logout_twitch) button_logout_twitch.addEventListener('click', logoutTwitch, false);
if (button_logout_youtube) button_logout_youtube.addEventListener('click', logoutYoutube, false);
if (button_reload_channels_info) button_reload_channels_info.addEventListener('click', checkConnectionToChannels, false);

function completeAndSubmitForm(params, form) {
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}


function loginTwitch() {
    console.log('Logging into Twitch');
    var twitch_oauth2_endpoint = 'https://api.twitch.tv/kraken/oauth2/authorize';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', twitch_oauth2_endpoint);
    var params = {
        'client_id': CLIENT_ID_TWITCH,
        'redirect_uri': 'http://localhost:8000/twitch_oauth2_callback',
        'response_type': 'token',
        'scope': 'user_read',
        'force_verify': 'true',
    }
    completeAndSubmitForm(params, form);
}

function loginYoutube() {
    console.log('Logging into YouTube');
    var youtube_oauth2_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', youtube_oauth2_endpoint);
    var params = {
        'client_id': CLIENT_ID_YOUTUBE,
        'redirect_uri': 'http://localhost:8000/youtube_oauth2_callback',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'prompt': 'select_account consent',
    };
    completeAndSubmitForm(params, form);
}

function logoutTwitch() {
    var xhr = new XMLHttpRequest();
    var url = 'twitch_oauth2_callback/';
    var params = 'twitch_channel=&csrfmiddlewaretoken=' +
                    document.getElementsByName('csrfmiddlewaretoken')[0].value;
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.reload();
        }
    };
    xhr.send(params);
}

function logoutYoutube() {
    var xhr = new XMLHttpRequest();
    var url = 'youtube_oauth2_callback/';
    var params =
            'youtube_channel=&' +
            'csrfmiddlewaretoken=' + document.getElementsByName('csrfmiddlewaretoken')[0].value;
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.reload();
        }
    };
    xhr.send(params);
}

function checkConnectionToChannels() {
    if (button_logout_twitch) updateIsTwitchOnline();
    if (button_logout_youtube) updateYoutubeIsOnline();
}

function updateTwitchUsernameAndThumbnail() {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.twitch.tv/kraken/users/' + twitch_id;
    xhr.open('GET', url);
    xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    xhr.setRequestHeader('Client-ID', CLIENT_ID_TWITCH);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var r = JSON.parse(xhr.response);
            var img_channel_thumbnail = document.getElementById('img_twitch_thumbnail');
            var field_twitch_username = document.getElementById('field_twitch_username');
            img_channel_thumbnail.src = r.logo;
            field_twitch_username.innerHTML = r.name;
        }
    };
    xhr.send(null);
}

function updateIsTwitchOnline() {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.twitch.tv/kraken/streams/' + twitch_id;
    xhr.open('GET', url);
    xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    xhr.setRequestHeader('Client-ID', CLIENT_ID_TWITCH);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            r = JSON.parse(xhr.response);
            var field_is_online = document.getElementById('is_online_twitch');
            console.log(r);
            if (r.stream) {
                field_is_online.innerHTML = 'ONLINE';
            } else {
                field_is_online.innerHTML = 'OFFLINE';
            }
        }
    };
    xhr.send(null);
}

function updateYoutubeIsOnline() {
    // Devlopment requires live video
    // Use chilled cow, Channel id: UCSJ4gkVC6NrvII8umztf0Ow
    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/youtube/v3/search?';
    var params =
        'part=snippet&' +
        'channelId=' + youtube_id + '&' +
        'eventType=live&' +
        'type=video&' +
        'key=' + API_KEY_YOUTUBE;
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var r = JSON.parse(xhr.response);
            var field_is_online = document.getElementById('is_online_youtube');
            console.log(r);
            if (r.pageInfo.totalResults > 0) {
                field_is_online.innerHTML = 'ONLINE';
            } else {
                field_is_online.innerHTML = 'OFFLINE';
            }
        }
    };
    xhr.send(null);
}

function updateYoutubeChannelNameAndThumbnail() {
    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/youtube/v3/channels?'
    var params =
            'part=snippet&' +
            'id=' + youtube_id + '&' +
            'key=' + API_KEY_YOUTUBE;
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var r = JSON.parse(xhr.response);
            var img_channel_thumbnail = document.getElementById('img_youtube_thumbnail');
            var field_channel_name = document.getElementById('field_youtube_channel');
            img_channel_thumbnail.src = r.items[0].snippet.thumbnails.default.url;
            field_channel_name.innerHTML = r.items[0].snippet.title;
        }
    };
    xhr.send(null);
}

window.onload = function () {
    if (button_logout_twitch) updateTwitchUsernameAndThumbnail();
    if (button_logout_youtube) updateYoutubeChannelNameAndThumbnail();
    checkConnectionToChannels();
}
