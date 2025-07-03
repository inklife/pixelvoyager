# PixelVoyager: 实用的图片查看器

*简体中文 | [English](README.md)*

一个轻量级的纯JavaScript图片预览库，无需任何依赖，开箱即用。

## 特性

- 🚀 **轻量级**: 无任何外部依赖，纯JavaScript实现
- 📱 **响应式**: 完美适配PC和移动设备
- 🎨 **美观**: 现代化的界面设计
- ⚡ **快速**: 高性能的图片加载和预览
- 🔧 **易用**: 一行代码即可集成

## 在线演示

🌐 **[查看在线演示](https://pixelvoyager.vercel.app/html/pixelvoyager-minimal_zh.html)**

## 快速开始

### 引入脚本

**推荐通过 CDN 引入：**

```html
<script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
```

或者本地引入：

```html
<script src="pixelvoyager.js"></script>
```

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
    
    <!-- 引入脚本，推荐使用CDN -->
    <script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
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
    
    <script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
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

## 配置选项

PixelVoyager 提供了丰富的配置选项来自定义用户体验。你可以通过以下方式传入配置：

### 如何传入配置

你可以使用 `configure` 方法配置全局实例：

```javascript
// 应用自定义设置到全局单例实例
PixelVoyager.configure({
    zoomMode: 'center',
    cornerColor: 'rgba(0, 128, 0, 0.8)',
    blockingDelay: 500
});
```

**HTML结构注册的重要说明：**
- ✅ **配置有效**: 更新版本支持向HTML结构注册传入配置选项
- ✅ **全局实例**: 所有HTML结构链接都会使用相同的配置后全局实例
- ✅ **早期配置**: 在DOM加载前配置以获得最佳效果
- ✅ **运行时配置**: 使用 `PixelVoyager.configure()` 动态更改设置
- ✅ **视觉反馈**: 应用配置后你可以看到角标颜色发生变化

**方法：配合HTML结构注册使用配置**

```html
<script src="https://cdn.jsdelivr.net/gh/inklife/pixelvoyager/pixelvoyager.js"></script>
<script>
    // 使用 configure 方法（推荐）
    PixelVoyager.configure({
        zoomMode: 'center',
        borderColor: 'rgba(255, 0, 0, 0.5)'
    });
</script>
```

### 主要配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `zoomMode` | String | `'cursor'` | 缩放模式：`'cursor'` - 以光标为中心缩放，`'center'` - 以画布中心缩放 |
| `cornerColor` | String | `'rgba(64, 158, 255, 0.6)'` | 角标颜色 |
| `moveThreshold` | Number | `1` | 移动阈值（像素），用于检测是否开始拖拽 |
| `blockingDelay` | Number | `1000` | 拖拽结束后屏蔽点击关闭的延迟时间（毫秒） |
| `checkInterval` | Number | `15` | 检测鼠标移动的间隔时间（毫秒） |

### 缩放模式详解

**光标中心缩放 (`zoomMode: 'cursor'`)** - 默认模式
- 鼠标滚轮缩放时，光标始终指向图片上的同一个像素点
- 双击缩放时，以双击位置为中心进行缩放
- 适合精确查看图片细节

**画布中心缩放 (`zoomMode: 'center'`)**
- 始终以画布中心为基准进行缩放
- 传统的缩放方式
- 适合快速浏览图片整体

### 配置示例

```javascript
// 创建一个使用中心缩放和自定义角标颜色的配置
const voyager = new PixelVoyager({
    zoomMode: 'center',           // 使用中心缩放模式
    cornerColor: 'rgba(255, 0, 0, 0.8)',  // 自定义角标颜色（红色）
    moveThreshold: 5,             // 提高拖拽触发阈值
    blockingDelay: 500            // 减少拖拽后的延迟时间
});

// 使用配置后的实例
voyager.openImage('https://example.com/image.jpg');
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
