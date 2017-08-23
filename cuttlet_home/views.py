from django.forms import Form
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseRedirect
from django.middleware import csrf
from django.shortcuts import render
from django.urls import reverse

from .forms import SignUpForm
from .models import Profile

def Home(request):
    return render(request, 'cuttlet_home/home.html')

def TwitchLogin(request):
    if request.method == 'POST':
        username = request.POST['twitch_id']
        password = '2619cuTpa$twI' + username[2:6]
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
        else:
            user = User.objects.create_user(username, 'none@example.com', password)
            profile = user.profile
            profile.account_type = 'twitch'
            profile.name = request.POST['channel_name']
            thumbnail = request.POST['thumbnail_url']
            if thumbnail != '':
                profile.thumbnail_url = request.POST['thumbnail_url']
            profile.save()
        login(request, user)
    return render(request, 'cuttlet_home/twitch_login.html')

def YoutubeLogin(request):
    if request.method == 'POST':
        username = request.POST['youtube_id']
        password = '2619cuTpa$yoU' + username[2:6]
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
        else:
            user = User.objects.create_user(username, 'none@example.com', password)
            profile = user.profile
            profile.account_type = 'youtube'
            profile.name = request.POST['channel_name']
            thumbnail = request.POST['thumbnail_url']
            if thumbnail != '':
                profile.thumbnail_url = request.POST['thumbnail_url']
            profile.save()
        login(request, user)
    return render(request, 'cuttlet_home/youtube_login.html')

def Refill(request):
    return render(request, 'cuttlet_home/refill.html')

def Privacy(request):
    return render(request, 'cuttlet_home/privacy.html')

def Terms(request):
    return render(request, 'cuttlet_home/terms.html')
