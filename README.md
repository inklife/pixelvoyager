# PixelVoyager: A Useful Image Viewer

*[简体中文](README_zh.md) | English*

A lightweight pure JavaScript image preview library with no dependencies, ready to use out of the box.

## Features

- 🚀 **Lightweight**: No external dependencies, pure JavaScript implementation
- 📱 **Responsive**: Perfect for both PC and mobile devices
- 🎨 **Beautiful**: Modern interface design
- ⚡ **Fast**: High-performance image loading and preview
- 🔧 **Easy**: One line of code integration

## Online Demo

🌐 **[View Online Demo](https://pixelvoyager.vercel.app/html/pixelvoyager-minimal_en.html)**

## Quick Start

### Include the Script

**Recommended via CDN:**

```html
<script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
```

Or include locally:

```html
<script src="pixelvoyager.js"></script>
```

### Method 1: HTML Structure Registration (Recommended)

Simply wrap your images with `<a>` tags that have the `pixel-voyager-link` class, and the library will automatically register them when the page loads.

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager Example</title>
</head>
<body>
    <!-- Wrap your images with <a> tags that have the "pixel-voyager-link" class -->
    <!-- href is the image for fullscreen viewing, img src is the thumbnail displayed on page -->
    <a href="high-res-image.jpg" class="pixel-voyager-link">
        <img src="high-res-image-thumb.jpg" alt="Example Image">
    </a>
    
    <a href="another-high-res-image.jpg" class="pixel-voyager-link">
        <img src="another-high-res-image-thumb.jpg" alt="Another Image">
    </a>
    
    <!-- Include the script via CDN (recommended) -->
    <script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
</body>
</html>
```

### Method 2: JavaScript API

You can also call the API directly:

```javascript
// Preview a single image
PixelVoyager.openImage('https://example.com/image.jpg');
```

## Examples

### HTML Structure Registration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager Example</title>
</head>
<body>
    <div class="gallery">
        <!-- href is the image for fullscreen viewing, img src is the thumbnail displayed on page -->
        <a href="high-res-image1.jpg" class="pixel-voyager-link">
            <img src="high-res-image1-thumb.jpg" alt="Image 1">
        </a>
        <a href="high-res-image2.jpg" class="pixel-voyager-link">
            <img src="high-res-image2-thumb.jpg" alt="Image 2">
        </a>
        <a href="high-res-image3.jpg" class="pixel-voyager-link">
            <img src="high-res-image3-thumb.jpg" alt="Image 3">
        </a>
    </div>
    
    <script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
    <!-- That's it! No additional JavaScript needed -->
</body>
</html>
```

### JavaScript API Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager Example</title>
</head>
<body>
    <img src="demo.jpg" class="preview-image" alt="Example Image">
    
    <script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
    <script>
        document.querySelectorAll('.preview-image').forEach(img => {
            img.addEventListener('click', function() {
                PixelVoyager.openImage(this.src);
            });
        });
    </script>
</body>
</html>
```

### Full Example

Check the [pixelvoyager-minimal-en.html](pixelvoyager-minimal-en.html) file for a complete integration example.

## API Documentation

### HTML Structure Registration (Recommended)

The simplest way to use PixelVoyager is through HTML structure registration. Just wrap your images with `<a>` tags that have the `pixel-voyager-link` class:

```html
<a href="high-res-image.jpg" class="pixel-voyager-link">
    <img src="high-res-image-thumb.jpg" alt="Image description">
</a>
```

**Requirements:**
- Wrap `<img>` tags with `<a>` tags
- The `<a>` tag must have the class `pixel-voyager-link`
- The `href` attribute should contain the full-size image URL (this is the image shown in fullscreen)
- The `<img>` tag inside should use a thumbnail or compressed version (this is the small image shown on the page)

**Advantages:**
- ✅ Zero JavaScript configuration required
- ✅ SEO-friendly semantic HTML structure
- ✅ Works immediately after including the script
- ✅ Graceful degradation (links work even without JavaScript)
- ✅ Auto-handles CSS styling to prevent whitespace issues

### PixelVoyager.openImage(url)

Preview a single image programmatically

**Parameters:**
- `url` (String): Image URL

**Example:**
```javascript
PixelVoyager.openImage('https://example.com/image.jpg');
```

## Configuration Options

PixelVoyager provides rich configuration options to customize the user experience. You can pass configurations in the following ways:

### How to Pass Configuration

You can configure the global instance using the `configure` method:

```javascript
// Apply custom settings to the single global instance
PixelVoyager.configure({
    zoomMode: 'center',
    cornerColor: 'rgba(0, 128, 0, 0.8)',
    blockingDelay: 500
});
```

**Important Notes for HTML Structure Registration:**
- ✅ **Configuration works**: The updated version supports passing configuration options to HTML structure registration
- ✅ **Global instance**: All HTML structure links will use the same configured global instance
- ✅ **Early configuration**: Configure before DOM loads for best results
- ✅ **Runtime configuration**: Use `PixelVoyager.configure()` to change settings dynamically
- ✅ **Visual feedback**: You can see the corner indicators change color when configuration is applied

**Method: Use Configuration with HTML Structure Registration**

```html
<script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
<script>
    // Use the configure method (recommended)
    PixelVoyager.configure({
        zoomMode: 'center',
        borderColor: 'rgba(255, 0, 0, 0.5)'
    });
</script>
```

### Main Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `zoomMode` | String | `'cursor'` | Zoom mode: `'cursor'` - zoom centered on cursor, `'center'` - zoom centered on canvas |
| `cornerColor` | String | `'rgba(64, 158, 255, 0.6)'` | Corner indicator color |
| `moveThreshold` | Number | `1` | Movement threshold (pixels) for detecting drag start |
| `blockingDelay` | Number | `1000` | Delay time (ms) to block click-to-close after drag ends |
| `checkInterval` | Number | `15` | Mouse movement detection interval (ms) |

### Zoom Mode Details

**Cursor-centered zoom (`zoomMode: 'cursor'`)** - Default mode
- When zooming with mouse wheel, cursor always points to the same pixel on the image
- When double-clicking to zoom, zooms centered on the click position
- Suitable for precise detail viewing

**Canvas-centered zoom (`zoomMode: 'center'`)**
- Always zooms relative to the canvas center
- Traditional zoom behavior
- Suitable for quick image browsing

### Configuration Example

```javascript
// Create a configuration with center zoom and custom corner color
const voyager = new PixelVoyager({
    zoomMode: 'center',           // Use center zoom mode
    cornerColor: 'rgba(255, 0, 0, 0.8)',  // Custom corner color (red)
    moveThreshold: 5,             // Increase drag trigger threshold
    blockingDelay: 500            // Reduce delay after drag
});

// Use the configured instance
voyager.openImage('https://example.com/image.jpg');
```

## Framework Integration

### Vue.js Integration

```javascript
// Vue 2/3 Component Example
export default {
    data() {
        return {
            images: [
                { id: 1, thumbnail: 'thumb1.jpg', fullSize: 'image1.jpg' },
                { id: 2, thumbnail: 'thumb2.jpg', fullSize: 'image2.jpg' }
            ]
        }
    },
    methods: {
        openImagePreview(imageUrl) {
            PixelVoyager.openImage(imageUrl);
        }
    },
    template: `
        <div class="gallery">
            <img 
                v-for="(image, index) in images" 
                :key="image.id"
                :src="image.thumbnail"
                @click="openImagePreview(image.fullSize)"
                class="preview-image"
                :alt="'Image ' + (index + 1)"
            />
        </div>
    `
}
```

### React Integration

```jsx
import React from 'react';

function ImageGallery({ images }) {
    const handleImageClick = (imageUrl) => {
        PixelVoyager.openImage(imageUrl);
    };
    
    return (
        <div className="gallery">
            {images.map((image, index) => (
                <img
                    key={image.id}
                    src={image.thumbnail}
                    onClick={() => handleImageClick(image.fullSize)}
                    className="preview-image"
                    alt={`Image ${index + 1}`}
                />
            ))}
        </div>
    );
}

// Usage
const images = [
    { id: 1, thumbnail: 'thumb1.jpg', fullSize: 'image1.jpg' },
    { id: 2, thumbnail: 'thumb2.jpg', fullSize: 'image2.jpg' }
];

function App() {
    return <ImageGallery images={images} />;
}
```

## Keyboard Shortcuts

- `ESC` - Close preview
- `+` / `=` - Zoom in
- `-` - Zoom out
- `0` - Reset view

## Browser Support

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Contributing

Issues and Pull Requests are welcome to improve this project.

## Changelog

### v1.0.0
- Initial release
- Support single image preview
- Responsive design
- Keyboard shortcuts support
