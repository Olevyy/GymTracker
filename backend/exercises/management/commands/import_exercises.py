import requests
from django.core.management.base import BaseCommand
from exercises.models import Exercise

class Command(BaseCommand):
    help = 'Imports exercises from the yuhonas/free-exercise-db GitHub repository'

    def handle(self, *args, **options):
        JSON_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
        BASE_IMAGE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/exercises"

        self.stdout.write("Downloading exercises data from GitHub (yuhonas/free-exercise-db)...")
        
        try:
            response = requests.get(JSON_URL)
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Download error: {e}"))
            return

        total = len(data)
        self.stdout.write(f"Found {total} exercises. Starting import...")
        
        count = 0
        for item in data:
            name = item.get('name')
            if not name:
                continue

            # Sanitizing folder name for image URL construction
            folder_name = name.replace(" ", "_").replace("/", "_")
            
            # Generating image URLs
            images = [
                f"{BASE_IMAGE_URL}/{folder_name}/0.jpg",
                f"{BASE_IMAGE_URL}/{folder_name}/1.jpg"
            ]

            Exercise.objects.update_or_create(
                name=name,
                defaults={
                    'primary_muscles': item.get('primaryMuscles', []),
                    'secondary_muscles': item.get('secondaryMuscles', []),
                    'force': item.get('force'),
                    'level': item.get('level'),
                    'mechanic': item.get('mechanic'),
                    'equipment': item.get('equipment'),
                    'category': item.get('category', 'strength'),
                    'instructions': item.get('instructions', []),
                    'image_urls': images,
                }
            )
            count += 1
            if count % 50 == 0:
                self.stdout.write(f"Processed {count}/{total}...")

        self.stdout.write(self.style.SUCCESS(f"Success! Imported {count} exercises."))