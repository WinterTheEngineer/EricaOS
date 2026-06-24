import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify

# Create your models here.
User = get_user_model()

class List(models.Model):

    title = models.CharField(max_length=120)
    slug = models.SlugField(null=True, blank=True, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    ordered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lists")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:  #if it's a new list, prevents broken links
            slug_title = slugify(self.title)
            exists = True

            while exists:
                slug_code = uuid.uuid4().hex[:8]
                concat_slug = f'{slug_title}-{slug_code}'
        
                exists = List.objects.filter(slug=concat_slug, author=self.author).exists()
            
            self.slug = concat_slug
        
        super(List, self).save(*args, **kwargs)
        


class ListItem(models.Model):
    order = models.PositiveIntegerField(blank=True, null=True)
    name = models.CharField(max_length=120)

    parent = models.ForeignKey(
        List,
        on_delete=models.CASCADE,
        related_name="items"
    )

    def save(self, *args, **kwargs):

        if self.parent.ordered:

            if self.order is None:
                last_order = (
                    ListItem.objects
                    .filter(parent=self.parent)
                    .aggregate(models.Max('order'))['order__max']
                )

                self.order = 1 if last_order is None else last_order + 1

        else:
            self.order = None

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
