var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');

button_login_twitch.addEventListener('click', loginTwitch, false);
button_login_youtube.addEventListener('click', loginYoutube, false);

function loginTwitch() {
    console.log('Logging into Twitch');
}

function loginYoutube() {
    console.log('Logging into YouTube');

    var oauth2_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2_endpoint);

    var params = {
        'client_id': '1050192004499-7vn2paspfb0r96m5kvh18hi5h2q68k2g.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:8000/oauth2-callback',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'state': 'requesting_account_connection'
    };
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
