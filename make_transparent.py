import sys
from PIL import Image

# Open the image and ensure RGBA
img = Image.open('ms-monogram.png').convert("RGBA")
pixels = img.load()

width, height = img.size
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Navy blue is very dark (values < 50)
        # White is very bright (values > 200)
        # We can use the Green channel as a proxy for brightness
        
        # If it's darker than 60, it's the background -> fully transparent
        if g < 60:
            pixels[x, y] = (255, 255, 255, 0)
        else:
            # It's part of the text or the anti-aliased edge
            # Scale the alpha so that 60 becomes 0, and 255 becomes 255
            alpha = int(((g - 60) / (255 - 60)) * 255)
            # Make the pixel pure white, but with the calculated alpha for smooth edges
            pixels[x, y] = (255, 255, 255, alpha)

img.save('ms-monogram-transparent.png', 'PNG')
print("Transparency processing complete.")
