# PixelVoyager: 实用的图片查看器

*简体中文 | [English](README.md)*

一个轻量级的纯JavaScript图片预览库，无需任何依赖，开箱即用。

## 特性

- 🚀 **轻量级**: 无任何外部依赖，纯JavaScript实现
- 📱 **响应式**: 完美适配PC和移动设备
- 🎨 **美观**: 现代化的界面设计
- ⚡ **快速**: 高性能的图片加载和预览
- 🔧 **易用**: 一行代码即可集成

## 快速开始

### 方法一：HTML 结构注册（推荐）

只需用带有 `pixel-voyager-link` 类名的 `<a>` 标签包裹你的图片，库会在页面加载时自动注册这些链接。

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager 示例</title>
</head>
<body>
    <!-- 用带有 "pixel-voyager-link" 类名的 <a> 标签包裹图片 -->
    <!-- href 是全屏浏览的图片，img src 是页面显示的缩略图 -->
    <a href="high-res-image.jpg" class="pixel-voyager-link">
        <img src="high-res-image-thumb.jpg" alt="示例图片">
    </a>
    
    <a href="another-high-res-image.jpg" class="pixel-voyager-link">
        <img src="another-high-res-image-thumb.jpg" alt="另一张图片">
    </a>
    
    <!-- 引入脚本，自动生效 -->
    <script src="pixelvoyager.js"></script>
</body>
</html>
```

### 方法二：JavaScript API

你也可以直接调用 API：

```javascript
// 预览单张图片
PixelVoyager.openImage('https://example.com/image.jpg');
```

## 示例

### HTML 结构注册示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>PixelVoyager 示例</title>
</head>
<body>
    <div class="gallery">
        <!-- href 是全屏浏览的图片，img src 是页面显示的缩略图 -->
        <a href="high-res-image1.jpg" class="pixel-voyager-link">
            <img src="high-res-image1-thumb.jpg" alt="图片 1">
        </a>
        <a href="high-res-image2.jpg" class="pixel-voyager-link">
            <img src="high-res-image2-thumb.jpg" alt="图片 2">
        </a>
        <a href="high-res-image3.jpg" class="pixel-voyager-link">
            <img src="high-res-image3-thumb.jpg" alt="图片 3">
        </a>
    </div>
    
    <script src="pixelvoyager.js"></script>
    <!-- 就这样！不需要额外的 JavaScript 代码 -->
</body>
</html>
```

### JavaScript API 示例

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

查看 [pixelvoyager-minimal-zh.html](pixelvoyager-minimal-zh.html) 文件获取完整的集成示例。

## API 文档

### HTML 结构注册（推荐）

使用 PixelVoyager 最简单的方式是通过 HTML 结构注册。只需用带有 `pixel-voyager-link` 类名的 `<a>` 标签包裹你的图片：

```html
<a href="high-res-image.jpg" class="pixel-voyager-link">
    <img src="high-res-image-thumb.jpg" alt="图片描述">
</a>
```

**使用要求：**
- 用 `<a>` 标签包裹 `<img>` 标签
- `<a>` 标签必须包含 `pixel-voyager-link` 类名
- `href` 属性应包含完整尺寸的图片 URL（这是全屏浏览时显示的图片）
- 内部的 `<img>` 标签的 `src` 属性通常使用缩略图或压缩版本（这是页面上显示的小图）

**优势：**
- ✅ 无需 JavaScript 配置
- ✅ 语义化的 HTML 结构，SEO 友好
- ✅ 引入脚本后立即生效
- ✅ 优雅降级（即使没有 JavaScript 也能正常工作）
- ✅ 自动处理CSS样式，避免空白字符问题

### PixelVoyager.openImage(url)

通过编程方式预览单张图片

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
