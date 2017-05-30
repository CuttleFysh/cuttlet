from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse

from .models import SupperfanEntry

def Supperfan(request, pk):
    entry = get_object_or_404(SupperfanEntry, pk=pk)
    return render(request, 'supperfan/supperfan.html', {'entry': entry})

def SupperfanNew(request):
    if request.method == 'POST':
        new = SupperfanEntry(user=request.user)
        profile = request.user.profile
        profile.juice_ml = 9
        new.save()
        profile.save()
        return redirect('supperfan:supperfan', pk=new.pk)
    return HttpResponse(status='405')
