from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse

from .models import HohEntry

def Hoh(request, id):
    entry = get_object_or_404(HohEntry, id=id);
    return render(request, 'hoh/hoh.html', {'entry': entry})

def HohNew(request):
    if request.method == 'POST':
        new = HohEntry(user=request.user)
        profile = request.user.profile
        profile.juice_ml = 10
        new.save()
        profile.save()
        return redirect('hoh:hoh', id=new.id)
    return HttpResponse(status='405')
