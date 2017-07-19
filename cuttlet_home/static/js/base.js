var header_stream_link = document.getElementById('header_stream_link');
var header_info_stream = document.getElementById('header_info_stream');
var header_info_user = document.getElementById('header_info_user');
var header_ml = document.getElementById('header_ml');
var header_user_img = document.getElementById('header_user_img');
var header_username = document.getElementById('header_username');
var header_dropdown = document.getElementById('header_dropdown');
var arrow_dropdown = document.getElementById('arrow_dropdown');



if (header_info_stream) window.addEventListener('load', loadStreamInfo, false);
if (header_info_user) {
    header_info_user.addEventListener('click', showDropdown, false);


}
if (header_dropdown) document.addEventListener('click', checkHiddenOnClick, false);

function checkHiddenOnClick() {
    if(!event.target.closest('#header_info_user')) {
        if (getComputedStyle(header_dropdown).display === 'block') {
            arrow_dropdown.innerHTML = '&#x25BE;';
            header_dropdown.classList.toggle('hidden');
        }
    }
}

function showDropdown() {
    if (!event.target.closest('#header_dropdown')) {
        if (getComputedStyle(header_dropdown).display === 'block') {
            arrow_dropdown.innerHTML = '&#x25BE;';
        } else {
            arrow_dropdown.innerHTML = '&#x25B4;';
        }
        header_dropdown.classList.toggle('hidden');
    }
}

function updateInfoStream(islive, id, title, viewers, thumbnail_url, stream_url) {
    var header_title_stream = document.getElementById('header_title_stream');
    var header_viewers = document.getElementById('header_viewers');
    var header_is_live = document.getElementById('header_is_live');
    var header_thumb_stream = document.getElementById('header_thumb_stream');
    if (islive) {
        if (header_is_live.dataset.islive === 'false') window.location.reload();
        sessionStorage.setItem('streamid', id);
        header_is_live.style.display = 'block';
        header_title_stream.style['text-align'] = 'left';
        header_title_stream.style.height = '18px';
        header_title_stream.style['line-height'] = '18px';
        header_title_stream.innerHTML = title;
        if (viewers > 0) header_viewers.innerHTML = viewers + ' watching';
        header_is_live.dataset.islive = 'true';
        header_is_live.innerHTML = '<span style="color:red">&#x25CF</span> LIVE';
        header_thumb_stream.src = thumbnail_url;
        header_stream_link.setAttribute('href', stream_url);
    } else {
        sessionStorage.setItem('streamid', '');
        if (getComputedStyle(header_title_stream).display === 'block') {
            header_is_live.style.display = 'none';
            header_viewers.style.display = 'none';
            header_title_stream.style['text-align'] = 'center';
            header_title_stream.style.height = '36px';
            header_title_stream.style['line-height'] = '36px';
            header_title_stream.innerHTML = 'OFFLINE';
            header_viewers.innerHTML = '';
            header_is_live.dataset.islive = 'false';
            header_is_live.innerHTML = '';
        } else {
            header_is_live.style.display = 'block';
            header_is_live.innerHTML = 'OFFLINE';
        }
    }
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
            if (r.stream) {
                updateInfoStream(   true,
                                    r.stream.channel.name,
                                    r.stream.channel.status,
                                    r.stream.viewers,
                                    r.stream.preview.small,
                                    r.stream.channel.url
                );
            } else {
                updateInfoStream(false);
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
            if (r.pageInfo.totalResults > 0) {
                updateInfoStream(   true,
                                    r.items[0].id.videoId,
                                    r.items[0].snippet.title,
                                    '',
                                    r.items[0].snippet.thumbnails.default.url,
                                    'https://www.youtube.com/watch?v=' + r.items[0].id.videoId,
                );
            } else {
                updateInfoStream(false);
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
    console.log('runnnig');
    if (header_info_stream) {
        var account_type = header_info_stream.dataset.acctype;
        var channel_id = header_info_stream.dataset.id;
        switch (account_type) {
            case 'twitch':
                channel_id = '47474524';
                updateIsTwitchLive(channel_id);
                setInterval(function () {
                    updateIsTwitchLive(channel_id)
                }, 3000);
                break;
            case 'youtube':
                channel_id = 'UC0gvUpD9vvBtqNfGM_cMp0A'
                updateIsYoutubeLive(channel_id);
                setInterval(function () {
                    updateIsYoutubeLive(channel_id);
                }, 30000);
        }
    }
}
