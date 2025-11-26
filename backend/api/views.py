from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class Search(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = request.GET.get("q", "").strip()
        apps = request.GET.getlist("apps")  # example: app=notes&app=lists

        results = {}

        # NOTES SEARCH
        if "notes" in apps:
            from notes.models import Note
            notes = Note.objects.filter(
                title__icontains=q
            ) | Note.objects.filter(
                content__icontains=q
            )

            results["notes"] = [
                {
                    "id": n.id,
                    "title": n.title,
                    "preview": n.content[:80],
                    "updated": n.last_modified,
                }
                for n in notes
            ]

        # LISTS SEARCH
        if "lists" in apps:
            from lists.models import List
            lists = List.objects.filter(title__icontains=q)

            results["lists"] = [
                {
                    "id": lst.id,
                    "title": lst.title,
                    "count": lst.listitem_set.count(),
                }
                for lst in lists
            ]

        # LISTITEM SEARCH (if needed)
        if "listitems" in apps:
            from lists.models import ListItem
            items = ListItem.objects.filter(name__icontains=q)

            results["listitems"] = [
                {
                    "id": item.id,
                    "name": item.name,
                    "list_id": item.list_id,
                    "list_title": item.list.title,
                }
                for item in items
            ]

        return Response(results)
