# PixelVoyager: A Usefull ImageViewer

*简体中文 | [English](README.md)*

一个轻量级的纯JavaScript图片预览库，无需任何依赖，开箱即用。

## 特性

- 🚀 **轻量级**: 无任何外部依赖，纯JavaScript实现
- 📱 **响应式**: 完美适配PC和移动设备
- 🎨 **美观**: 现代化的界面设计
- ⚡ **快速**: 高性能的图片加载和预览
- 🔧 **易用**: 一行代码即可集成

## 快速开始

### 1. 引入文件

```html
<script src="pixelvoyager.js"></script>
```

### 2. 调用接口

```javascript
// 预览单张图片
PixelVoyager.openImage('https://example.com/image.jpg');
```

## 示例

### 最小集成示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager 示例</title>
</head>
<body>
    <img src="demo.jpg" class="preview-image" alt="示例图片">
    
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

### 完整示例

查看 [imageviewer-minimal-zh.html](imageviewer-minimal-zh.html) 文件获取完整的集成示例。

## API 文档

### PixelVoyager.openImage(url)

预览单张图片

**参数:**
- `url` (String): 图片URL地址

**示例:**
```javascript
PixelVoyager.openImage('https://example.com/image.jpg');
```

## 框架集成

### Vue.js 集成

```javascript
// Vue 2/3 组件示例
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
                :alt="'图片 ' + (index + 1)"
            />
        </div>
    `
}
```

### React 集成

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
                    alt={`图片 ${index + 1}`}
                />
            ))}
        </div>
    );
}

// 使用示例
const images = [
    { id: 1, thumbnail: 'thumb1.jpg', fullSize: 'image1.jpg' },
    { id: 2, thumbnail: 'thumb2.jpg', fullSize: 'image2.jpg' }
];

function App() {
    return <ImageGallery images={images} />;
}
```

## 键盘快捷键

- `ESC` - 关闭预览
- `+` / `=` - 放大
- `-` - 缩小
- `0` - 重置视图

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge


## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持单张图片预览
- 响应式设计
- 键盘快捷键支持
