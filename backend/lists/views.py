from django.db.models import Q
from .models import List, ListItem
from rest_framework import generics, exceptions
from rest_framework.response import Response
from .serializers import ListSerializer, ListItemSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
# def lists(request):

#     lists = List.objects.all

#     context = {
#         'lists': lists,
#         'sector': "Lists",
#         'listform': ListForm,
#         'listitemform': ListItemForm
#     }

#     if request.htmx:
#         return render(request, "partials/lists_partial.html", context)

#     return render(request, 'lists.html', context)


# def search(request):

#     search_query = request.GET.get("search_query", "")
#     search_query = urllib.parse.unquote(search_query)

#     lists = []

#     if search_query:
#         parts = search_query.split()
#         q = (
#             Q(title__startswith=parts[0])
#             | Q(description__icontains=parts[0])
#         )

#         for part in parts[1:]:
#             q |= (
#                 Q(title__startswith=part)
#                 | Q(description__icontains=part)
#             )

#         lists = List.objects.filter(q)
    
#     paginator = Paginator(lists, 2)
#     page_num = int(request.GET.get("page", 1))
#     page = paginator.page(page_num)

#     context = {
#         'sector': 'Search',
#         "page_num": page_num,
#         "lists": page.object_list,
#         "next_page": page_num + 1,
#         "has_more": page.has_next(),
#         "search_query": search_query,
#         "page_title": "Search results for",
#         "previous_page": page_num - 1 if page_num > 1 else page_num
#     }

#     if request.htmx:
#         return render(request, "partials/search_results.html", context)
        
#     return render(request, "search.html", context)


# def new_list(request):

#     if request.method == "POST":
#         form = ListForm(request.POST)

#         if form.is_valid():
#             # Create List object first
#             new_list = List(
#                 title=form.cleaned_data["title"],
#                 description=form.cleaned_data["description"],
#                 ordered=form.cleaned_data["ordered"]
#             )
#             new_list.save()

#             list_items = form.cleaned_data["listItems"].split(", ")

#             for list_item in list_items:
#                 new_list_item = ListItem(name=list_item, list=new_list)
#                 new_list_item.save()

#             messages.success(request, "The list was created successfully.")         
            
#         else:
#             print(form.errors)
#             messages.error(request, "A form validation error prevented me from created the list.")
#     else:
#         form = ListForm()
    
#     return redirect('lists')


# def new_list_item(request):

#     if request.method == "POST":
#         form = ListItemForm(request.POST)

#         if form.is_valid():
#             list_id = request.POST.get("listID")
#             list_items = form.cleaned_data["listItems"].split(", ")

#             for list_item in list_items:
#                 new_list_item = ListItem(name=list_item, list=List.objects.get(id=list_id))
#                 new_list_item.save()
                
#                 messages.success(request, "The list was amended successfully.")
#         else:
#             messages.error(request, "A form validation error prevented me from adding these list items.")
#     else:
#         form = ListItemForm()
    
    
#     return redirect('lists')


def setDefaults():

    default_lists = [
        "Grocery List"
    ]

    default_list_items = {
        "Grocery List": []
    }

class ListCreate(generics.CreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print(serializer.errors)  # <-- THIS IS WHAT YOU'RE MISSING
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class ListDelete(generics.DestroyAPIView):
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return List.objects.filter(author=self.request.user)


class ListView(generics.ListAPIView):

    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return List.objects.filter(author=user)


class ListItemCreate(generics.ListCreateAPIView):

    serializer_class = ListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return ListItem.objects.filter(
            parent__author=user
        )

    def perform_create(self, serializer):

        parent_id = self.request.data.get("parent")

        if not parent_id:
            raise exceptions.ValidationError({
                "parent": "This field is required."
            })

        try:
            parent_obj = List.objects.get(
                id=parent_id,
                author=self.request.user
            )


        except List.DoesNotExist:
            raise exceptions.ValidationError({
                "parent": "Invalid list or unauthorized."
            })

        serializer.save(parent=parent_obj)


class ListDelete(generics.DestroyAPIView):

    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return List.objects.filter(author=user)