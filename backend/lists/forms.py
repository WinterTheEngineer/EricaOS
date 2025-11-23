from django import forms
from .models import List, ListItem
from django.forms import Textarea, CheckboxInput
from django.utils.translation import gettext_lazy as _


class ListItemForm(forms.Form):
    listItems = forms.CharField(widget=Textarea, required=True)

class ListForm(forms.Form):

    title = forms.CharField(required=True)
    description = forms.CharField(required=False)
    listItems = forms.CharField(widget=Textarea, required=False)
    ordered = forms.BooleanField(required=False, widget=CheckboxInput)
