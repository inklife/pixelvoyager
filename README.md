# PixelVoyager: A Usefull ImageViewer

*[简体中文](README-zh.md) | English*

A lightweight pure JavaScript image preview library with no dependencies, ready to use out of the box.

## Features

- 🚀 **Lightweight**: No external dependencies, pure JavaScript implementation
- 📱 **Responsive**: Perfect for both PC and mobile devices
- 🎨 **Beautiful**: Modern interface design
- ⚡ **Fast**: High-performance image loading and preview
- 🔧 **Easy**: One line of code integration

## Quick Start

### 1. Include the file

```html
<script src="pixelvoyager.js"></script>
```

### 2. Call the API

```javascript
// Preview a single image
PixelVoyager.openImage('https://example.com/image.jpg');
```

## Examples

### Minimal Integration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager Example</title>
</head>
<body>
    <img src="demo.jpg" class="preview-image" alt="Example Image">
    
    <script src="pixelvoyager.js"></script>
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

Check the [imageviewer-minimal-en.html](imageviewer-minimal-en.html) file for a complete integration example.

## API Documentation

### PixelVoyager.openImage(url)

Preview a single image

**Parameters:**
- `url` (String): Image URL

**Example:**
```javascript
PixelVoyager.openImage('https://example.com/image.jpg');
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
