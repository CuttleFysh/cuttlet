import datetime

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.utils import timezone

from .models import DraftchatEntry

def Draftchat(request, id):
    entry = get_object_or_404(DraftchatEntry, id=id)
    if entry.date_created >= timezone.now() - datetime.timedelta(hours=6):
        return render(request, 'draftchat/draftchat.html', {'entry': entry})
    else:
        return HttpResponse(status=404)

def DraftchatNew(request):
    if request.user.profile.juice_ml >= 10:
        new = DraftchatEntry(user=request.user)
        profile = request.user.profile
        profile.juice_ml = 100
        profile.all_juice += 100
        new.save()
        profile.save()
        return redirect('draftchat:draftchat', id=new.id)
    return redirect('cuttlet_home:refill')
