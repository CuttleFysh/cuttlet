var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');
var button_logout_twitch = document.getElementById('button_logout_twitch');
var button_logout_youtube = document.getElementById('button_logout_youtube');

if (button_login_twitch) button_login_twitch.addEventListener('click', loginTwitch, false);
if (button_login_youtube) button_login_youtube.addEventListener('click', loginYoutube, false);
if (button_logout_twitch) button_logout_twitch.addEventListener('click', logoutTwitch, false);
if (button_logout_youtube) button_logout_youtube.addEventListener('click', logoutYoutube, false);

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
        'client_id': 'dyjm5o0cd24spkozqiyy3gue584olj',
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
        'client_id': '1050192004499-7vn2paspfb0r96m5kvh18hi5h2q68k2g.apps.googleusercontent.com',
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
    var params = 'youtube_channel=&csrfmiddlewaretoken=' +
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
