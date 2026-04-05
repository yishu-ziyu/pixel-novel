# Pixel Novel - 文本驱动解谜游戏

将悬疑小说/文本自动转化为像素风视觉小说解谜游戏的引擎。

## 项目概述

- **引擎**: LÖVE2D (Lua)
- **AI解析**: Python + Claude API
- **风格**: 视觉小说 + 混合谜题（逻辑+叙事推理）
- **规模**: 短篇故事（30分钟体验）

## 项目结构

```
pixel-novel-game/
├── main.lua                 # 程序入口
├── conf.lua                 # LÖVE配置
├── lib/                     # 第三方库
│   ├── hump/               # 状态管理、向量
│   ├── anim8.lua           # 动画
│   └── json.lua            # JSON解析
├── src/
│   ├── core/               # 核心系统
│   │   ├── SceneManager.lua
│   │   ├── EventBus.lua
│   │   └── SaveSystem.lua
│   ├── systems/            # 游戏系统
│   │   ├── DialogueSystem.lua
│   │   ├── PuzzleManager.lua
│   │   ├── InventorySystem.lua
│   │   └── DeductionBoard.lua
│   ├── ui/                 # UI组件
│   │   ├── TextBox.lua
│   │   ├── ChoiceMenu.lua
│   │   ├── PixelCanvas.lua
│   │   └── Button.lua
│   ├── scenes/             # 场景
│   │   ├── main_menu.lua
│   │   ├── game.lua
│   │   └── settings.lua
│   └── utils/              # 工具函数
│       ├── ColorPalette.lua
│       ├── PixelFilter.lua
│       └── TextUtils.lua
├── assets/                  # 资源文件
│   ├── fonts/
│   ├── sprites/
│   ├── music/
│   └── sfx/
└── parser/                  # Python文本解析器
    ├── main.py
    ├── config.py
    └── analyzers/
```

## 快速开始

### 1. 安装 LÖVE2D

下载并安装 [LÖVE2D 11.4](https://love2d.org/)

### 2. 运行游戏

```bash
# 在项目目录下
love .

# 或者拖拽项目文件夹到 love.exe
```

### 3. 操作说明

| 按键 | 功能 |
|------|------|
| Space/Enter/Z | 推进对话/确认 |
| Up/Down | 选择选项 |
| ESC | 打开菜单 |
| F11 | 全屏切换 |
| Ctrl+S | 快速保存 |
| Ctrl+L | 快速加载 |
| F3 | 显示调试信息 |

## 核心系统说明

### 场景管理器 (SceneManager)
- 管理游戏场景的切换
- 支持过渡效果 (淡入淡出、滑动、像素化)
- 场景堆栈管理

### 对话系统 (DialogueSystem)
- 打字机效果显示文本
- 分支选项系统
- 自动播放和跳过功能
- 角色立绘和表情管理

### 存档系统 (SaveSystem)
- 多槽位存档
- 自动保存和快速保存
- 存档元数据管理
- 跨平台兼容

### 事件总线 (EventBus)
- 发布-订阅模式的组件通信
- 事件优先级管理
- 延迟事件队列

## 开发路线图

### Phase 1: 核心框架 (Week 1) ✅
- [x] LÖVE2D项目搭建
- [x] 场景管理器
- [x] 对话系统（打字机效果）
- [x] 基础UI组件

### Phase 2: 视觉小说系统 (Week 2)
- [ ] 立绘显示系统
- [ ] 背景切换
- [ ] 分支选项
- [ ] 存档系统

### Phase 3: 谜题系统 (Week 3)
- [ ] 密码锁谜题
- [ ] 线索推理板
- [ ] 物品栏系统
- [ ] 谜题与叙事集成

### Phase 4: 文本解析器 (Week 4)
- [ ] Claude API集成
- [ ] 场景分析器
- [ ] 谜题生成器
- [ ] 游戏数据导出

### Phase 5: 整合与优化 (Week 5)
- [ ] 端到端工作流测试
- [ ] 示例游戏制作
- [ ] 性能优化
- [ ] 文档完善

## 许可证

MIT License

## 致谢

- [LÖVE2D](https://love2d.org/) - 游戏框架
- [hump](https://github.com/vrld/hump) - Lua游戏开发工具集
