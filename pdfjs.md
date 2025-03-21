# PDF.js API 文档

## 目录

- [概述](#概述)
- [安装](#安装)
- [基本用法](#基本用法)
- [API 参考](#api-参考)
  - [文档加载](#文档加载)
  - [文档操作](#文档操作)
  - [页面操作](#页面操作)
  - [渲染](#渲染)
  - [工作线程](#工作线程)
- [配置选项](#配置选项)
- [高级用法](#高级用法)
- [常见问题](#常见问题)

## 概述

PDF.js 是由 Mozilla 开发的 JavaScript 库，用于在 Web 浏览器中渲染 PDF 文档。它使开发者能够在不依赖浏览器插件的情况下，直接在网页中显示和操作 PDF 内容。

**主要特性：**

- 纯 JavaScript 实现，无需插件
- 支持所有现代浏览器
- 可提取文本、注释和元数据
- 提供渲染、滚动和搜索功能
- 支持表单填写和操作

## 安装

### 通过 NPM

```bash
npm install pdfjs-dist
```

### 通过 CDN

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

### 配置工作线程

```javascript
// 设置 worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
```

## 基本用法

### 加载 PDF 文档

```javascript
// 从 URL 加载 PDF
const loadingTask = pdfjsLib.getDocument("https://example.com/document.pdf");
loadingTask.promise.then((pdfDocument) => {
  // PDF 文档已加载
  console.log(`PDF 文档加载完成，共 ${pdfDocument.numPages} 页`);
});

// 从二进制数据加载 PDF
const typedArray = new Uint8Array(pdfData);
const loadingTask = pdfjsLib.getDocument(typedArray);
```

### 渲染页面

```javascript
// 获取第一页
pdfDocument.getPage(1).then((page) => {
  const scale = 1.5;
  const viewport = page.getViewport({ scale });

  // 准备 canvas
  const canvas = document.getElementById("pdf-canvas");
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // 渲染 PDF 页面
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  page.render(renderContext).promise.then(() => {
    console.log("页面渲染完成");
  });
});
```

### 提取文本内容

```javascript
page.getTextContent().then((textContent) => {
  const textItems = textContent.items;
  let text = "";

  for (const item of textItems) {
    text += item.str + " ";
  }

  console.log(text);
});
```

## API 参考

### 文档加载

#### `pdfjsLib.getDocument(source)`

加载 PDF 文档的主入口函数。

- **参数**

  - `source`: 可以是：
    - `string` - PDF 文件的 URL
    - `TypedArray` - 包含 PDF 数据的类型化数组
    - `DocumentInitParameters` - 加载参数对象

- **返回值**
  - `PDFDocumentLoadingTask` - 文档加载任务对象

#### `PDFDocumentLoadingTask`

控制 PDF 文档加载操作的任务。

- **属性**

  - `docId`: 文档加载任务的唯一标识符
  - `destroyed`: 标识任务是否已销毁
  - `onPassword`: 密码回调函数
  - `onProgress`: 加载进度回调函数
  - `promise`: 返回 `PDFDocumentProxy` 对象的 Promise

- **方法**
  - `destroy()`: 中止所有网络请求并销毁工作线程
  - `getData()`: 获取 PDF 文档的原始数据

### 文档操作

#### `PDFDocumentProxy`

PDF 文档的代理对象，提供文档级操作。

- **属性**

  - `numPages`: PDF 文件的总页数
  - `fingerprints`: 用于识别 PDF 文档的指纹数组
  - `annotationStorage`: 注释数据存储
  - `isPureXfa`: 是否仅为 XFA 表单

- **方法**
  - `getPage(pageNumber)`: 获取特定页面，返回 `PDFPageProxy` 的 Promise
  - `getOutline()`: 获取文档大纲结构
  - `getMetadata()`: 获取文档元数据
  - `getDestinations()`: 获取命名目标映射
  - `getDestination(id)`: 获取特定命名目标
  - `getPageLabels()`: 获取页面标签
  - `getAttachments()`: 获取附件映射
  - `getJSActions()`: 获取 JavaScript 动作
  - `getPermissions()`: 获取权限标志
  - `cleanup(keepLoadedFonts)`: 清理文档资源
  - `destroy()`: 销毁文档实例和工作线程

### 页面操作

#### `PDFPageProxy`

PDF 页面的代理对象，提供页面级操作。

- **属性**

  - `pageNumber`: 页码（从 1 开始）
  - `rotate`: 页面旋转度数
  - `ref`: 指向此页面的引用
  - `userUnit`: 单位大小（72 分之一英寸）
  - `view`: 页面的可见部分数组 [x1, y1, x2, y2]

- **方法**
  - `getViewport(params)`: 获取视口信息
  - `render(params)`: 渲染页面到指定上下文，返回 `RenderTask`
  - `getTextContent(params)`: 获取页面文本内容
  - `getAnnotations(params)`: 获取页面注释
  - `getOperatorList(params)`: 获取页面操作符列表
  - `getStructTree()`: 获取页面结构树
  - `cleanup()`: 清理页面资源
  - `getJSActions()`: 获取页面特定的 JavaScript 动作

### 渲染

#### `RenderTask`

控制渲染任务。

- **属性**

  - `promise`: 渲染任务完成的 Promise
  - `onContinue`: 增量渲染回调
  - `onError`: 渲染错误回调
  - `separateAnnots`: 是否单独渲染表单注释

- **方法**
  - `cancel(extraDelay)`: 取消渲染任务

#### `PageViewport`

包含宽度、高度和渲染所需的变换信息。

- **参数**
  - `viewBox`: 页面的视图区域 [x1, y1, x2, y2]
  - `scale`: 缩放因子
  - `rotation`: 旋转角度
  - `offsetX`: 水平偏移
  - `offsetY`: 垂直偏移
  - `dontFlip`: 是否不翻转 y 轴

### 工作线程

#### `PDFWorker`

PDF.js 的工作线程抽象，用于多线程处理 PDF 文档。

- **属性**

  - `port`: 当前工作端口
  - `messageHandler`: 当前消息处理程序
  - `promise`: 工作线程初始化完成的 Promise

- **方法**

  - `destroy()`: 销毁工作线程实例

- **静态方法**
  - `fromPort(params)`: 从现有端口创建工作线程
  - `getWorkerSrc()`: 获取工作线程源

## 配置选项

### DocumentInitParameters

用于初始化/加载文档的参数对象。

```javascript
const loadingTask = pdfjsLib.getDocument({
  url: "https://example.com/document.pdf", // PDF 的 URL
  // 或者
  // data: typedArray,                         // 二进制 PDF 数据

  password: "your-password", // 用于解密受密码保护的 PDF
  cMapUrl: "https://example.com/cmaps/", // 预定义 Adobe CMaps 的 URL
  cMapPacked: true, // CMaps 是否为二进制打包格式

  // 字体相关
  standardFontDataUrl: "path/to/fonts/", // 标准字体文件的 URL
  disableFontFace: false, // 是否禁用字体转换和 Font Loading API
  useSystemFonts: true, // 是否使用系统字体

  // 网络相关
  httpHeaders: {
    // HTTP 请求头
    "Custom-Header": "Value",
  },
  withCredentials: false, // 是否使用凭据进行跨站点请求

  // 范围请求
  rangeChunkSize: 65536, // 每个范围请求获取的最大字节数
  disableRange: false, // 是否禁用范围请求加载
  disableStream: false, // 是否禁用 PDF 文件数据流
  disableAutoFetch: false, // 是否禁用预取数据

  // 其他选项
  verbosity: 1, // 日志级别
  enableXfa: false, // 是否渲染 XFA 表单
  stopAtErrors: false, // 是否在错误时停止
  pdfBug: false, // 是否启用调试支持
});
```

### RenderParameters

用于渲染页面的参数对象。

```javascript
const renderTask = page.render({
  canvasContext: context, // 2D Canvas 上下文
  viewport: viewport, // 通过 getViewport 获得的视口对象

  intent: "display", // 渲染意图: 'display'、'print' 或 'any'
  annotationMode: 1, // 注释模式: 0 (禁用)、1 (启用)、2 (仅表单)、3 (存储)

  transform: [1, 0, 0, 1, 0, 0], // 额外的变换矩阵
  background: "rgba(255, 255, 255, 1)", // Canvas 背景

  // 高级选项
  pageColors: null, // 页面颜色覆盖
  optionalContentConfigPromise: null, // 可选内容配置 Promise
});
```

## 高级用法

### 处理密码保护的 PDF

```javascript
const loadingTask = pdfjsLib.getDocument("encrypted.pdf");

// 设置密码回调
loadingTask.onPassword = (updatePassword, reason) => {
  // reason = 1: 需要密码
  // reason = 2: 密码错误
  const password = prompt("请输入密码:");
  updatePassword(password);
};

loadingTask.promise.then((pdfDocument) => {
  console.log("PDF 文档解密成功");
});
```

### 监控加载进度

```javascript
const loadingTask = pdfjsLib.getDocument("large-document.pdf");

loadingTask.onProgress = (progressData) => {
  const percentLoaded = Math.round(
    (progressData.loaded / progressData.total) * 100
  );
  console.log(`加载进度: ${percentLoaded}%`);
};

loadingTask.promise.then((pdfDocument) => {
  console.log("PDF 文档加载完成");
});
```

### 提取和导航文档大纲

```javascript
pdfDocument.getOutline().then((outline) => {
  if (outline) {
    console.log("文档大纲:");

    function processItems(items, indent = "") {
      for (const item of items) {
        console.log(`${indent}${item.title}`);

        if (item.items.length > 0) {
          processItems(item.items, `${indent}  `);
        }
      }
    }

    processItems(outline);
  } else {
    console.log("该文档没有大纲");
  }
});
```

### 处理表单

```javascript
// 获取表单字段
pdfDocument.getFieldObjects().then((fields) => {
  console.log("表单字段:", fields);
});

// 保存带有填写表单数据的文档
pdfDocument.saveDocument().then((data) => {
  // 保存 data (Uint8Array)
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "filled-form.pdf";
  link.click();

  URL.revokeObjectURL(url);
});
```

## 常见问题

### 跨域问题

如果遇到 CORS 错误，请确保：

1. PDF 文件服务器配置了正确的 CORS 头
2. 使用相同的域提供 PDF.js 文件和 PDF 文件
3. 或使用代理服务器中继请求

### 提高渲染性能

1. 仅渲染可见页面
2. 使用合适的缩放级别
3. 考虑使用 `OffscreenCanvas` 在工作线程中渲染
4. 对于大型文档，延迟加载页面

### 内存管理

定期清理未使用的资源：

```javascript
// 清理页面资源
page.cleanup();

// 清理文档资源
pdfDocument.cleanup();

// 完全销毁
pdfDocument.destroy();
loadingTask.destroy();
```

### 工作线程故障排除

如果工作线程无法初始化：

1. 检查 `workerSrc` 是否正确设置
2. 确保 worker 文件可访问且未被 CSP 阻止
3. 检查浏览器控制台是否有错误
4. 尝试设置 `disableWorker: true` 使用主线程处理（会影响性能）

---

## 版本信息

- **版本**: 3.11.174
- **许可证**: Apache License 2.0
- **项目主页**: [Mozilla PDF.js](https://github.com/mozilla/pdf.js)
- **文档**: [PDF.js 文档](https://mozilla.github.io/pdf.js/getting_started/)
