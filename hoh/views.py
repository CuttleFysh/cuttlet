import datetime

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.utils import timezone

from .models import HohEntry

def Hoh(request, id):
    entry = get_object_or_404(HohEntry, id=id);
    if entry.date_created >= timezone.now() - datetime.timedelta(hours=6):
        return render(request, 'hoh/hoh.html', {'entry': entry})
    else:
        return HttpResponse(status=404)

def HohNew(request):
    if request.user.profile.juice_ml >= 10:
        new = HohEntry(user=request.user)
        profile = request.user.profile
        profile.juice_ml = 100
        profile.all_juice += 100
        new.save()
        profile.save()
        return redirect('hoh:hoh', id=new.id)
    return redirect('cuttlet_home:refill')
