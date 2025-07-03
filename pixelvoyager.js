// 通用模块导出和初始化
(function(root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS (Node.js)
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else {
        // Browser globals
        root.PixelVoyager = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';
    
    /**
     * PixelVoyager - 基于 Canvas 的高级像素探险家
     * 支持缩放、拖拽、双击放大等功能，带你探索每一个像素的奥秘
     */
    class PixelVoyager {
        constructor(options = {}) {
            this.isOpen = false;
            this.currentImage = null;
            this.canvas = null;
            this.ctx = null;
            this.overlay = null;
            
            // 配置选项
            this.options = {
                cornerColor: 'rgba(64, 158, 255, 0.6)',  // 角标颜色
                moveThreshold: 1,        // 移动阈值（像素），用于检测是否开始拖拽
                blockingDelay: 1000,     // 拖拽结束后屏蔽点击关闭的延迟时间（毫秒）
                checkInterval: 15,       // 检测鼠标移动的间隔时间（毫秒）
                zoomMode: 'cursor',      // 缩放模式：'cursor' - 以光标为中心缩放，'center' - 以画布中心缩放
                ...options
            };
            
            // 图片状态
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.imageData = {
                width: 0,
                height: 0,
                naturalWidth: 0,
                naturalHeight: 0
            };
            
            // 交互状态
            this.isDragging = false;
            this.hasMouseMoved = false;
            this.clickBlockingEnabled = false;
            this.lastX = 0;
            this.lastY = 0;
            this.checkPositionX = 0;
            this.checkPositionY = 0;
            this.moveCheckTimer = null;
            this.resizeTimer = null;
            this.minScale = 0.1;
            this.maxScale = 5;
            
            // 绑定方法
            this.handleClick = this.handleClick.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleWheel = this.handleWheel.bind(this);
            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
            this.handleDoubleClick = this.handleDoubleClick.bind(this);
            this.handleTouchStart = this.handleTouchStart.bind(this);
            this.handleTouchMove = this.handleTouchMove.bind(this);
            this.handleTouchEnd = this.handleTouchEnd.bind(this);
            this.handleResize = this.handleResize.bind(this);
        }
        
        static init(options = {}) {
            if (!window.pixelVoyagerInstance) {
                window.pixelVoyagerInstance = new PixelVoyager(options);
            }
            return window.pixelVoyagerInstance;
        }
        
        // 静态方法：配置全局实例
        static configure(options = {}) {
            if (typeof options !== 'object' || options === null) {
                console.warn('PixelVoyager.configure: options must be an object');
                return PixelVoyager.init();
            }
            
            const voyager = PixelVoyager.init();
            
            // 确保 options 存在
            if (!voyager.options) {
                voyager.options = {};
            }
            
            // 合并配置
            Object.assign(voyager.options, options);
            
            console.log('PixelVoyager configured with:', options);
            console.log('Current options:', voyager.options);
            
            return voyager;
        }
        
        // 静态方法：快速打开图片
        static openImage(imageSrc) {
            const voyager = PixelVoyager.init();
            return voyager.openImage(imageSrc);
        }
        
        // 初始化事件监听
        initEventListeners() {
            // 仅在浏览器环境中初始化
            if (typeof document !== 'undefined') {
                document.addEventListener('click', this.handleClick);
                
                // 自动为 pixel-voyager-link 元素添加样式以消除空白字符问题
                this.applyAutoStyles();
            }
        }
        
        // 自动应用样式
        applyAutoStyles() {
            // 检查是否已经添加了样式
            if (document.getElementById('pixel-voyager-auto-styles')) {
                return;
            }
            
            // 创建并添加样式
            const style = document.createElement('style');
            style.id = 'pixel-voyager-auto-styles';
            style.textContent = `
                .pixel-voyager-link {
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);
        }
        
        // 移除事件监听
        removeEventListeners() {
            if (typeof document !== 'undefined') {
                document.removeEventListener('click', this.handleClick);
                document.removeEventListener('keydown', this.handleKeyDown);
            }
        }
        
        // 处理图片链接点击
        handleClick(event) {
            const link = event.target.closest('a.pixel-voyager-link');
            if (link) {
                event.preventDefault();
                event.stopPropagation();
                this.openImage(link.href);
            }
        }
        
        // 打开图片
        async openImage(imageSrc) {
            if (this.isOpen) return;
            
            try {
                this.isOpen = true;
                
                // 创建模态框
                this.createModal();
                
                // 加载图片
                const img = await this.loadImage(imageSrc);
                this.currentImage = img;
                
                // 设置 Canvas 和初始状态
                this.setupCanvas();
                this.resetTransform();
                this.draw();
                
                // 添加事件监听
                this.addViewerEventListeners();
                
                // 禁用body滚动
                if (typeof document !== 'undefined') {
                    document.body.classList.add('modal-open');
                }
                
            } catch (error) {
                console.error('加载图片失败:', error);
                this.close();
            }
        }
        
        // 加载图片
        loadImage(src) {
            return new Promise((resolve, reject) => {
                if (typeof Image === 'undefined') {
                    reject(new Error('Image constructor not available'));
                    return;
                }
                
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        }
        
        // 创建模态框
        createModal() {
            if (typeof document === 'undefined') {
                console.warn('Document not available, cannot create modal');
                return;
            }
            
            // 创建遮罩层
            this.overlay = document.createElement('div');
            this.overlay.className = 'pixel-voyager-overlay';
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // 创建工具栏
            const toolbar = document.createElement('div');
            toolbar.className = 'pixel-voyager-toolbar';
            toolbar.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                z-index: 10001;
            `;
            
            // 关闭按钮
            const closeBtn = this.createButton('✕', '关闭', () => this.close());
            closeBtn.style.cssText += `
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                font-size: 24px;
                width: 40px;
                height: 40px;
                padding: 0;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            `;
            
            // 重置按钮
            const resetBtn = this.createButton('⌂', '重置视图', () => this.resetView());
            resetBtn.style.cssText += `
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                font-size: 18px;
                width: 40px;
                height: 40px;
                padding: 0;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            `;
            
            // 缩放信息
            this.scaleInfo = document.createElement('div');
            this.scaleInfo.style.cssText = `
                position: absolute;
                top: 20px;
                left: 20px;
                color: white;
                background: rgba(0, 0, 0, 0.5);
                padding: 8px 12px;
                border-radius: 20px;
                font-family: monospace;
                font-size: 14px;
                z-index: 10001;
            `;
            
            // 使用说明
            const instructions = document.createElement('div');
            instructions.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255, 255, 255, 0.9);
                background: rgba(0, 0, 0, 0.7);
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 12px;
                text-align: center;
                z-index: 10001;
                max-width: 80%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            instructions.innerHTML = `
                🖱️ Double-click: Zoom • Scroll: Scale • 📱 Drag: Move • ⌨️ ESC: Close
            `;
            
            // 创建 Canvas 容器
            this.canvasContainer = document.createElement('div');
            this.canvasContainer.className = 'pixel-voyager-canvas-container';
            this.canvasContainer.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: calc(100vh - 200px);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // 创建 Canvas
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                cursor: grab;
                display: block;
            `;
            this.ctx = this.canvas.getContext('2d');
            
            // 创建四个角标指示器
            this.cornerIndicators = [];
            for (let i = 0; i < 4; i++) {
                const corner = document.createElement('div');
                corner.className = `pixel-voyager-corner corner-${i}`;
                corner.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border: 3px solid ${this.options.cornerColor};
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 2;
                `;
                this.cornerIndicators.push(corner);
                this.canvasContainer.appendChild(corner);
            }
            
            // 设置角标样式
            this.cornerIndicators[0].style.cssText += `
                border-right: none;
                border-bottom: none;
                top: -3px;
                left: -3px;
            `;
            this.cornerIndicators[1].style.cssText += `
                border-left: none;
                border-bottom: none;
                top: -3px;
                right: -3px;
            `;
            this.cornerIndicators[2].style.cssText += `
                border-left: none;
                border-top: none;
                bottom: -3px;
                right: -3px;
            `;
            this.cornerIndicators[3].style.cssText += `
                border-right: none;
                border-top: none;
                bottom: -3px;
                left: -3px;
            `;
            
            this.canvasContainer.appendChild(this.canvas);
            
            // 组装元素
            toolbar.appendChild(resetBtn);
            toolbar.appendChild(closeBtn);
            this.overlay.appendChild(this.scaleInfo);
            this.overlay.appendChild(toolbar);
            this.overlay.appendChild(this.canvasContainer);
            this.overlay.appendChild(instructions);
            
            document.body.appendChild(this.overlay);
            
            // 动画显示
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => {
                    this.overlay.style.opacity = '1';
                });
            } else {
                this.overlay.style.opacity = '1';
            }
        }
        
        // 创建按钮
        createButton(text, title, onClick) {
            if (typeof document === 'undefined') return null;
            
            const button = document.createElement('button');
            button.innerHTML = text;
            button.title = title;
            button.onclick = onClick;
            return button;
        }
        
        // 设置 Canvas
        setupCanvas() {
            if (!this.canvas || !this.currentImage) return;
            
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
            const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
            
            // 计算可用视区大小（留出200px给工具栏和说明文字）
            const availableWidth = windowWidth * 0.9; // 对应max-width: 90%
            const availableHeight = windowHeight - 200; // 对应max-height: calc(100vh - 200px)
            const halfAvailableWidth = availableWidth * 0.5;
            const halfAvailableHeight = availableHeight * 0.5;
            
            // 获取图片原始尺寸
            let imageWidth = this.currentImage.width;
            let imageHeight = this.currentImage.height;
            
            // 计算初始显示尺寸和缩放比例
            let displayWidth = imageWidth;
            let displayHeight = imageHeight;
            let initialScale = 1;
            
            // 如果图片太小，进行倍增直到达到可用区域的一半
            while (displayWidth < halfAvailableWidth && displayHeight < halfAvailableHeight) {
                displayWidth *= 2;
                displayHeight *= 2;
                initialScale *= 2;
            }
            
            // 如果倍增后超出可用区域，则按比例缩小到适合可用区域
            if (displayWidth > availableWidth || displayHeight > availableHeight) {
                const scaleX = availableWidth / displayWidth;
                const scaleY = availableHeight / displayHeight;
                const finalScale = Math.min(scaleX, scaleY);
                
                displayWidth *= finalScale;
                displayHeight *= finalScale;
                initialScale *= finalScale;
            }
            
            // 设置 Canvas 尺寸
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.canvas.style.width = displayWidth + 'px';
            this.canvas.style.height = displayHeight + 'px';
            
            // 保存图片信息，包括初始缩放比例
            this.imageData = {
                width: displayWidth,
                height: displayHeight,
                naturalWidth: this.currentImage.width,
                naturalHeight: this.currentImage.height,
                initialScale: initialScale  // 记录初始缩放比例
            };
            
            // 设置初始缩放比例
            this.scale = initialScale;
            
            console.log(`图片尺寸: ${imageWidth}x${imageHeight}, 显示尺寸: ${Math.round(displayWidth)}x${Math.round(displayHeight)}, 初始缩放: ${Math.round(initialScale * 100)}%`);
        }
        
        // 重置变换
        resetTransform() {
            this.scale = this.imageData.initialScale || 1;
            this.translateX = 0;
            this.translateY = 0;
        }
        
        // 重置视图
        resetView() {
            // 智能重置：在铺满状态和100%原图之间切换
            const initialScale = this.imageData.initialScale || 1;
            const tolerance = 0.05; // 5% 的容差
            
            // 判断当前是否接近铺满状态
            const isNearInitialScale = Math.abs(this.scale - initialScale) / initialScale < tolerance;
            
            if (isNearInitialScale) {
                // 如果当前是铺满状态，重置到100%原图
                this.scale = 1;
            } else {
                // 否则重置到铺满状态
                this.scale = initialScale;
            }
            
            // 重置位移
            this.translateX = 0;
            this.translateY = 0;
            
            this.draw();
            this.updateScaleInfo();
        }
        
        // 绘制图片
        draw() {
            if (!this.ctx || !this.currentImage) return;
            
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 保存上下文
            this.ctx.save();
            
            // 应用变换
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.translate(this.translateX, this.translateY);
            
            // 绘制图片（居中）- 使用原始图片尺寸
            this.ctx.drawImage(
                this.currentImage,
                -this.imageData.naturalWidth / 2,
                -this.imageData.naturalHeight / 2,
                this.imageData.naturalWidth,
                this.imageData.naturalHeight
            );
            
            // 恢复上下文
            this.ctx.restore();
            
            // 更新边界指示器
            this.updateBorderIndicator();
        }
        
        // 更新边界指示器
        updateBorderIndicator() {
            if (!this.cornerIndicators) return;
            
            // 判断是否需要显示角标指示器
            const shouldShowCorners = this.isDragging || 
                                   this.scale > 1.1 || 
                                   Math.abs(this.translateX) > 5 || 
                                   Math.abs(this.translateY) > 5;
            
            if (shouldShowCorners) {
                // 显示角标，并更新颜色
                this.cornerIndicators.forEach((corner, index) => {
                    // 动态更新角标颜色，确保使用最新的配置
                    corner.style.borderColor = this.options.cornerColor;
                    corner.style.opacity = '1';
                });
                
            } else {
                // 隐藏角标指示器
                this.cornerIndicators.forEach(corner => {
                    corner.style.opacity = '0';
                });
            }
        }
        
        // 更新缩放信息
        updateScaleInfo() {
            if (this.scaleInfo) {
                // 直接显示相对于原始图片的缩放比例
                this.scaleInfo.textContent = `${Math.round(this.scale * 100)}%`;
            }
        }
        
        // 添加查看器事件监听
        addViewerEventListeners() {
            if (typeof document === 'undefined') return;
            
            document.addEventListener('keydown', this.handleKeyDown);
            
            // 添加窗口大小变化监听
            if (typeof window !== 'undefined') {
                window.addEventListener('resize', this.handleResize);
            }
            
            if (this.canvas) {
                this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
                this.canvas.addEventListener('mousedown', this.handleMouseDown);
                this.canvas.addEventListener('mousemove', this.handleMouseMove);
                this.canvas.addEventListener('mouseup', this.handleMouseUp);
                this.canvas.addEventListener('mouseleave', this.handleMouseUp);
                this.canvas.addEventListener('dblclick', this.handleDoubleClick);
                
                // 触摸事件
                this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
                this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
                this.canvas.addEventListener('touchend', this.handleTouchEnd);
            }
            
            // 点击遮罩关闭（但在拖拽时不关闭）
            if (this.overlay) {
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay && !this.clickBlockingEnabled) {
                        this.close();
                    }
                });
            }
        }
        
        // 移除查看器事件监听
        removeViewerEventListeners() {
            if (typeof document === 'undefined') return;
            
            document.removeEventListener('keydown', this.handleKeyDown);
            
            // 移除窗口大小变化监听
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', this.handleResize);
            }
            
            // 移除全局拖拽事件监听（确保清理）
            document.removeEventListener('mousemove', this.handleGlobalMouseMove);
            document.removeEventListener('mouseup', this.handleGlobalMouseUp);
            
            if (this.canvas) {
                this.canvas.removeEventListener('wheel', this.handleWheel);
                this.canvas.removeEventListener('mousedown', this.handleMouseDown);
                this.canvas.removeEventListener('mousemove', this.handleMouseMove);
                this.canvas.removeEventListener('mouseup', this.handleMouseUp);
                this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
                this.canvas.removeEventListener('dblclick', this.handleDoubleClick);
                this.canvas.removeEventListener('touchstart', this.handleTouchStart);
                this.canvas.removeEventListener('touchmove', this.handleTouchMove);
                this.canvas.removeEventListener('touchend', this.handleTouchEnd);
            }
        }
        
        // 键盘事件处理
        handleKeyDown(e) {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case '0':
                    this.resetView();
                    break;
            }
        }
        
        // 放大
        zoomIn() {
            this.zoomAt(0, 0, 1.2);
        }
        
        // 缩小
        zoomOut() {
            this.zoomAt(0, 0, 0.8);
        }

        // 滚轮缩放
        handleWheel(e) {
            e.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            
            if (this.options.zoomMode === 'cursor') {
                // 以鼠标光标为中心缩放
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                this.zoomAtCursor(mouseX, mouseY, delta);
            } else {
                // 以画布中心缩放（原有行为）
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.zoomAt(x, y, delta);
            }
        }
        
        // 在指定点缩放
        zoomAt(x, y, factor) {
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
            
            if (newScale !== this.scale) {
                // 计算缩放后的位移调整
                const scaleFactor = newScale / this.scale;
                this.translateX = (this.translateX - x / this.scale) * scaleFactor + x / newScale;
                this.translateY = (this.translateY - y / this.scale) * scaleFactor + y / newScale;
                this.scale = newScale;
                
                this.draw();
                this.updateScaleInfo();
            }
        }
        
        // 以光标为中心缩放
        zoomAtCursor(mouseX, mouseY, factor) {
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
            
            if (newScale !== this.scale) {
                // 获取画布中心点
                const canvasRect = this.canvas.getBoundingClientRect();
                const centerX = canvasRect.width / 2;
                const centerY = canvasRect.height / 2;
                
                // 计算鼠标相对于画布中心的位置
                const offsetX = mouseX - centerX;
                const offsetY = mouseY - centerY;
                
                // 计算缩放前鼠标指向的图片像素坐标
                const imageX = (offsetX - this.translateX * this.scale) / this.scale;
                const imageY = (offsetY - this.translateY * this.scale) / this.scale;
                
                // 更新缩放比例
                this.scale = newScale;
                
                // 重新计算位移，使鼠标仍然指向同一个图片像素
                this.translateX = (offsetX - imageX * this.scale) / this.scale;
                this.translateY = (offsetY - imageY * this.scale) / this.scale;
                
                this.draw();
                this.updateScaleInfo();
            }
        }
        
        // 鼠标按下
        handleMouseDown(e) {
            this.isDragging = true;
            this.hasMouseMoved = false;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
            
            // 添加全局鼠标事件监听，防止拖拽时移出canvas导致问题
            if (typeof document !== 'undefined') {
                document.addEventListener('mousemove', this.handleGlobalMouseMove);
                document.addEventListener('mouseup', this.handleGlobalMouseUp);
            }
            
            // 开始检测鼠标移动
            this.startMoveDetection(e.clientX, e.clientY);
        }
        
        // 全局鼠标移动（拖拽时）
        handleGlobalMouseMove = (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.lastX;
            const deltaY = e.clientY - this.lastY;
            
            this.translateX += deltaX / this.scale;
            this.translateY += deltaY / this.scale;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.draw();
        }
        
        // 全局鼠标释放（拖拽时）
        handleGlobalMouseUp = () => {
            this.isDragging = false;
            if (this.canvas) {
                this.canvas.style.cursor = 'grab';
            }
            
            // 移除全局事件监听
            if (typeof document !== 'undefined') {
                document.removeEventListener('mousemove', this.handleGlobalMouseMove);
                document.removeEventListener('mouseup', this.handleGlobalMouseUp);
            }
            
            // 停止检测鼠标移动
            this.stopMoveDetection();
            
            // 如果发生过拖拽移动，延迟后解除屏蔽
            if (this.hasMouseMoved) {
                console.log(`拖拽结束，${this.options.blockingDelay}ms后解除屏蔽`);
                setTimeout(() => {
                    this.clickBlockingEnabled = false;
                    this.hasMouseMoved = false;
                    console.log('解除屏蔽点击关闭');
                }, this.options.blockingDelay);
            }
        }
        
        // Canvas内鼠标移动
        handleMouseMove(e) {
            // 这个方法现在主要用于更新光标样式等非拖拽操作
            if (!this.isDragging) {
                // 可以在这里添加其他非拖拽时的鼠标移动逻辑
            }
        }
        
        // Canvas内鼠标释放
        handleMouseUp() {
            // 这个方法作为备用，实际拖拽结束主要由全局事件处理
            if (this.isDragging) {
                this.handleGlobalMouseUp();
            }
        }
        
        // 双击事件
        handleDoubleClick(e) {
            const rect = this.canvas.getBoundingClientRect();
            
            // 计算相对于初始铺满状态的缩放比例
            const relativeToInitial = this.scale / (this.imageData.initialScale || 1);
            
            if (relativeToInitial > 1.1) {
                // 如果已经放大（超过初始状态的110%），则重置到初始铺满状态
                this.resetTransform();
                this.draw();
                this.updateScaleInfo();
            } else {
                // 否则放大到双击位置（相对于当前状态的2倍）
                if (this.options.zoomMode === 'cursor') {
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    this.zoomAtCursor(mouseX, mouseY, 2);
                } else {
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    this.zoomAt(x, y, 2);
                }
            }
        }
        
        // 触摸开始
        handleTouchStart(e) {
            e.preventDefault();
            
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.isDragging = true;
                this.lastX = touch.clientX;
                this.lastY = touch.clientY;
                
                // 开始检测触摸移动
                this.startMoveDetection(touch.clientX, touch.clientY);
            }
        }
        
        // 触摸移动
        handleTouchMove(e) {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.isDragging) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastX;
                const deltaY = touch.clientY - this.lastY;
                
                this.translateX += deltaX / this.scale;
                this.translateY += deltaY / this.scale;
                
                this.lastX = touch.clientX;
                this.lastY = touch.clientY;
                
                this.draw();
            }
        }
        
        // 触摸结束
        handleTouchEnd() {
            this.isDragging = false;
            
            // 停止检测触摸移动
            this.stopMoveDetection();
            
            // 如果发生过触摸移动，延迟后解除屏蔽
            if (this.hasMouseMoved) {
                console.log(`触摸结束，${this.options.blockingDelay}ms后解除屏蔽`);
                setTimeout(() => {
                    this.clickBlockingEnabled = false;
                    this.hasMouseMoved = false;
                    console.log('解除屏蔽点击关闭');
                }, this.options.blockingDelay);
            }
        }
        
        // 开始检测鼠标移动
        startMoveDetection(startX, startY) {
            this.checkPositionX = startX;
            this.checkPositionY = startY;
            this.hasMouseMoved = false;
            this.clickBlockingEnabled = false;
            
            // 清除之前的定时器
            if (this.moveCheckTimer) {
                clearInterval(this.moveCheckTimer);
            }
            
            // 创建定时器持续检测鼠标位置
            this.moveCheckTimer = setInterval(() => {
                if (!this.isDragging) {
                    this.stopMoveDetection();
                    return;
                }
                
                // 获取当前鼠标位置并计算移动距离
                const deltaX = Math.abs(this.lastX - this.checkPositionX);
                const deltaY = Math.abs(this.lastY - this.checkPositionY);
                
                // 如果移动距离超过阈值，认为开始拖拽
                if (deltaX > this.options.moveThreshold || deltaY > this.options.moveThreshold) {
                    if (!this.hasMouseMoved) {
                        this.hasMouseMoved = true;
                        this.clickBlockingEnabled = true;
                        console.log('检测到拖拽移动，屏蔽点击关闭');
                    }
                }
                
                // 更新检测位置
                this.checkPositionX = this.lastX;
                this.checkPositionY = this.lastY;
                
            }, this.options.checkInterval);
        }
        
        // 停止检测鼠标移动
        stopMoveDetection() {
            if (this.moveCheckTimer) {
                clearInterval(this.moveCheckTimer);
                this.moveCheckTimer = null;
            }
        }
        
        // 处理窗口大小变化
        handleResize() {
            if (!this.isOpen || !this.canvas || !this.currentImage) return;
            
            // 防抖：清除之前的定时器
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            
            // 延迟执行重新布局，避免频繁触发
            this.resizeTimer = setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        }
        
        // 重新计算和调整 Canvas 大小
        resizeCanvas() {
            if (!this.canvas || !this.currentImage) return;
            
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
            const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
            
            // 计算新的可用视区大小
            const availableWidth = windowWidth * 0.9;
            const availableHeight = windowHeight - 200;
            const halfAvailableWidth = availableWidth * 0.5;
            const halfAvailableHeight = availableHeight * 0.5;
            
            // 获取图片原始尺寸
            let imageWidth = this.currentImage.width;
            let imageHeight = this.currentImage.height;
            
            // 重新计算初始显示尺寸和缩放比例
            let displayWidth = imageWidth;
            let displayHeight = imageHeight;
            let newInitialScale = 1;
            
            // 如果图片太小，进行倍增直到达到可用区域的一半
            while (displayWidth < halfAvailableWidth && displayHeight < halfAvailableHeight) {
                displayWidth *= 2;
                displayHeight *= 2;
                newInitialScale *= 2;
            }
            
            // 如果倍增后超出可用区域，则按比例缩小到适合可用区域
            if (displayWidth > availableWidth || displayHeight > availableHeight) {
                const scaleX = availableWidth / displayWidth;
                const scaleY = availableHeight / displayHeight;
                const finalScale = Math.min(scaleX, scaleY);
                
                displayWidth *= finalScale;
                displayHeight *= finalScale;
                newInitialScale *= finalScale;
            }
            
            // 计算当前缩放相对于旧初始缩放的比例
            const oldInitialScale = this.imageData.initialScale || 1;
            const scaleRatio = this.scale / oldInitialScale;
            
            // 更新 Canvas 尺寸
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.canvas.style.width = displayWidth + 'px';
            this.canvas.style.height = displayHeight + 'px';
            
            // 更新图片信息
            this.imageData = {
                width: displayWidth,
                height: displayHeight,
                naturalWidth: this.currentImage.width,
                naturalHeight: this.currentImage.height,
                initialScale: newInitialScale
            };
            
            // 根据新的初始缩放比例调整当前缩放
            this.scale = newInitialScale * scaleRatio;
            
            // 重新绘制
            this.draw();
            this.updateScaleInfo();
            
            console.log(`窗口大小变化，重新计算 Canvas 尺寸: ${Math.round(displayWidth)}x${Math.round(displayHeight)}, 新初始缩放: ${Math.round(newInitialScale * 100)}%`);
        }

        // 关闭查看器
        close() {
            if (!this.isOpen) return;
            
            this.isOpen = false;
            
            // 清理定时器
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = null;
            }
            
            // 清理拖拽状态和全局事件监听
            if (this.isDragging) {
                this.isDragging = false;
                this.hasMouseMoved = false;
                this.clickBlockingEnabled = false;
                this.stopMoveDetection();
                
                if (typeof document !== 'undefined') {
                    document.removeEventListener('mousemove', this.handleGlobalMouseMove);
                    document.removeEventListener('mouseup', this.handleGlobalMouseUp);
                }
            }
            
            // 恢复body滚动
            if (typeof document !== 'undefined') {
                document.body.classList.remove('modal-open');
            }
            
            // 移除事件监听
            this.removeViewerEventListeners();
            
            // 动画隐藏
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                setTimeout(() => {
                    if (this.overlay && this.overlay.parentNode) {
                        this.overlay.parentNode.removeChild(this.overlay);
                    }
                    this.overlay = null;
                    this.canvas = null;
                    this.ctx = null;
                    this.currentImage = null;
                    this.scaleInfo = null;
                    this.canvasContainer = null;
                    this.cornerIndicators = null;
                }, 300);
            }
        }
    }
    
    // 返回 PixelVoyager 类
    return PixelVoyager;
}));

// 浏览器环境自动初始化
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const PixelVoyager = typeof module !== 'undefined' && module.exports ? module.exports : window.PixelVoyager;
        const voyager = PixelVoyager.init();
        voyager.initEventListeners();
    });
}
