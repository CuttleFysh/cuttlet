var button_header_login=document.getElementById("button_header_login"),overlay_login=document.getElementById("overlay_login"),overlay_login_close=document.getElementById("overlay_login_close"),header_is_live=document.getElementById("header_is_live"),header_ml=document.getElementById("header_ml"),button_login_twitch=document.getElementById("button_login_twitch"),button_login_youtube=document.getElementById("button_login_youtube"),button_start_array=document.getElementsByClassName("button_start"),button_offline_array=
document.getElementsByClassName("button_start_offline"),label_cost_app=document.getElementsByClassName("label_cost_app");button_header_login&&(button_header_login.addEventListener("click",function(){overlay_login.style.display="block"},!1),overlay_login_close.addEventListener("click",function(){overlay_login.style.display="none"},!1));button_login_twitch&&button_login_twitch.addEventListener("click",loginTwitch,!1);button_login_youtube&&button_login_youtube.addEventListener("click",loginYoutube,!1);
function completeAndSubmitForm(a,c){for(var b in a){var d=document.createElement("input");d.setAttribute("type","hidden");d.setAttribute("name",b);d.setAttribute("value",a[b]);c.appendChild(d)}document.body.appendChild(c);c.submit()}function toggleDivsInArrays(a,c){for(var b=0;b<a.length;b++)a[b].style.display="block";for(b=0;b<c.length;b++)c[b].style.display="none"}
function loginTwitch(){var a=document.createElement("form");a.setAttribute("method","GET");a.setAttribute("action","https://api.twitch.tv/kraken/oauth2/authorize");completeAndSubmitForm({client_id:TWITCH_CLIENT_ID,redirect_uri:"http://www.cuttlebay.com/twitch_login",response_type:"token",scope:"user_read",force_verify:"true"},a)}
function loginYoutube(){var a=document.createElement("form");a.setAttribute("method","GET");a.setAttribute("action","https://accounts.google.com/o/oauth2/v2/auth");completeAndSubmitForm({client_id:"1050192004499-8r20tm8rqaek1p9ej4g8vr8ubekkfbms.apps.googleusercontent.com",redirect_uri:"http://www.cuttlebay.com/youtube_login",response_type:"token",scope:"https://www.googleapis.com/auth/youtube.readonly",prompt:"select_account consent"},a)}
function updateButtonsAvailable(){if("true"===header_is_live.dataset.islive){toggleDivsInArrays(button_start_array,button_offline_array);for(var a=0;a<label_cost_app.length;a++)label_cost_app[a].dataset.ml<=header_ml.dataset.ml&&(label_cost_app[a].className="label_cost_app")}else for(toggleDivsInArrays(button_offline_array,button_start_array),a=0;a<label_cost_app.length;a++)label_cost_app[a].className="label_cost_app label_cost_off";setTimeout(updateButtonsAvailable,3E3)}
function startApp(a){if(a<=header_ml.dataset.ml)return!0;alert("Not enough Juice");return!1}window.onload=function(){header_is_live&&setTimeout(updateButtonsAvailable,1E3)};
