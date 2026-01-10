from rest_framework import viewsets, permissions
from .models import WorkoutTemplate
from .serializers import WorkoutTemplateSerializer

class WorkoutTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutTemplate.objects.filter(user=self.request.user).prefetch_related('exercises__exercise')


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)