import os
from PIL import Image

# Define your source and destination folders
source_folder = "prototype"
thumb_folder = "thumb"

# Create thumb folder if it doesn't exist
os.makedirs(thumb_folder, exist_ok=True)

# Set thumbnail size
thumbnail_size = (450, 300)

# Loop through all image files in the source folder
for filename in os.listdir(source_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp')):
        image_path = os.path.join(source_folder, filename)
        image = Image.open(image_path)
        
        # Create a copy and generate thumbnail
        image_copy = image.copy()
        image_copy.thumbnail(thumbnail_size)

        # Save to thumb folder
        thumb_path = os.path.join(thumb_folder, filename)
        image_copy.save(thumb_path)

        print(f"Thumbnail saved: {thumb_path}")
