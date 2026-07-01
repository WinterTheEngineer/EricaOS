from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include('accounts.urls')),
    path('notes/', include('notes.urls')),
    path('lists/', include('lists.urls')),
<<<<<<< HEAD
    path('api/', include('api.urls')),
=======
    path('finance/', include('finance.urls')),
>>>>>>> d115434 (added finance backend app and exchange rate views)

    path('api-auth/', include("rest_framework.urls")),

]
