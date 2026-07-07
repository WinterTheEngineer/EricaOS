from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include('accounts.urls')),
    path('notes/', include('notes.urls')),
    path('lists/', include('lists.urls')),
    path('clock/', include('clock.urls')),
    path('api/', include('api.urls')),
    path('finance/', include('finance.urls')),

    path('api-auth/', include("rest_framework.urls")),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)