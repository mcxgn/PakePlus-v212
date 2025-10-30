<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>小学英语学习助手</title>
  <!-- 引入外部资源 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind配置 -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#4F46E5', // 主色调：靛蓝色
            secondary: '#EC4899', // 辅助色：粉色
            neutral: '#F3F4F6', // 中性色：浅灰
            level1: '#10B981', // L1级别颜色：绿色
            level2: '#F59E0B', // L2级别颜色：橙色
            level3: '#3B82F6', // L3级别颜色：蓝色
            level4: '#8B5CF6', // L4级别颜色：紫色
          },
          fontFamily: {
            sans: ['Open Sans', 'system-ui', 'sans-serif'],
          },
        },
      }
    }
  </script>
  
  <!-- 自定义工具类 -->
  <style type="text/tailwindcss">
    @layer utilities {
      .content-auto {
        content-visibility: auto;
      }
      .keyboard-key {
        @apply w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white shadow-md flex items-center justify-center text-gray-800 font-bold text-lg cursor-pointer transition-all duration-150 hover:bg-primary hover:text-white active:scale-95;
      }
      .letter-underline {
        @apply w-10 h-14 md:w-12 md:h-16 flex items-center justify-center border-b-2 border-gray-400 text-xl md:text-2xl font-bold mx-1 transition-all;
      }
      .letter-underline-filled {
        @apply border-b-2 border-primary text-primary;
      }
      .delete-btn {
        @apply p-2 text-red-500 hover:text-red-700 transition-colors;
      }
      .delete-btn:hover {
        @apply bg-red-50 rounded-full;
      }
      .audio-control-btn {
        @apply relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300;
      }
      .phonetic-text {
        @apply text-gray-500 italic text-base md:text-lg font-medium;
      }
      .translation-text {
        @apply text-gray-600 text-base md:text-lg font-medium;
      }
      .level-tab {
        @apply px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer;
      }
      .level-tab-active {
        @apply bg-primary text-white shadow-md;
      }
      .level1-tab-active {
        @apply bg-level1 text-white shadow-md;
      }
      .level2-tab-active {
        @apply bg-level2 text-white shadow-md;
      }
      .level3-tab-active {
        @apply bg-level3 text-white shadow-md;
      }
      .level4-tab-active {
        @apply bg-level4 text-white shadow-md;
      }
    }
  </style>
  
  <style>
    /* 保留原有的CSS样式 */
    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .bounce {
      animation: bounce 0.5s ease-in-out;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .key-press {
      animation: keyPress 0.15s ease-in-out;
    }
    
    @keyframes keyPress {
      0% { transform: scale(1); }
      50% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    
    .error-letter {
      position: absolute;
      color: #EF4444;
      font-size: 1.5rem;
      font-weight: bold;
      animation: errorLetter 0.5s ease-in-out forwards;
      pointer-events: none;
    }
    
    @keyframes errorLetter {
      0% { 
        opacity: 1;
        transform: translateY(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-20px);
      }
      100% {
        opacity: 0;
        transform: translateY(-30px);
      }
    }
    
    .partial-hint {
      position: absolute;
      background-color: rgba(79, 70, 229, 0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;
      z-index: 10;
      pointer-events: none;
      animation: fadeInOut 1s ease-in-out forwards;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-10px); }
      20% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    #custom-dict-modal {
      z-index: 9999;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6B7280;
    }
    
    #batch-delete-btn {
      transition: all 0.2s;
    }
    
    #batch-delete-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .word-item-selected {
      @apply bg-blue-50 border-2 border-primary;
    }
    
    .audio-control-group {
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .audio-control-panel {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 12px;
      width: 180px;
      z-index: 100;
      display: none;
    }
    
    .audio-control-panel.active {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }
    
    .audio-control-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #6B7280;
    }
    
    input[type="range"] {
      -webkit-appearance: none;
      height: 4px;
      border-radius: 2px;
      background: #ddd;
      outline: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #4F46E5;
      cursor: pointer;
    }
    
    #sound-toggle .fa-volume-up { color: #4F46E5; }
    #sound-toggle .fa-volume-down { color: #9CA3AF; }
    #sound-toggle .fa-volume-off { color: #EF4444; }
    
    .image-preview-container {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s;
    }
    
    .image-preview-container:hover {
      border-color: #4F46E5;
    }
    
    .image-preview {
      max-width: 100%;
      max-height: 200px;
      border-radius: 4px;
      display: none;
      margin: 0 auto;
    }
    
    .image-preview.active {
      display: block;
      margin-bottom: 1rem;
    }
    
    .remove-image {
      color: #EF4444;
      cursor: pointer;
      font-size: 0.875rem;
      display: none;
    }
    
    .remove-image.active {
      display: inline-block;
    }
    
    .phonetic-loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0,0,0,.1);
      border-radius: 50%;
      border-top-color: #4F46E5;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .phonetic-identify-btn {
      @apply text-primary text-sm px-2 py-1 rounded hover:bg-primary/10 transition-colors;
    }
    
    .file-upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 2rem 1rem;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .file-upload-area:hover {
      border-color: #4F46E5;
      background-color: #f9fafb;
    }
    
    .file-upload-icon {
      font-size: 2rem;
      color: #4F46E5;
      margin-bottom: 1rem;
    }
    
    .file-info {
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f3f4f6;
      border-radius: 4px;
      font-size: 0.875rem;
      text-align: left;
      display: none;
    }
    
    .file-info.active {
      display: block;
    }
    
    .upload-progress {
      height: 4px;
      background-color: #e5e7eb;
      border-radius: 2px;
      margin-top: 0.5rem;
      overflow: hidden;
      display: none;
    }
    
    .upload-progress.active {
      display: block;
    }
    
    .upload-progress-bar {
      height: 100%;
      background-color: #4F46E5;
      width: 0%;
      transition: width 0.3s ease;
    }
    
    .upload-results {
      margin-top: 1rem;
      max-height: 200px;
      overflow-y: auto;
      display: none;
    }
    
    .upload-results.active {
      display: block;
    }
    
    .result-item {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .result-success {
      background-color: #ecfdf5;
      color: #059669;
    }
    
    .result-error {
      background-color: #fee2e2;
      color: #dc2626;
    }
  </style>
</head>

<body class="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen font-sans text-gray-800 overflow-x-hidden">
  <!-- 页面头部 -->
  <header class="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <i class="fa fa-book text-primary text-2xl"></i>
        <h1 class="text-xl md:text-2xl font-bold text-primary">英语学习助手</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 中文翻译显示开关 -->
        <div class="relative group">
          <button id="translation-toggle" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i class="fa fa-language text-primary transition-all duration-300"></i>
          </button>
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            显示/隐藏中文翻译
          </span>
        </div>
        
        <!-- 音标显示开关 -->
        <div class="relative group">
          <button id="phonetic-toggle" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i class="fa fa-volume-up text-gray-600 transition-all duration-300"></i>
          </button>
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            显示/隐藏音标
          </span>
        </div>
        
        <!-- 增强的音频控制区域 -->
        <div class="audio-control-group">
          <button id="audio-control-btn" class="audio-control-btn relative group">
            <i class="fa fa-volume-up text-gray-600 transition-all duration-300"></i>
            <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              音频设置
            </span>
          </button>
          
          <div id="audio-control-panel" class="audio-control-panel">
            <div class="audio-control-label">
              <span>朗读音量</span>
              <span id="speech-volume-value">120%</span>
            </div>
            <input type="range" id="speech-volume-slider" min="0" max="150" value="120" class="w-full mb-6">
            
            <div class="audio-control-label">
              <span>音效音量</span>
              <span id="effect-volume-value">80%</span>
            </div>
            <input type="range" id="effect-volume-slider" min="0" max="100" value="80" class="w-full mb-4">
            
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center">
                <input type="checkbox" id="enable-speech" checked class="mr-2">
                <span>启用朗读</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" id="enable-sound-effects" checked class="mr-2">
                <span>启用音效</span>
              </label>
            </div>
          </div>
        </div>
        
        <button id="settings-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors relative group">
          <i class="fa fa-cog text-gray-600"></i>
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            设置
          </span>
        </button>
      </div>
    </div>
  </header>

  <!-- 主内容区 -->
  <main class="container mx-auto px-4 py-6 md:py-10">
    <!-- 级别选择 - 增加了L2、L3、L4 -->
    <div class="mb-6 flex flex-wrap gap-3">
      <div id="all-levels-tab" class="level-tab level-tab-active">
        <i class="fa fa-th-large mr-1"></i> 全部内容
      </div>
      <div id="level1-tab" class="level-tab hover:bg-level1/10">
        <i class="fa fa-signal mr-1"></i> L1 基础
      </div>
      <div id="level2-tab" class="level-tab hover:bg-level2/10">
        <i class="fa fa-signal mr-1"></i> L2 初级
      </div>
      <div id="level3-tab" class="level-tab hover:bg-level3/10">
        <i class="fa fa-signal mr-1"></i> L3 中级
      </div>
      <div id="level4-tab" class="level-tab hover:bg-level4/10">
        <i class="fa fa-signal mr-1"></i> L4 高级
      </div>
    </div>
    
    <!-- 学习进度 -->
    <div class="mb-6 bg-white rounded-xl shadow-sm p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-500">学习进度</span>
        <span class="text-sm font-medium text-primary" id="progress-text">0/0</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div id="progress-bar" class="bg-primary h-2.5 rounded-full" style="width: 0%"></div>
      </div>
    </div>
    
    <!-- 单词学习卡片 -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- 单词图片/图标区域 -->
        <div class="relative h-64 md:h-80 bg-neutral">
          <div id="word-image-container" class="w-full h-full flex items-center justify-center overflow-hidden">
            <i id="default-word-icon" class="fa fa-language text-6xl text-primary/30"></i>
            <img id="word-image" class="max-w-full max-h-full object-contain transition-all duration-300 hidden" src="" alt="">
          </div>
          <button id="play-sound" class="absolute bottom-4 right-4 bg-primary/90 text-white rounded-full p-3 shadow-lg hover:bg-primary transition-colors hidden">
            <i class="fa fa-volume-up"></i>
          </button>
        </div>
        
        <!-- 拼写区域 -->
        <div class="p-6">
          <div class="mb-4">
            <!-- 中文翻译显示区域 -->
            <div id="translation-display" class="text-center mb-2 opacity-0 transition-opacity duration-300">
              <span class="translation-text"></span>
            </div>
            
            <!-- 音标显示区域 -->
            <div id="phonetic-display" class="text-center mb-3 opacity-0 transition-opacity duration-300">
              <span class="phonetic-text"></span>
            </div>
            
            <label class="block text-sm font-medium text-gray-700">请拼写单词/句子（区分大小写）：</label>
            
            <!-- 字母下划线区域 -->
            <div id="letter-underscores-container" class="relative">
              <div id="letter-underscores" class="flex justify-center my-6 flex-wrap">
                <!-- 字母下划线将通过JS动态生成 -->
              </div>
            </div>
            
            <div id="empty-state-message" class="empty-state hidden">
              <i class="fa fa-plus-circle text-4xl mb-3 text-gray-300"></i>
              <p>还没有学习内容，请添加自定义单词或句子</p>
            </div>
            
            <div id="error-message" class="mt-1 text-red-500 text-sm hidden text-center">拼写错误，请再试一次！</div>
          </div>
          
          <!-- 提示已移除，只保留字符计数 -->
          <div class="flex justify-between items-center text-sm text-gray-500">
            <div>
              <span id="letter-count">0个字符</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 虚拟键盘 -->
    <div id="keyboard-container" class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 mb-8 hidden">
      <div id="keyboard" class="grid grid-cols-10 gap-2">
        <!-- 键盘按键将通过JS动态生成 -->
      </div>
    </div>
    
    <!-- 功能按钮区 -->
    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <button id="prev-word" class="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center" disabled>
        <i class="fa fa-arrow-left mr-2"></i> 上一个
      </button>
      <button id="next-word" class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center" disabled>
        下一个 <i class="fa fa-arrow-right ml-2"></i>
      </button>
      <button id="custom-dict-btn" class="px-6 py-3 bg-secondary text-white rounded-lg shadow-sm hover:bg-secondary/90 transition-colors flex items-center">
        <i class="fa fa-plus mr-2"></i> 自定义内容
      </button>
    </div>
  </main>

  <!-- 页脚 -->
  <footer class="bg-white border-t border-gray-200 py-4">
    <div class="container mx-auto px-4 text-center text-sm text-gray-500">
      <p>© 2024 小学英语学习助手 | 让英语学习更有趣</p>
    </div>
  </footer>

  <!-- 自定义单词模态框 -->
  <div id="custom-dict-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden fade-in">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">添加自定义内容</h3>
        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
          <i class="fa fa-times text-xl"></i>
        </button>
      </div>
      
      <form id="custom-word-form">
        <input type="hidden" id="edit-word-id" value="">
        
        <!-- 级别选择 - 增加了L2、L3、L4 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">选择级别 <span class="text-red-500">*</span></label>
          <div class="flex gap-2 flex-wrap">
            <label class="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
              <input type="radio" name="word-level" value="default" checked class="mr-2 text-primary">
              <span>默认</span>
            </label>
            <label class="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-level1/10 transition-colors flex-1">
              <input type="radio" name="word-level" value="L1" class="mr-2 text-level1">
              <span>L1 基础</span>
            </label>
            <label class="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-level2/10 transition-colors flex-1">
              <input type="radio" name="word-level" value="L2" class="mr-2 text-level2">
              <span>L2 初级</span>
            </label>
            <label class="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-level3/10 transition-colors flex-1">
              <input type="radio" name="word-level" value="L3" class="mr-2 text-level3">
              <span>L3 中级</span>
            </label>
            <label class="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-level4/10 transition-colors flex-1">
              <input type="radio" name="word-level" value="L4" class="mr-2 text-level4">
              <span>L4 高级</span>
            </label>
          </div>
        </div>
        
        <!-- 文件上传区域 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">上传文本文档 <span class="text-red-500">*</span></label>
          <p class="text-xs text-gray-500 mb-2">请上传TXT文件，按"英文+音标+中文翻译"格式排列，每行一个内容</p>
          
          <div id="file-upload-area" class="file-upload-area">
            <input type="file" id="custom-word-file" class="hidden" accept=".txt">
            <div class="file-upload-icon">
              <i class="fa fa-file-text-o"></i>
            </div>
            <h4 class="font-medium">点击或拖拽文件到此处上传</h4>
            <p class="text-sm text-gray-500 mt-1">支持 .txt 格式文件</p>
          </div>
          
          <div id="file-info" class="file-info">
            <div class="flex justify-between items-center">
              <span id="file-name" class="truncate"></span>
              <button type="button" id="remove-file" class="text-red-500 hover:text-red-700 text-sm">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div class="upload-progress">
              <div id="upload-progress-bar" class="upload-progress-bar"></div>
            </div>
          </div>
          
          <div id="upload-results" class="upload-results">
            <!-- 上传结果将在这里显示 -->
          </div>
          
          <div id="file-error" class="mt-1 text-red-500 text-xs hidden">请上传有效的TXT文件</div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">文件格式说明</label>
          <div class="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
            <p>请按以下格式准备TXT文件：</p>
            <p>1. 英文内容（第一行）</p>
            <p>2. 对应的音标（第二行）</p>
            <p>3. 中文翻译（第三行）</p>
            <p>4. 英文内容（第四行）</p>
            <p>5. 对应的音标（第五行）</p>
            <p>6. 中文翻译（第六行）</p>
            <p>依此类推...</p>
            <p class="mt-2 font-medium">各级别建议内容：</p>
            <p>- L1（基础）：单音节词，如cat, dog, apple</p>
            <p>- L2（初级）：双音节词，如teacher, happy</p>
            <p>- L3（中级）：多音节词和简单短语</p>
            <p>- L4（高级）：复杂词汇和完整句子</p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button type="submit" id="submit-word-btn" class="flex-1 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center" disabled>
            <i class="fa fa-plus mr-2"></i> 添加内容
          </button>
          <button type="button" id="manage-words-btn" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
            <i class="fa fa-list mr-2"></i> 管理内容
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 自定义单词管理模态框 -->
  <div id="manage-words-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden fade-in">
    <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">管理自定义内容</h3>
        <div class="flex items-center gap-2">
          <button id="batch-delete-btn" class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm shadow-sm hover:bg-red-600 transition-colors flex items-center" disabled>
            <i class="fa fa-trash mr-1"></i> 批量删除
          </button>
          <button id="close-manage-modal" class="text-gray-500 hover:text-gray-700">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="relative">
          <input type="text" id="word-search" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" placeholder="搜索内容...">
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
      
      <div id="custom-words-list" class="flex-1 overflow-y-auto hide-scrollbar bg-gray-50 rounded-lg p-2">
        <!-- 自定义内容列表将通过JS动态生成 -->
        <div class="text-center text-gray-500 py-10">暂无自定义内容</div>
      </div>
      
      <div class="mt-4 text-sm text-gray-500 flex justify-between">
        <span id="words-count">共 0 个自定义内容</span>
        <span id="selected-count">已选择 0 个</span>
      </div>
    </div>
  </div>

  <!-- 删除确认模态框 -->
  <div id="delete-confirm-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-60 hidden fade-in">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="text-center mb-4">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <i class="fa fa-exclamation-triangle text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
        <p class="text-gray-600" id="delete-confirm-message">您确定要删除这个内容吗？此操作无法撤销。</p>
      </div>
      
      <div class="flex gap-3">
        <button id="cancel-delete-btn" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
          取消
        </button>
        <button id="confirm-delete-btn" class="flex-1 py-3 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors">
          确认删除
        </button>
      </div>
    </div>
  </div>

  <!-- JavaScript -->
  <script>
    // 初始化空的单词库，按级别分类存储 - 增加了L2、L3、L4
    const words = {
      default: [],  // 默认级别
      L1: [],        // L1级别
      L2: [],        // L2级别
      L3: [],        // L3级别
      L4: []         // L4级别
    };
    // 当前激活的级别筛选（默认显示全部）
    let activeLevel = 'all';
    // 获取当前筛选后的单词列表
    function getFilteredWords() {
      if (activeLevel === 'all') {
        // 合并所有级别的单词，并保持原有顺序
        return [...words.default, ...words.L1, ...words.L2, ...words.L3, ...words.L4];
      }
      return [...words[activeLevel]];
    }
    
    // 判断内容ID是否属于当前激活的级别
    function isInActiveLevel(wordId) {
      // 全部内容模式下，所有内容都被视为"当前章节"
      if (activeLevel === 'all') return true;
      
      // 检查该ID是否属于当前激活的级别
      return words[activeLevel].some(word => word.id === wordId);
    }
    
    // 存储选中的内容ID
    const selectedWordIds = new Set();

    let currentWordIndex = 0;
    let currentWord = '';
    let userInput = '';
    let speechEnabled = true; // 朗读功能开关
    let soundEffectsEnabled = true; // 音效开关
    let speechVolume = 120; // 朗读音量 0-150，默认值120
    let effectVolume = 80; // 音效音量 0-100
    let phoneticVisible = true; // 音标显示状态
    let translationVisible = true; // 中文翻译显示状态
    // 存储待删除的内容ID
    let wordToDelete = null;
    // 存储上传的文件内容
    let uploadedWords = [];
    // 跟踪每个位置的连续错误次数
    let consecutiveErrors = {};

    // 创建音频上下文和音效缓冲区
    let audioContext;
    let keyPressBuffer;
    let correctBuffer;
    let errorBuffer;
    let effectGainNode; // 音效音量控制节点

    // DOM元素
    const letterUnderscores = document.getElementById('letter-underscores');
    const letterUnderscoresContainer = document.getElementById('letter-underscores-container');
    const emptyStateMessage = document.getElementById('empty-state-message');
    const keyboard = document.getElementById('keyboard');
    const keyboardContainer = document.getElementById('keyboard-container');
    const errorMessage = document.getElementById('error-message');
    const letterCount = document.getElementById('letter-count');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const playSoundBtn = document.getElementById('play-sound');
    const audioControlBtn = document.getElementById('audio-control-btn');
    const audioControlPanel = document.getElementById('audio-control-panel');
    const speechVolumeSlider = document.getElementById('speech-volume-slider');
    const speechVolumeValue = document.getElementById('speech-volume-value');
    const effectVolumeSlider = document.getElementById('effect-volume-slider');
    const effectVolumeValue = document.getElementById('effect-volume-value');
    const enableSpeechCheckbox = document.getElementById('enable-speech');
    const enableSoundEffectsCheckbox = document.getElementById('enable-sound-effects');
    const prevWordBtn = document.getElementById('prev-word');
    const nextWordBtn = document.getElementById('next-word');
    const customDictBtn = document.getElementById('custom-dict-btn');
    const customDictModal = document.getElementById('custom-dict-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const customWordForm = document.getElementById('custom-word-form');
    const fileError = document.getElementById('file-error');
    const editWordId = document.getElementById('edit-word-id');
    const submitWordBtn = document.getElementById('submit-word-btn');
    const manageWordsBtn = document.getElementById('manage-words-btn');
    const manageWordsModal = document.getElementById('manage-words-modal');
    const closeManageModalBtn = document.getElementById('close-manage-modal');
    const customWordsList = document.getElementById('custom-words-list');
    const wordsCount = document.getElementById('words-count');
    const wordSearch = document.getElementById('word-search');
    const batchDeleteBtn = document.getElementById('batch-delete-btn');
    const selectedCount = document.getElementById('selected-count');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteConfirmMessage = document.getElementById('delete-confirm-message');
    // 图片相关元素
    const wordImage = document.getElementById('word-image');
    const defaultWordIcon = document.getElementById('default-word-icon');
    // 音标和翻译相关元素
    const phoneticDisplay = document.getElementById('phonetic-display');
    const phoneticText = phoneticDisplay.querySelector('.phonetic-text');
    const phoneticToggle = document.getElementById('phonetic-toggle');
    const translationDisplay = document.getElementById('translation-display');
    const translationText = translationDisplay.querySelector('.translation-text');
    const translationToggle = document.getElementById('translation-toggle');
    // 级别相关元素 - 增加了L2、L3、L4
    const allLevelsTab = document.getElementById('all-levels-tab');
    const level1Tab = document.getElementById('level1-tab');
    const level2Tab = document.getElementById('level2-tab');
    const level3Tab = document.getElementById('level3-tab');
    const level4Tab = document.getElementById('level4-tab');
    // 文件上传相关元素
    let fileUploadArea, customWordFile, fileName, fileInfo, removeFileBtn;
    const uploadProgress = document.querySelector('.upload-progress');
    const uploadProgressBar = document.getElementById('upload-progress-bar');
    const uploadResults = document.getElementById('upload-results');

    // 更新级别标签的可点击状态
    function updateLevelTabStates() {
      // 检查每个级别的内容数量
      const level1HasContent = words.L1.length > 0;
      const level2HasContent = words.L2.length > 0;
      const level3HasContent = words.L3.length > 0;
      const level4HasContent = words.L4.length > 0;
      
      // 更新L1标签状态
      if (level1HasContent) {
        level1Tab.classList.remove('opacity-50', 'cursor-not-allowed');
        level1Tab.removeAttribute('disabled');
      } else {
        level1Tab.classList.add('opacity-50', 'cursor-not-allowed');
        level1Tab.setAttribute('disabled', 'true');
      }
      
      // 更新L2标签状态
      if (level2HasContent) {
        level2Tab.classList.remove('opacity-50', 'cursor-not-allowed');
        level2Tab.removeAttribute('disabled');
      } else {
        level2Tab.classList.add('opacity-50', 'cursor-not-allowed');
        level2Tab.setAttribute('disabled', 'true');
      }
      
      // 更新L3标签状态
      if (level3HasContent) {
        level3Tab.classList.remove('opacity-50', 'cursor-not-allowed');
        level3Tab.removeAttribute('disabled');
      } else {
        level3Tab.classList.add('opacity-50', 'cursor-not-allowed');
        level3Tab.setAttribute('disabled', 'true');
      }
      
      // 更新L4标签状态
      if (level4HasContent) {
        level4Tab.classList.remove('opacity-50', 'cursor-not-allowed');
        level4Tab.removeAttribute('disabled');
      } else {
        level4Tab.classList.add('opacity-50', 'cursor-not-allowed');
        level4Tab.setAttribute('disabled', 'true');
      }
    }

    // 加载自定义内容（按级别）
    function loadCustomWords() {
      const savedWords = localStorage.getItem('customWords');
      if (savedWords) {
        try {
          const parsed = JSON.parse(savedWords);
          
          // 清空现有数据
          words.default.length = 0;
          words.L1.length = 0;
          words.L2.length = 0;
          words.L3.length = 0;
          words.L4.length = 0;
          
          // 按级别分类添加
          parsed.forEach(item => {
            // 确保每个内容都有唯一ID和必要属性
            if (!item.id) {
              item.id = 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            // 确保级别属性存在，默认为default
            if (!item.level) {
              item.level = 'default';
            }
            // 确保其他属性存在
            if (!item.imageUrl) item.imageUrl = '';
            if (!item.phonetic) item.phonetic = '';
            if (!item.translation) item.translation = '';
            
            // 添加到对应级别的数组
            if (words[item.level]) {
              words[item.level].push(item);
            } else {
              words.default.push(item);
            }
          });
        } catch (e) {
          console.error('Error loading custom items:', e);
        }
      }
    }

    // 保存自定义内容（按级别）
    function saveCustomWords() {
      // 合并所有级别的单词
      const allWords = [...words.default, ...words.L1, ...words.L2, ...words.L3, ...words.L4];
      localStorage.setItem('customWords', JSON.stringify(allWords));
      updateCustomWordsList();
      updateEmptyState();
      updateLevelTabStates(); // 更新级别标签状态
    }
    
    // 更新空状态显示
    function updateEmptyState() {
      const filteredWords = getFilteredWords();
      const hasWords = filteredWords.length > 0;
      
      // 显示或隐藏空状态信息
      emptyStateMessage.classList.toggle('hidden', hasWords);
      
      // 显示或隐藏学习元素
      playSoundBtn.classList.toggle('hidden', !hasWords);
      keyboardContainer.classList.toggle('hidden', !hasWords);
      phoneticDisplay.classList.toggle('hidden', !hasWords || !phoneticVisible);
      translationDisplay.classList.toggle('hidden', !hasWords || !translationVisible);
      
      // 启用或禁用导航按钮
      prevWordBtn.disabled = !hasWords || currentWordIndex === 0;
      nextWordBtn.disabled = !hasWords || currentWordIndex === filteredWords.length - 1;
      
      // 更新进度
      if (hasWords) {
        progressText.textContent = `${currentWordIndex + 1}/${filteredWords.length}`;
        progressBar.style.width = `${((currentWordIndex + 1) / filteredWords.length) * 100}%`;
      } else {
        progressText.textContent = `0/0`;
        progressBar.style.width = `0%`;
      }
    }
    
    // 更新选中计数和批量删除按钮状态
    function updateSelectionState() {
      const count = selectedWordIds.size;
      selectedCount.textContent = `已选择 ${count} 个`;
      batchDeleteBtn.disabled = count === 0;
      
      // 更改批量删除按钮文本
      if (count === 1) {
        batchDeleteBtn.innerHTML = '<i class="fa fa-trash mr-1"></i> 删除所选';
      } else if (count > 1) {
        batchDeleteBtn.innerHTML = `<i class="fa fa-trash mr-1"></i> 删除 ${count} 项`;
      }
    }
    
    // 切换内容选择状态
    function toggleWordSelection(wordId, element) {
      if (selectedWordIds.has(wordId)) {
        selectedWordIds.delete(wordId);
        element.classList.remove('word-item-selected');
      } else {
        selectedWordIds.add(wordId);
        element.classList.add('word-item-selected');
      }
      updateSelectionState();
    }
    
    // 清除所有选择
    function clearAllSelections() {
      selectedWordIds.clear();
      document.querySelectorAll('.word-item-selected').forEach(el => {
        el.classList.remove('word-item-selected');
      });
      updateSelectionState();
    }
    
    // 显示删除确认对话框
    function showDeleteConfirmDialog(wordId, isBatch = false) {
      wordToDelete = wordId;
      
      if (isBatch) {
        deleteConfirmMessage.textContent = `您确定要删除选中的 ${selectedWordIds.size} 个内容吗？此操作无法撤销。`;
      } else {
        // 查找单词所在的级别
        let wordItem = null;
        for (const level in words) {
          wordItem = words[level].find(w => w.id === wordId);
          if (wordItem) break;
        }
        deleteConfirmMessage.textContent = `您确定要删除"${wordItem?.word || '这个内容'}"吗？此操作无法撤销。`;
      }
      
      deleteConfirmModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    
    // 关闭删除确认对话框
    function closeDeleteConfirmDialog() {
      deleteConfirmModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      wordToDelete = null;
    }
    
    // 执行删除操作
    function performDelete() {
      if (wordToDelete === null) return;
      
      // 批量删除
      if (Array.isArray(wordToDelete)) {
        // 获取当前激活级别的内容ID
        const activeLevelWords = activeLevel === 'all' ? getFilteredWords() : words[activeLevel];
        const activeLevelWordIds = new Set(activeLevelWords.map(word => word.id));
        
        // 计算当前激活级别在删除后会剩下多少内容
        let remainingActiveCount = activeLevelWordIds.size;
        wordToDelete.forEach(id => {
          if (activeLevelWordIds.has(id)) {
            remainingActiveCount--;
          }
        });
        
        // 如果删除后当前激活级别会没有内容，调整删除列表
        if (remainingActiveCount === 0 && activeLevelWordIds.size > 0) {
          // 找出属于当前激活级别的内容ID
          const activeToDelete = wordToDelete.filter(id => activeLevelWordIds.has(id));
          
          // 如果有属于当前激活级别的内容，保留一个
          if (activeToDelete.length > 0) {
            // 从删除列表中移除最后一个属于当前激活级别的内容
            const idToKeep = activeToDelete.pop();
            wordToDelete = wordToDelete.filter(id => id !== idToKeep);
            
            showNotification(`当前章节至少需要保留1个内容，已为您保留1个`, 'info');
          }
        }
        
        wordToDelete.forEach(id => deleteWordById(id));
      } 
      // 单个删除
      else {
        deleteWordById(wordToDelete);
      }
      
      closeDeleteConfirmDialog();
      clearAllSelections();
      saveCustomWords();
      updateLevelTabStates(); // 更新级别标签状态
      showNotification('内容已成功删除', 'success');
    }
    
    // 根据ID删除内容
    function deleteWordById(wordId) {
      // 查找单词所在的级别和索引
      for (const level in words) {
        const index = words[level].findIndex(w => w.id === wordId);
        if (index !== -1) {
          words[level].splice(index, 1);
          break;
        }
      }
      
      // 更新当前显示
      const filteredWords = getFilteredWords();
      // 处理当前索引
      if (currentWordIndex >= filteredWords.length) {
        currentWordIndex = Math.max(0, filteredWords.length - 1);
      }
      setCurrentWord(currentWordIndex);
    }
    
    // 更新自定义内容列表
    function updateCustomWordsList() {
      const searchTerm = wordSearch.value.toLowerCase().trim();
      // 获取所有级别的单词
      const allWords = [...words.default, ...words.L1, ...words.L2, ...words.L3, ...words.L4];
      const filteredWords = allWords.filter(item => 
        searchTerm === '' || item.word.toLowerCase().includes(searchTerm) ||
        item.phonetic.toLowerCase().includes(searchTerm) ||
        item.translation.toLowerCase().includes(searchTerm)
      );
      
      customWordsList.innerHTML = '';
      
      if (filteredWords.length === 0) {
        customWordsList.innerHTML = '<div class="text-center text-gray-500 py-10">暂无自定义内容</div>';
      } else {
        filteredWords.forEach(item => {
          const wordItem = document.createElement('div');
          wordItem.className = 'bg-white rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer';
          wordItem.dataset.id = item.id;
          
          // 添加级别标识
          if (item.level === 'L1') {
            wordItem.innerHTML += `<span class="absolute left-2 top-2 bg-level1 text-white text-xs px-1.5 py-0.5 rounded">L1</span>`;
            wordItem.classList.add('relative', 'pl-8');
          } else if (item.level === 'L2') {
            wordItem.innerHTML += `<span class="absolute left-2 top-2 bg-level2 text-white text-xs px-1.5 py-0.5 rounded">L2</span>`;
            wordItem.classList.add('relative', 'pl-8');
          } else if (item.level === 'L3') {
            wordItem.innerHTML += `<span class="absolute left-2 top-2 bg-level3 text-white text-xs px-1.5 py-0.5 rounded">L3</span>`;
            wordItem.classList.add('relative', 'pl-8');
          } else if (item.level === 'L4') {
            wordItem.innerHTML += `<span class="absolute left-2 top-2 bg-level4 text-white text-xs px-1.5 py-0.5 rounded">L4</span>`;
            wordItem.classList.add('relative', 'pl-8');
          }
          
          // 检查是否被选中
          if (selectedWordIds.has(item.id)) {
            wordItem.classList.add('word-item-selected');
          }
          
          // 点击项切换选择状态
          wordItem.addEventListener('click', (e) => {
            // 如果点击的是操作按钮，则不切换选择状态
            if (!e.target.closest('.actions')) {
              toggleWordSelection(item.id, wordItem);
            }
          });
          
          const wordInfo = document.createElement('div');
          wordInfo.className = 'flex items-center gap-3';
          
          const wordIcon = document.createElement('div');
          // 如果有图片，显示缩略图，否则显示默认图标
          if (item.imageUrl) {
            wordIcon.className = 'w-12 h-12 rounded overflow-hidden';
            wordIcon.innerHTML = `<img src="${item.imageUrl}" alt="${item.word}" class="w-full h-full object-cover">`;
          } else {
            wordIcon.className = 'w-12 h-12 rounded bg-primary/10 flex items-center justify-center';
            wordIcon.innerHTML = '<i class="fa fa-font text-primary"></i>';
          }
          
          const wordDetails = document.createElement('div');
          wordDetails.className = 'flex flex-col';
          
          const wordText = document.createElement('div');
          wordText.className = 'font-medium';
          wordText.textContent = item.word;
          
          // 显示音标
          const phoneticTextEl = document.createElement('div');
          phoneticTextEl.className = 'text-xs text-gray-500 italic';
          phoneticTextEl.textContent = item.phonetic || '';
          
          // 显示翻译
          const translationTextEl = document.createElement('div');
          translationTextEl.className = 'text-xs text-gray-600';
          translationTextEl.textContent = item.translation || '';
          
          wordDetails.appendChild(wordText);
          wordDetails.appendChild(phoneticTextEl);
          wordDetails.appendChild(translationTextEl);
          wordInfo.appendChild(wordIcon);
          wordInfo.appendChild(wordDetails);
          
          const actions = document.createElement('div');
          actions.className = 'actions flex gap-2';
          
          // 删除按钮
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.title = '删除';
          deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
          
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 检查该内容是否属于当前激活级别
            if (isInActiveLevel(item.id)) {
              // 获取当前激活级别的内容
              const activeLevelWords = activeLevel === 'all' ? getFilteredWords() : words[activeLevel];
              
              // 如果当前激活级别只有这一个内容，阻止删除
              if (activeLevelWords.length === 1 && activeLevelWords[0].id === item.id) {
                showNotification('当前章节至少需要保留1个内容', 'error');
                return;
              }
            }
            
            showDeleteConfirmDialog(item.id);
          });
          
          actions.appendChild(deleteBtn);
          
          wordItem.appendChild(wordInfo);
          wordItem.appendChild(actions);
          
          customWordsList.appendChild(wordItem);
        });
      }
      
      wordsCount.textContent = `共 ${allWords.length} 个自定义内容`;
      updateSelectionState();
    }
    
    // 重置文件上传区域
    function resetFileUpload() {
      // 确保元素引用有效
      if (customWordFile) {
        customWordFile.value = '';
      }
      
      if (fileInfo) {
        fileInfo.classList.remove('active');
      }
      
      if (uploadProgress) {
        uploadProgress.classList.remove('active');
      }
      
      if (uploadResults) {
        uploadResults.classList.remove('active');
        uploadResults.innerHTML = '';
      }
      
      if (fileError) {
        fileError.classList.add('hidden');
      }
      
      uploadedWords = [];
      submitWordBtn.disabled = true;
      
      // 恢复文件上传区域原始HTML
      const fileUploadContainer = document.querySelector('#file-upload-area').parentNode;
      fileUploadContainer.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">上传文本文档 <span class="text-red-500">*</span></label>
        <p class="text-xs text-gray-500 mb-2">请上传TXT文件，按"英文+音标+中文翻译"格式排列，每行一个内容</p>
        
        <div id="file-upload-area" class="file-upload-area">
          <input type="file" id="custom-word-file" class="hidden" accept=".txt">
          <div class="file-upload-icon">
            <i class="fa fa-file-text-o"></i>
          </div>
          <h4 class="font-medium">点击或拖拽文件到此处上传</h4>
          <p class="text-sm text-gray-500 mt-1">支持 .txt 格式文件</p>
        </div>
        
        <div id="file-info" class="file-info">
          <div class="flex justify-between items-center">
            <span id="file-name" class="truncate"></span>
            <button type="button" id="remove-file" class="text-red-500 hover:text-red-700 text-sm">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <div class="upload-progress">
            <div id="upload-progress-bar" class="upload-progress-bar"></div>
          </div>
        </div>
        
        <div id="upload-results" class="upload-results">
          <!-- 上传结果将在这里显示 -->
        </div>
        
        <div id="file-error" class="mt-1 text-red-500 text-xs hidden">请上传有效的TXT文件</div>
      `;
      
      // 重新获取DOM元素并绑定事件
      initFileUploadEvents();
    }
    
    // 初始化文件上传事件
    function initFileUploadEvents() {
      // 重新获取DOM元素引用
      fileUploadArea = document.getElementById('file-upload-area');
      customWordFile = document.getElementById('custom-word-file');
      fileName = document.getElementById('file-name');
      fileInfo = document.getElementById('file-info');
      removeFileBtn = document.getElementById('remove-file');
      
      // 点击上传区域触发文件选择
      fileUploadArea.addEventListener('click', () => {
        customWordFile.click();
      });
      
      // 处理文件选择
      customWordFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileUpload(e.target.files[0]);
        }
      });
      
      // 拖拽功能
      fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('border-primary', 'bg-primary/5');
      });
      
      fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('border-primary', 'bg-primary/5');
      });
      
      fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('border-primary', 'bg-primary/5');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
      
      // 移除文件
      removeFileBtn.addEventListener('click', () => {
        resetFileUpload();
      });
    }
    
    // 处理文件上传 - 按"英文+音标+中文翻译"格式解析
    function handleFileUpload(file) {
      // 验证文件类型
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        fileError.textContent = '请上传TXT格式的文本文件';
        fileError.classList.remove('hidden');
        return;
      }
      
      // 显示文件信息
      fileName.textContent = file.name;
      fileInfo.classList.add('active');
      uploadProgress.classList.add('active');
      fileError.classList.add('hidden');
      
      // 读取文件内容
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        uploadProgressBar.style.width = '10%';
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          uploadProgressBar.style.width = `${percent}%`;
        }
      };
      
      reader.onload = (e) => {
        uploadProgressBar.style.width = '100%';
        
        // 解析文件内容，按行分割
        const content = e.target.result;
        const lines = content.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        // 按"英文+音标+中文翻译"格式处理（3行一组）
        uploadedWords = [];
        for (let i = 0; i < lines.length; i += 3) {
          const word = lines[i];
          const phonetic = lines[i + 1] || '';
          const translation = lines[i + 2] || '';
          
          uploadedWords.push({
            word: word,
            phonetic: phonetic,
            translation: translation
          });
        }
        
        // 显示上传结果
        setTimeout(() => {
          uploadResults.classList.add('active');
          uploadResults.innerHTML = `
            <div class="result-item result-success">
              <i class="fa fa-check-circle mr-1"></i> 成功解析 ${uploadedWords.length} 组内容
            </div>
          `;
          
          // 启用提交按钮
          submitWordBtn.disabled = false;
        }, 500);
      };
      
      reader.onerror = () => {
        fileError.textContent = '文件读取失败，请重试';
        fileError.classList.remove('hidden');
        uploadProgressBar.style.width = '0%';
      };
      
      reader.readAsText(file);
    }
    
    // 验证输入内容
    function validateWordInput(input) {
      // 移除前后空格
      const trimmedInput = input.trim();
      
      // 检查是否为空
      if (!trimmedInput) {
        return false;
      }
      
      // 允许字母、数字、空格和常见标点符号
      if (!/^[a-zA-Z0-9\s.,!?']+$/.test(trimmedInput)) {
        return false;
      }
      
      return trimmedInput; // 保留原始大小写
    }
    
    // 获取单词音标
    async function getWordPhonetic(word) {
      try {
        // 使用开源词典API获取音标
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
          return '';
        }
        
        const data = await response.json();
        
        // 提取音标
        if (data && data[0] && data[0].phonetics && data[0].phonetics.length > 0) {
          // 优先使用带音频的音标
          const phoneticWithAudio = data[0].phonetics.find(p => p.audio);
          if (phoneticWithAudio && phoneticWithAudio.text) {
            return phoneticWithAudio.text;
          }
          
          // 否则使用第一个可用的音标
          for (const phonetic of data[0].phonetics) {
            if (phonetic.text) {
              return phonetic.text;
            }
          }
        }
        
        return '';
      } catch (error) {
        console.error('获取音标失败:', error);
        return '';
      }
    }

    // 播放发音
    function speakWord(text) {
      if (!speechEnabled) return;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // 慢一点，适合儿童学习
      // 限制音量最大值为1（API上限）
      utterance.volume = Math.min(1, speechVolume / 100);
      
      speechSynthesis.speak(utterance);
    }

    // 打开模态框
    function openModal() {
      customDictModal.classList.remove('hidden');
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    // 关闭模态框
    function closeModal() {
      customDictModal.classList.add('hidden');
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
      // 重置表单
      resetFileUpload();
      document.querySelector('#custom-dict-modal h3').textContent = '添加自定义内容';
      submitWordBtn.innerHTML = '<i class="fa fa-plus mr-2"></i> 添加内容';
    }

    // 初始化音频
    function initAudio() {
      try {
        // 创建音频上下文
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建音效音量控制节点
        effectGainNode = audioContext.createGain();
        effectGainNode.connect(audioContext.destination);
        setEffectVolume(effectVolume);
        
        // 预加载音效
        loadSounds();
      } catch (e) {
        console.warn('Web Audio API不受支持:', e);
      }
    }

    // 设置朗读音量
    function setSpeechVolume(level) {
      speechVolume = Math.max(0, Math.min(150, level));
      speechVolumeSlider.value = speechVolume;
      speechVolumeValue.textContent = `${speechVolume}%`;
      
      // 更新音量图标
      updateAudioIcon();
      
      saveAudioSettings();
    }

    // 设置音效音量
    function setEffectVolume(level) {
      effectVolume = Math.max(0, Math.min(100, level));
      if (effectGainNode) {
        // 音频API使用0-1范围，使用平方曲线使音量变化更自然
        const gainValue = Math.pow(effectVolume / 100, 2);
        effectGainNode.gain.value = gainValue;
      }
      
      effectVolumeSlider.value = effectVolume;
      effectVolumeValue.textContent = `${effectVolume}%`;
      
      // 更新音量图标
      updateAudioIcon();
      
      saveAudioSettings();
    }

    // 更新音频控制图标
    function updateAudioIcon() {
      const icon = audioControlBtn.querySelector('i');
      
      if (!speechEnabled && !soundEffectsEnabled) {
        icon.className = 'fa fa-volume-off text-gray-400 transition-all duration-300';
      } else if (speechVolume === 0 && effectVolume === 0) {
        icon.className = 'fa fa-volume-off text-gray-400 transition-all duration-300';
      } else if (speechVolume < 50 && effectVolume < 50) {
        icon.className = 'fa fa-volume-down text-gray-600 transition-all duration-300';
      } else {
        icon.className = 'fa fa-volume-up text-primary transition-all duration-300';
      }
    }

    // 加载音效
    function loadSounds() {
      // 创建按键音效（简单的正弦波音调）
      keyPressBuffer = createTone(audioContext, 440, 0.05); // 440Hz, 50ms
      
      // 创建正确答案音效
      correctBuffer = createTone(audioContext, 880, 0.2); // 880Hz, 200ms
      
      // 创建错误答案音效
      errorBuffer = createTone(audioContext, 220, 0.2); // 220Hz, 200ms
    }

    // 创建简单的音调
    function createTone(context, frequency, duration) {
      const oscillator = context.createOscillator();
      const sourceGain = context.createGain();
      
      oscillator.connect(sourceGain);
      sourceGain.connect(effectGainNode); // 通过音效音量控制节点输出
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // 设置音量包络
      sourceGain.gain.setValueAtTime(0, context.currentTime);
      sourceGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
      sourceGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
      
      // 创建音频缓冲区
      const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        const t = i / context.sampleRate;
        const amplitude = Math.exp(-t * 10); // 指数衰减
        data[i] = Math.sin(2 * Math.PI * frequency * t) * amplitude * 0.3;
      }
      
      return buffer;
    }

    // 播放音效
    function playSound(buffer) {
      if (!soundEffectsEnabled || !audioContext || !buffer) return;
      
      try {
        // 恢复暂停的音频上下文（用户交互后）
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(effectGainNode); // 通过音效音量控制节点输出
        source.start();
      } catch (e) {
        console.warn('播放音效失败:', e);
      }
    }

    // 播放按键音效
    function playKeyPressSound() {
      playSound(keyPressBuffer);
    }

    // 播放正确答案音效
    function playCorrectSound() {
      playSound(correctBuffer);
    }

    // 播放错误答案音效
    function playErrorSound() {
      playSound(errorBuffer);
    }

    // 生成字符下划线（支持句子中的空格）
    function generateLetterUnderscores() {
      letterUnderscores.innerHTML = '';
      
      for (let i = 0; i < currentWord.length; i++) {
        const char = currentWord[i];
        const underline = document.createElement('div');
        
        // 空格处理：使用一个更窄的下划线，并添加特殊类名以便定位
        if (char === ' ') {
          underline.className = 'space-underline w-4 h-12 md:w-6 md:h-14 flex items-center justify-center mx-1';
          underline.innerHTML = '<div class="w-2 h-1 bg-gray-400 rounded-full"></div>';
        } else {
          underline.className = 'letter-underline';
          
          if (i < userInput.length) {
            underline.textContent = userInput[i];
            underline.classList.add('letter-underline-filled');
          }
        }
        
        // 为每个下划线添加索引，用于定位错误字母
        underline.dataset.index = i;
        
        letterUnderscores.appendChild(underline);
      }
    }

    // 显示错误字母
    function showErrorLetter(char, position) {
      // 创建错误字母元素
      const errorLetter = document.createElement('div');
      errorLetter.className = 'error-letter';
      errorLetter.textContent = char;
      
      // 获取对应位置的下划线元素
      const underline = letterUnderscores.querySelector(`[data-index="${position}"]`);
      
      if (underline) {
        // 获取下划线位置
        const rect = underline.getBoundingClientRect();
        const containerRect = letterUnderscoresContainer.getBoundingClientRect();
        
        // 设置错误字母位置（在对应下划线正上方）
        errorLetter.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        errorLetter.style.top = `${rect.top - containerRect.top - 20}px`;
        errorLetter.style.transform = 'translateX(-50%)';
        
        // 添加到容器
        letterUnderscoresContainer.appendChild(errorLetter);
        
        // 0.5秒后移除
        setTimeout(() => {
          letterUnderscoresContainer.removeChild(errorLetter);
        }, 500);
      }
    }
    
    // 显示部分提示：当前字母及左右最近空格间的内容（1秒显示时间）
    function showPartialHint(position) {
      // 移除任何已存在的提示
      const existingHints = document.querySelectorAll('.partial-hint');
      existingHints.forEach(hint => hint.remove());
      
      // 查找左边最近的空格
      let leftSpaceIndex = -1;
      for (let i = position - 1; i >= 0; i--) {
        if (currentWord[i] === ' ') {
          leftSpaceIndex = i;
          break;
        }
      }
      
      // 查找右边最近的空格
      let rightSpaceIndex = currentWord.length;
      for (let i = position + 1; i < currentWord.length; i++) {
        if (currentWord[i] === ' ') {
          rightSpaceIndex = i;
          break;
        }
      }
      
      // 提取从左空格后一个字符到右空格前一个字符的内容
      const startIndex = leftSpaceIndex + 1;
      const endIndex = rightSpaceIndex;
      const hintText = currentWord.substring(startIndex, endIndex);
      
      // 创建部分提示元素
      const partialHint = document.createElement('div');
      partialHint.className = 'partial-hint';
      partialHint.textContent = hintText;
      
      // 获取对应位置的下划线元素
      const underline = letterUnderscores.querySelector(`[data-index="${position}"]`);
      
      if (underline) {
        // 获取下划线位置
        const rect = underline.getBoundingClientRect();
        const containerRect = letterUnderscoresContainer.getBoundingClientRect();
        
        // 设置提示位置（在对应下划线正上方）
        partialHint.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        partialHint.style.top = `${rect.top - containerRect.top - 40}px`;
        partialHint.style.transform = 'translateX(-50%)';
        
        // 添加到容器
        letterUnderscoresContainer.appendChild(partialHint);
        
        // 1秒后移除
        setTimeout(() => {
          if (partialHint.parentNode) {
            letterUnderscoresContainer.removeChild(partialHint);
          }
        }, 1000);
      }
    }

    // 生成虚拟键盘（增加空格键和数字、特殊符号支持）
    function generateKeyboard() {
      // 键盘布局 - QWERTY，增加空格键、数字和特殊符号
      const keyboardLayout = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '.'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ' ', '!', '?']
      ];
      
      keyboard.innerHTML = '';
      
      keyboardLayout.forEach(row => {
        row.forEach(char => {
          if (char) {
            const key = document.createElement('div');
            // 空格键更宽
            if (char === ' ') {
              key.className = 'keyboard-key col-span-2';
              key.innerHTML = '<i class="fa fa-space-shuttle"></i>';
            } else {
              key.className = 'keyboard-key';
              key.textContent = char;
            }
            key.dataset.char = char;
            
            key.addEventListener('click', () => {
              handleKeyPress(char);
            });
            
            keyboard.appendChild(key);
          } else {
            // 空白区域
            const empty = document.createElement('div');
            keyboard.appendChild(empty);
          }
        });
      });
    }

    // 解析句子中的单词（按空格分割）
    function getWordsFromSentence(sentence) {
      return sentence.split(/\s+/).filter(word => word.length > 0);
    }
    
    // 查找当前正在输入的单词范围
    function getCurrentWordRange(inputLength) {
      let startIndex = 0;
      let endIndex = 0;
      
      // 查找当前输入位置所在的单词
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === ' ') {
          if (inputLength <= i) {
            endIndex = i;
            break;
          }
          startIndex = i + 1;
        }
        // 如果是最后一个单词
        if (i === currentWord.length - 1) {
          endIndex = currentWord.length;
        }
      }
      
      return { start: startIndex, end: endIndex };
    }

    // 设置当前内容，更新音标和翻译显示
    function setCurrentWord(index) {
      // 切换内容时停止任何正在播放的语音
      speechSynthesis.cancel();
      
      const filteredWords = getFilteredWords();
      
      // 处理数组为空的情况
      if (filteredWords.length === 0) {
        currentWordIndex = 0;
        currentWord = '';
        userInput = '';
        // 重置连续错误计数
        consecutiveErrors = {};
        updateEmptyState();
        return;
      }
      
      // 确保索引在有效范围内
      if (index < 0) index = 0;
      if (index >= filteredWords.length) index = filteredWords.length - 1;
      
      currentWordIndex = index;
      currentWord = filteredWords[currentWordIndex].word;
      userInput = '';
      // 重置连续错误计数
      consecutiveErrors = {};
      
      // 更新中文翻译显示
      const translation = filteredWords[currentWordIndex].translation || '';
      translationText.textContent = translation;
      
      // 更新音标显示
      const phonetic = filteredWords[currentWordIndex].phonetic || '';
      phoneticText.textContent = phonetic;
      
      // 控制翻译区域显示/隐藏和动画
      if (translation && translationVisible) {
        translationDisplay.style.opacity = '0';
        setTimeout(() => {
          translationDisplay.style.opacity = '1';
        }, 100);
      } else {
        translationDisplay.style.opacity = '0';
      }
      
      // 控制音标区域显示/隐藏和动画
      if (phonetic && phoneticVisible) {
        phoneticDisplay.style.opacity = '0';
        setTimeout(() => {
          phoneticDisplay.style.opacity = '1';
        }, 100);
      } else {
        phoneticDisplay.style.opacity = '0';
      }
      
      // 更新图片显示
      if (filteredWords[currentWordIndex].imageUrl) {
        wordImage.src = filteredWords[currentWordIndex].imageUrl;
        wordImage.classList.remove('hidden');
        defaultWordIcon.classList.add('hidden');
      } else {
        wordImage.src = '';
        wordImage.classList.add('hidden');
        defaultWordIcon.classList.remove('hidden');
      }
      
      // 更新UI
      generateLetterUnderscores();
      letterCount.textContent = `${currentWord.length}个字符`;
      
      // 更新进度
      progressText.textContent = `${currentWordIndex + 1}/${filteredWords.length}`;
      progressBar.style.width = `${((currentWordIndex + 1) / filteredWords.length) * 100}%`;
      
      // 隐藏错误信息
      errorMessage.classList.add('hidden');
      
      // 确保在所有UI更新完成后播放发音
      setTimeout(() => {
        // 如果有自定义发音，优先使用自定义发音
        if (filteredWords[currentWordIndex].pronunciation && speechEnabled) {
          speakWord(filteredWords[currentWordIndex].pronunciation);
        } 
        // 否则使用单词本身发音
        else if (speechEnabled) {
          speakWord(currentWord);
        }
      }, 100);
      
      // 更新导航按钮状态
      prevWordBtn.disabled = currentWordIndex === 0;
      nextWordBtn.disabled = currentWordIndex === filteredWords.length - 1;
    }

    // 切换级别标签 - 增加了L2、L3、L4的处理
    function switchLevelTab(level) {
      activeLevel = level;
      
      // 更新标签样式
      allLevelsTab.classList.remove('level-tab-active');
      level1Tab.classList.remove('level1-tab-active');
      level2Tab.classList.remove('level2-tab-active');
      level3Tab.classList.remove('level3-tab-active');
      level4Tab.classList.remove('level4-tab-active');
      
      // 更新进度条颜色
      progressBar.classList.remove('bg-primary', 'bg-level1', 'bg-level2', 'bg-level3', 'bg-level4');
      
      if (level === 'all') {
        allLevelsTab.classList.add('level-tab-active');
        progressBar.classList.add('bg-primary');
      } else if (level === 'L1') {
        level1Tab.classList.add('level1-tab-active');
        progressBar.classList.add('bg-level1');
      } else if (level === 'L2') {
        level2Tab.classList.add('level2-tab-active');
        progressBar.classList.add('bg-level2');
      } else if (level === 'L3') {
        level3Tab.classList.add('level3-tab-active');
        progressBar.classList.add('bg-level3');
      } else if (level === 'L4') {
        level4Tab.classList.add('level4-tab-active');
        progressBar.classList.add('bg-level4');
      }
      
      // 重置当前索引并加载对应级别的内容
      currentWordIndex = 0;
      setCurrentWord(0);
      
      // 播放切换音效
      playKeyPressSound();
    }

    // 禁用键盘
    function disableKeyboard() {
      const keys = keyboard.querySelectorAll('.keyboard-key');
      keys.forEach(key => {
        key.classList.add('opacity-50', 'cursor-not-allowed');
        key.removeEventListener('click', () => {});
      });
    }

    // 启用键盘
    function enableKeyboard() {
      const keys = keyboard.querySelectorAll('.keyboard-key');
      keys.forEach(key => {
        key.classList.remove('opacity-50', 'cursor-not-allowed');
        const char = key.dataset.char;
        key.addEventListener('click', () => {
          handleKeyPress(char);
        });
      });
    }

    // 处理键盘按键（支持所有字符输入）
    function handleKeyPress(char) {
      // 播放按键音效
      playKeyPressSound();
      
      // 如果用户输入长度已达到内容长度，不允许继续输入
      if (userInput.length >= currentWord.length) return;
      
      // 添加按键动画
      const key = keyboard.querySelector(`[data-char="${char}"]`);
      if (key) {
        key.classList.add('key-press');
        setTimeout(() => key.classList.remove('key-press'), 150);
      }
      
      // 严格区分大小写的验证逻辑
      const expectedChar = currentWord[userInput.length];
      
      if (char === expectedChar) {
        // 字符正确，添加到用户输入
        userInput += char;
        
        // 重置该位置的连续错误计数
        consecutiveErrors[userInput.length - 1] = 0;
        
        // 更新字符下划线
        generateLetterUnderscores();
        
        // 隐藏错误信息
        errorMessage.classList.add('hidden');
        
        // 检查是否完成输入
        if (userInput.length === currentWord.length) {
          // 完整内容拼写正确，先停止任何正在播放的语音
          speechSynthesis.cancel();
          
          // 播放成功音效
          playCorrectSound();
          
          // 添加成功动画
          const underscores = letterUnderscores.querySelectorAll('.letter-underline, .space-underline');
          underscores.forEach(underscore => {
            underscore.classList.add('bounce');
          });
          
          // 禁用键盘
          disableKeyboard();
          
          // 2秒后自动进入下一个内容
          setTimeout(() => {
            const filteredWords = getFilteredWords();
            // 如果是最后一个单词，循环到第一个
            const nextIndex = currentWordIndex === filteredWords.length - 1 ? 0 : currentWordIndex + 1;
            setCurrentWord(nextIndex);
            enableKeyboard();
          }, 2000);
        } else {
          // 检查当前是否开始输入空格右侧的新单词
          // 情况1: 当前输入的是空格，说明即将开始新单词
          // 情况2: 下一个字符是空格，说明当前已完成一个单词
          // 情况3: 刚输入的是空格后的第一个字符，说明开始了新单词
          if (char === ' ' || currentWord[userInput.length] === ' ' || 
              (userInput.length > 0 && userInput[userInput.length - 1] === ' ')) {
            
            // 立即停止当前正在播放的音频
            speechSynthesis.cancel();
            
            // 获取当前单词范围
            const wordRange = getCurrentWordRange(userInput.length);
            // 提取当前单词
            const currentWordPart = currentWord.substring(wordRange.start, wordRange.end);
            
            // 播放当前单词
            if (speechEnabled) {
              speakWord(currentWordPart);
            }
          }
        }
      } else {
        // 字符错误，播放错误音效
        playErrorSound();
        
        // 更新连续错误计数
        const currentPosition = userInput.length;
        consecutiveErrors[currentPosition] = (consecutiveErrors[currentPosition] || 0) + 1;
        
        // 显示错误字母，在对应位置的正上方显示0.5秒
        showErrorLetter(char, currentPosition);
        
        // 当错误超过5次时，显示当前字母及左右最近空格间的内容（1秒）
        if (consecutiveErrors[currentPosition] >= 5) {
          showPartialHint(currentPosition);
          // 重置计数，避免重复显示
          consecutiveErrors[currentPosition] = 0;
        }
        
        // 显示错误信息
        errorMessage.classList.remove('hidden');
        
        // 特殊处理：如果是空格位置输入错误，不清空前面内容
        if (expectedChar !== ' ') {
          // 只清除当前正在输入的单词部分，保留已完成的单词
          if (userInput.length > 0) {
            // 找到最后一个空格的位置
            const lastSpaceIndex = userInput.lastIndexOf(' ');
            
            if (lastSpaceIndex > -1) {
              // 如果有空格，保留到最后一个空格（包含空格）
              userInput = userInput.substring(0, lastSpaceIndex + 1);
            } else {
              // 如果没有空格，清除所有输入
              userInput = '';
            }
          }
        }
        // 空格位置输入错误时，不清除前面内容
        
        // 更新下划线显示
        generateLetterUnderscores();
        
        // 输入错误时自动再次播放音频
        setTimeout(() => {
          if (speechEnabled) {
            const filteredWords = getFilteredWords();
            // 优先使用自定义发音，否则使用单词本身
            if (filteredWords[currentWordIndex].pronunciation) {
              speakWord(filteredWords[currentWordIndex].pronunciation);
            } else {
              // 只朗读当前需要输入的部分
              const currentPart = currentWord.substring(userInput.length);
              speakWord(currentPart);
            }
          }
        }, 500); // 延迟500ms播放，让错误音效先播放完毕
      }
    }
    
    // 检查答案
    function checkAnswer() {
      // 已在handleKeyPress中处理
    }

    // 添加事件监听器 - 增加了L2、L3、L4的点击事件
    function addEventListeners() {
      // 初始化文件上传事件
      initFileUploadEvents();
      
      // 级别标签点击事件
      allLevelsTab.addEventListener('click', () => {
        switchLevelTab('all');
      });
      
      level1Tab.addEventListener('click', () => {
        if (!level1Tab.hasAttribute('disabled')) {
          switchLevelTab('L1');
        }
      });
      
      level2Tab.addEventListener('click', () => {
        if (!level2Tab.hasAttribute('disabled')) {
          switchLevelTab('L2');
        }
      });
      
      level3Tab.addEventListener('click', () => {
        if (!level3Tab.hasAttribute('disabled')) {
          switchLevelTab('L3');
        }
      });
      
      level4Tab.addEventListener('click', () => {
        if (!level4Tab.hasAttribute('disabled')) {
          switchLevelTab('L4');
        }
      });
      
      // 播放发音按钮
      playSoundBtn.addEventListener('click', () => speakWord(currentWord));
      
      // 中文翻译显示开关
      translationToggle.addEventListener('click', () => {
        translationVisible = !translationVisible;
        const icon = translationToggle.querySelector('i');
        
        if (translationVisible) {
          icon.className = 'fa fa-language text-primary transition-all duration-300';
          const filteredWords = getFilteredWords();
          if (filteredWords.length > 0 && filteredWords[currentWordIndex].translation) {
            translationDisplay.style.opacity = '1';
          }
        } else {
          icon.className = 'fa fa-language text-gray-400 transition-all duration-300';
          translationDisplay.style.opacity = '0';
        }
        
        saveAudioSettings();
        playKeyPressSound();
      });
      
      // 音标显示开关
      phoneticToggle.addEventListener('click', () => {
        phoneticVisible = !phoneticVisible;
        const icon = phoneticToggle.querySelector('i');
        
        if (phoneticVisible) {
          icon.className = 'fa fa-volume-up text-primary transition-all duration-300';
          const filteredWords = getFilteredWords();
          if (filteredWords.length > 0 && filteredWords[currentWordIndex].phonetic) {
            phoneticDisplay.style.opacity = '1';
          }
        } else {
          icon.className = 'fa fa-volume-off text-gray-400 transition-all duration-300';
          phoneticDisplay.style.opacity = '0';
        }
        
        saveAudioSettings();
        playKeyPressSound();
      });
      
      // 音频控制按钮点击事件
      audioControlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audioControlPanel.classList.toggle('active');
        playKeyPressSound();
      });
      
      // 点击页面其他地方关闭音频控制面板
      document.addEventListener('click', (e) => {
        if (!audioControlBtn.contains(e.target) && !audioControlPanel.contains(e.target)) {
          audioControlPanel.classList.remove('active');
        }
      });
      
      // 朗读音量控制
      speechVolumeSlider.addEventListener('input', (e) => {
        setSpeechVolume(parseInt(e.target.value));
      });
      
      // 音效音量控制
      effectVolumeSlider.addEventListener('input', (e) => {
        setEffectVolume(parseInt(e.target.value));
      });
      
      // 朗读开关
      enableSpeechCheckbox.addEventListener('change', (e) => {
        speechEnabled = e.target.checked;
        updateAudioIcon();
        saveAudioSettings();
        playKeyPressSound();
      });
      
      // 音效开关
      enableSoundEffectsCheckbox.addEventListener('change', (e) => {
        soundEffectsEnabled = e.target.checked;
        updateAudioIcon();
        saveAudioSettings();
        if (soundEffectsEnabled) {
          playKeyPressSound();
        }
      });
      
      // 上一个内容
      prevWordBtn.addEventListener('click', () => {
        setCurrentWord(currentWordIndex - 1);
        playKeyPressSound();
      });
      
      // 下一个内容
      nextWordBtn.addEventListener('click', () => {
        setCurrentWord(currentWordIndex + 1);
        playKeyPressSound();
      });
      
      // 自定义内容按钮
      customDictBtn.addEventListener('click', () => {
        openModal();
        playKeyPressSound();
      });
      
      // 关闭模态框
      closeModalBtn.addEventListener('click', () => {
        closeModal();
        playKeyPressSound();
      });
      
      // 点击模态框背景关闭
      customDictModal.addEventListener('click', (e) => {
        if (e.target === customDictModal) {
          closeModal();
          playKeyPressSound();
        }
      });
      
      // 搜索内容
      wordSearch.addEventListener('input', () => {
        updateCustomWordsList();
      });
      
      // 显示通知函数
      function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out translate-y-[-100px] opacity-0 z-5000`;
        
        if (type === 'success') {
          notification.classList.add('bg-green-50', 'text-green-800', 'border-l-4', 'border-green-400');
        } else if (type === 'error') {
          notification.classList.add('bg-red-50', 'text-red-800', 'border-l-4', 'border-red-400');
        } else {
          notification.classList.add('bg-blue-50', 'text-blue-800', 'border-l-4', 'border-blue-400');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.remove('translate-y-[-100px]', 'opacity-0');
          notification.classList.add('translate-y-0', 'opacity-100');
        }, 10);
        
        setTimeout(() => {
          notification.classList.remove('translate-y-0', 'opacity-100');
          notification.classList.add('translate-y-[-100px]', 'opacity-0');
          
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 500);
        }, 3000);
      }
      
      // 管理内容按钮
      manageWordsBtn.addEventListener('click', () => {
        // 关闭添加内容模态框
        customDictModal.classList.add('hidden');
        // 打开管理内容模态框
        manageWordsModal.classList.remove('hidden');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
        // 更新内容列表
        updateCustomWordsList();
        // 播放按键音效
        playKeyPressSound();
      });
      
      // 关闭管理内容模态框
      closeManageModalBtn.addEventListener('click', () => {
        manageWordsModal.classList.add('hidden');
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
        // 播放按键音效
        playKeyPressSound();
      });
      
      // 点击管理内容模态框背景关闭
      manageWordsModal.addEventListener('click', (e) => {
        if (e.target === manageWordsModal) {
          manageWordsModal.classList.add('hidden');
          document.body.style.overflow = 'auto';
          playKeyPressSound();
        }
      });
      
      // 批量删除按钮
      batchDeleteBtn.addEventListener('click', () => {
        if (selectedWordIds.size > 0) {
          // 获取当前激活级别中的内容总数
          const activeLevelWords = activeLevel === 'all' ? getFilteredWords() : words[activeLevel];
          const activeLevelWordIds = new Set(activeLevelWords.map(word => word.id));
          
          // 计算选中的内容中有多少属于当前激活级别
          let selectedActiveCount = 0;
          selectedWordIds.forEach(id => {
            if (activeLevelWordIds.has(id)) {
              selectedActiveCount++;
            }
          });
          
          // 如果当前激活级别只剩下选中的这些内容，阻止删除
          if (activeLevelWordIds.size > 0 && selectedActiveCount === activeLevelWordIds.size) {
            showNotification('当前章节至少需要保留1个内容', 'error');
            return;
          }
          
          showDeleteConfirmDialog(Array.from(selectedWordIds), true);
        }
      });
      
      // 取消删除按钮
      cancelDeleteBtn.addEventListener('click', closeDeleteConfirmDialog);
      
      // 确认删除按钮
      confirmDeleteBtn.addEventListener('click', performDelete);
      
      // 表单提交处理
      customWordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (uploadedWords.length === 0) {
          fileError.textContent = '请先上传并解析文件';
          fileError.classList.remove('hidden');
          return;
        }
        
        // 获取选中的级别
        const selectedLevel = document.querySelector('input[name="word-level"]:checked').value;
        
        // 生成新内容并添加到对应级别的单词库
        const newWords = uploadedWords.map(item => ({
          id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          word: item.word,
          phonetic: item.phonetic,
          translation: item.translation,
          imageUrl: '',
          level: selectedLevel // 添加级别属性
        }));
        
        words[selectedLevel].push(...newWords);
        
        // 保存并关闭模态框
        saveCustomWords();
        closeModal();
        
        // 显示成功通知
        showNotification(`成功添加 ${newWords.length} 个内容到 ${selectedLevel} 级别`, 'success');
        
        // 如果当前激活的是该级别且是首次添加内容，自动加载第一个
        const filteredWords = getFilteredWords();
        if (newWords.length > 0 && filteredWords.length === newWords.length) {
          setCurrentWord(0);
        }
      });
      
      // ESC键关闭模态框
      document.addEventListener('keydown', (e) => {
        e.stopPropagation();
        
        const filteredWords = getFilteredWords();
        if (filteredWords.length === 0) return;
        
        // 允许所有可打印字符（包括数字和特殊符号）
        if (e.key.length === 1 && e.key !== ' ') {
          // 直接使用原始输入，严格区分大小写
          handleKeyPress(e.key);
        } else if (e.key === ' ') {
          // 处理空格键
          handleKeyPress(' ');
        } else if (e.key === 'Backspace') {
          // 处理退格键
          if (userInput.length > 0) {
            playKeyPressSound();
            userInput = userInput.slice(0, -1);
            generateLetterUnderscores();
            errorMessage.classList.add('hidden');
          }
        } else if (e.key === 'ArrowLeft') {
          // 左箭头切换到上一个单词
          playKeyPressSound();
          setCurrentWord(currentWordIndex - 1);
        } else if (e.key === 'ArrowRight') {
          // 右箭头切换到下一个单词
          playKeyPressSound();
          setCurrentWord(currentWordIndex + 1);
        } else if (e.key === 'Enter') {
          // 回车键播放单词发音
          speakWord(currentWord);
        }
      });
      
      // 确保body能够接收焦点
      document.body.setAttribute('tabindex', '-1');
      document.body.focus();
      
      // 当页面点击时，重新聚焦到body以确保键盘事件能被捕获
      document.addEventListener('click', () => {
        document.body.focus({ preventScroll: true });
      });
      
      // 窗口滚动时调整头部样式
      window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 10) {
          header.classList.add('py-2');
          header.classList.remove('py-3');
        } else {
          header.classList.add('py-3');
          header.classList.remove('py-2');
        }
      });
    }

    // 确保用户交互后才能播放音频
    document.addEventListener('click', function initAudioOnInteraction() {
      if (!audioContext) {
        initAudio();
      } else if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      document.removeEventListener('click', initAudioOnInteraction);
    }, { once: true });

    // 保存音频设置
    function saveAudioSettings() {
      localStorage.setItem('speechEnabled', speechEnabled);
      localStorage.setItem('soundEffectsEnabled', soundEffectsEnabled);
      localStorage.setItem('speechVolume', speechVolume);
      localStorage.setItem('effectVolume', effectVolume);
      localStorage.setItem('phoneticVisible', phoneticVisible);
      localStorage.setItem('translationVisible', translationVisible);
    }

    // 初始化应用
    function initApp() {
      // 从本地存储加载音频设置
      const savedSpeechEnabled = localStorage.getItem('speechEnabled');
      if (savedSpeechEnabled !== null) {
        speechEnabled = savedSpeechEnabled === 'true';
        enableSpeechCheckbox.checked = speechEnabled;
      }
      
      const savedSoundEffects = localStorage.getItem('soundEffectsEnabled');
      if (savedSoundEffects !== null) {
        soundEffectsEnabled = savedSoundEffects === 'true';
        enableSoundEffectsCheckbox.checked = soundEffectsEnabled;
      }
      
      const savedSpeechVolume = localStorage.getItem('speechVolume');
      if (savedSpeechVolume !== null) {
        speechVolume = parseInt(savedSpeechVolume);
      } else {
        speechVolume = 120; // 默认朗读音量设置为120
      }
      speechVolumeSlider.value = speechVolume;
      speechVolumeValue.textContent = `${speechVolume}%`;
      
      const savedEffectVolume = localStorage.getItem('effectVolume');
      if (savedEffectVolume !== null) {
        effectVolume = parseInt(savedEffectVolume);
      } else {
        effectVolume = 80;
      }
      effectVolumeSlider.value = effectVolume;
      effectVolumeValue.textContent = `${effectVolume}%`;
      
      // 加载音标显示状态
      const savedPhoneticVisible = localStorage.getItem('phoneticVisible');
      if (savedPhoneticVisible !== null) {
        phoneticVisible = savedPhoneticVisible === 'true';
      } else {
        phoneticVisible = true; // 默认显示音标
      }
      
      // 加载翻译显示状态
      const savedTranslationVisible = localStorage.getItem('translationVisible');
      if (savedTranslationVisible !== null) {
        translationVisible = savedTranslationVisible === 'true';
      } else {
        translationVisible = true; // 默认显示翻译
      }
      
      // 更新音标图标
      const phoneticIcon = phoneticToggle.querySelector('i');
      if (phoneticVisible) {
        phoneticIcon.className = 'fa fa-volume-up text-primary transition-all duration-300';
      } else {
        phoneticIcon.className = 'fa fa-volume-off text-gray-400 transition-all duration-300';
      }
      
      // 更新翻译图标
      const translationIcon = translationToggle.querySelector('i');
      if (translationVisible) {
        translationIcon.className = 'fa fa-language text-primary transition-all duration-300';
      } else {
        translationIcon.className = 'fa fa-language text-gray-400 transition-all duration-300';
      }
      
      // 更新音频图标
      updateAudioIcon();
      
      initAudio();
      loadCustomWords();
      generateKeyboard();
      addEventListeners();
      
      updateLevelTabStates(); // 初始化级别标签状态
      updateEmptyState();
      
      const filteredWords = getFilteredWords();
      if (filteredWords.length > 0) {
        setCurrentWord(0);
      }
    }

    // 初始化应用
    document.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
