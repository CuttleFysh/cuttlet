from django.forms import Form
from django.contrib.auth import login, authenticate
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import SignUpForm
from .models import Profile

def home(request):
    return render(request, 'cuttlet_home/home.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return HttpResponseRedirect(reverse('cuttlet_home:home'))
    else:
        form = SignUpForm()
    return render(request, 'cuttlet_home/signup.html', {'form': form})

def twitch_oauth2_callback(request):
    if request.method == 'POST':
        profile = request.user.profile
        profile.twitch_channel = request.POST['twitch_channel']
        profile.save()
    return render(request, 'cuttlet_home/twitch_oauth2_callback.html')

def youtube_oauth2_callback(request):
    if request.method == 'POST':
        profile = request.user.profile
        profile.youtube_channel = request.POST['youtube_channel']
        profile.save()
    return render(request, 'cuttlet_home/youtube_oauth2_callback.html')
