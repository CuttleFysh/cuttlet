var header_dropdown = document.getElementById('header_dropdown');
var header_info_stream = document.getElementById('header_info_stream');
var header_info_user = document.getElementById('header_info_user');
var header_user_img = document.getElementById('header_user_img');
var header_username = document.getElementById('header_username');
var header_ml = document.getElementById('header_ml');

if (header_dropdown) document.addEventListener('click', checkHiddenOnClick, false);
if (header_info_stream) window.addEventListener('load', loadStreamInfo, false);
if (header_info_user) {
    header_info_user.addEventListener('click', showDropdown, false);

    
}

function checkHiddenOnClick() {
    if(!event.target.closest('#header_info_user')) {
        if (getComputedStyle(header_dropdown).display === 'block') {
            console.log('kp');
            header_dropdown.classList.toggle('hidden');
        }
    }
}

function showDropdown() {
    header_dropdown.classList.toggle('hidden');
}

function updateIsTwitchLive(channel_id) {
    var xhr = new XMLHttpRequest();
    var url = 'https://api.twitch.tv/kraken/streams/' + channel_id;
    xhr.open('GET', url);
    xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    xhr.setRequestHeader('Client-ID', 'dyjm5o0cd24spkozqiyy3gue584olj');
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            r = JSON.parse(xhr.response);
            var header_thumb_stream = document.getElementById('header_thumb_stream');
            var header_title_stream = document.getElementById('header_title_stream');
            var header_viewers = document.getElementById('header_viewers');
            var header_is_live = document.getElementById('header_is_live');
            console.log(r);
            if (r.stream) {
                header_thumb_stream.src = r.stream.preview.small;
                header_title_stream.innerHTML = r.stream.channel.status;
                header_viewers.innerHTML = r.stream.viewers;
                localStorage.setItem('streamid', r.stream.channel.name);
                header_is_live.dataset.islive = 'true';
                header_is_live.innerHTML = 'LIVE';
            } else {
                header_title_stream.innerHTML = 'NO STREAM';
                header_viewers.innerHTML = '0';
                localStorage.setItem('streamid', '');
                header_is_live.dataset.islive = 'false';
                header_is_live.innerHTML = 'OFFLINE';
            }
        }
    };
    xhr.send(null);
}

function updateIsYoutubeLive(channel_id) {
    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/youtube/v3/search?';
    var params =
        'part=snippet&' +
        'channelId=' + channel_id + '&' +
        'eventType=live&' +
        'type=video&' +
        'key=' + 'AIzaSyAdCxzlvqQS1653t0sAB4STdHbP2fzvr1E';
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var r = JSON.parse(xhr.response);
            var header_thumb_stream = document.getElementById('header_thumb_stream');
            var header_title_stream = document.getElementById('header_title_stream');
            var header_viewers = document.getElementById('header_viewers');
            var header_is_live = document.getElementById('header_is_live');
            console.log(r);
            if (r.pageInfo.totalResults > 0) {
                header_thumb_stream.src = r.items[0].snippet.thumbnails.default.url;
                header_title_stream.innerHTML = r.items[0].snippet.title;
                header_viewers.innerHTML = '-';
                localStorage.setItem('streamid', r.items[0].id.videoId);
                header_is_live.dataset.islive = 'true';
                header_is_live.innerHTML = 'LIVE';
                localStorage.setItem('youtube_live_id', r.items[0].id.videoId);
            } else {
                header_title_stream.innerHTML = 'NO STREAM';
                header_viewers = '-';
                localStorage.setItem('streamid', '');
                header_is_live.dataset.islive = 'false';
                header_is_live.innerHTML = 'OFFLINE';
            }
        }
    };
    xhr.send(null);
}

// For testing:
// to find twitch user id, use GET request in browser:
// https://api.twitch.tv/kraken/search/channels?query="onlinechannel"&client_id=dyjm5o0cd24spkozqiyy3gue584olj
// For youtube use chilled_cow stream lofi hip hop (check if it is online, it mostly is):
// UCSJ4gkVC6NrvII8umztf0Ow
// or use to find a live straming channels
// https://www.googleapis.com/youtube/v3/search?type=channel&q={{channel name}}&maxResults=25&part=snippet&key=AIzaSyAdCxzlvqQS1653t0sAB4STdHbP2fzvr1E
// Add channel_id = '#found id' in twitch and youtube switch
function loadStreamInfo() {
    console.log('gool');
    if (header_info_stream) {
        console.log('adios');
        var account_type = header_info_stream.dataset.acctype;
        var channel_id = header_info_stream.dataset.id;
        switch (account_type) {
            case 'twitch':
                console.log('hola');
                channel_id = '47474524';
                updateIsTwitchLive(channel_id);
                setInterval(function () {
                    updateIsTwitchLive(channel_id)
                }, 3000);
                break;
            case 'youtube':
                channel_id = 'UCSJ4gkVC6NrvII8umztf0Ow'
                updateIsYoutubeLive(channel_id);
                setInterval(function () {
                    updateIsYoutubeLive(channel_id);
                }, 30000);
        }
    }
}
