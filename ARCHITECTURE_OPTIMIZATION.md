# Pixel Novel Game - 架构优化方案

基于对开源视觉小说引擎的研究，我们可以从以下几个方面优化项目架构和故事深度。

---

## 🔍 参考的开源项目

### 1. **simple-visual-novel** (npm包)
**特点：**
- Class-based Script API - 流畅的类型安全API
- Dialogue System - 每个对话的特效（淡入、打字机）
- Character Management - 动态显示/隐藏角色，场景中间换图
- Scene Navigation - 自动场景进度
- Game State - 标志和计数器的变量管理
- Event System - 监听场景变化和变量更新

**可借鉴点：**
- 更优雅的脚本API设计
- 对话特效系统
- 角色动态管理

---

### 2. **vn-engine** (npm包)
**特点：**
- 📝 YAML-based scripting - 干净、可读的叙事格式
- 🎮 Universal game state - 支持任意数据结构的变量系统
- 🌟 Dual template engine - 完整的 Handlebars 支持
- 🎨 Asset management - 全面的多媒体支持
- 🔀 Choice tracking - 高级分支叙事支持
- 🎯 Event-driven - 响应游戏状态变化
- 🏗️ Framework-agnostic - 可与任何 UI 框架一起使用

**可借鉴点：**
- YAML 脚本格式（比 JSON 更易读易写）
- 变量系统（支持任意数据结构）
- 模板引擎（Handlebars）
- 事件驱动架构

---

### 3. **Pixi'VN** (GitHub)
**特点：**
- Narrative management
- 2D canvas (PixiJS)
- Sound and music playback
- Storage for game variables
- Saves state at each story step
- Save/load system
- Supports Ink 和 Ren'Py 叙事语言

**可借鉴点：**
- PixiJS 渲染引擎（更强大的 2D 渲染）
- 每一步都保存状态（支持回退）
- 支持 Ink 和 Ren'Py 格式

---

### 4. **Ren'Py** (最流行的开源视觉小说引擎)
**特点：**
- Python 语言
- 强大的叙事脚本语言
- 跨平台（Windows, Mac, Linux, Android, iOS）
- 丰富的社区资源和教程
- 支持复杂的分支叙事

**可借鉴点：**
- Ren'Py 的脚本语法设计
- 跨平台支持
- 社区生态系统

---

## 🚀 优化方案

### 方案 1: 增强当前架构（推荐）

在现有架构基础上，添加以下功能：

#### 1.1 变量系统
```typescript
interface GameVariables {
  [key: string]: string | number | boolean | string[] | number[];
}

// 使用示例
engine.setVariable('player_name', '张三');
engine.setVariable('met_silver_girl', true);
engine.setVariable('fox_encounters', 3);

// 条件对话
{
  "condition": "met_silver_girl === true",
  "dialogue": "银樱，你又来了！"
}
```

#### 1.2 对话特效系统
```typescript
interface DialogueEffect {
  type: 'fade' | 'typewriter' | 'shake' | 'color';
  duration?: number;
  color?: string;
}

{
  "text": "突然！",
  "effect": { "type": "shake", "duration": 500 }
}
```

#### 1.3 YAML 脚本支持
```yaml
opening:
  background: convenience_store
  characters:
    - player: bored
  dialogues:
    - speaker: 你
      text: 凌晨一点，24小时便利店...
    - speaker: 你
      text: 该做点什么好呢...
      choices:
        - text: 整理货架
          next: branch_shelf
        - text: 继续摸鱼
          next: branch_phone
```

---

### 方案 2: 集成现有引擎

#### 2.1 使用 vn-engine
```bash
npm install vn-engine
```

优点：
- 完整的变量系统
- YAML 脚本支持
- 模板引擎
- TypeScript 优先

#### 2.2 使用 Pixi'VN
```bash
npm create pixi-vn@latest
```

优点：
- PixiJS 渲染（更强大的 2D）
- 支持 Ink 和 Ren'Py
- 状态保存和回退
- React/Vue 支持

---

## 📖 故事深度优化

### 1. 分支叙事增强
当前只有 3 个主要分支，可增加：
- 更多分支选择点
- 分支后果（蝴蝶效应）
- 隐藏分支（需要特定条件）

### 2. 角色关系系统
```typescript
interface CharacterRelationship {
  characterId: string;
  affinity: number; // 0-100
  flags: string[]; // 触发过的事件
}

// 根据好感度不同的对话
{
  "condition": "silver_girl_affinity >= 50",
  "text": "银樱，你今天真漂亮！"
}
```

### 3. 物品/道具系统
```typescript
interface InventoryItem {
  id: string;
  name: string;
  description: string;
  usable: boolean;
}

// 获得星星糖
engine.giveItem('star_candy', '星星糖', '银樱给的星星糖');

// 使用物品触发剧情
{
  "condition": "has_item('star_candy')",
  "text": "（掏出星星糖）这个...是给你的！"
}
```

---

## 🎨 视觉优化

### 1. 更多像素艺术场景
- 便利店内部（不同区域）
- 街道夜景
- 公园
- 角色的家

### 2. 角色表情动画
- 更多表情状态
- 简单的 idle 动画（呼吸、眨眼）
- 表情过渡动画

### 3. 场景过渡效果
- 淡入淡出
- 滑动
- 溶解
- 像素化

---

## 🎵 音频优化

### 1. 背景音乐
- 便利店主题曲
- 神秘/魔法主题
- 温馨/治愈主题

### 2. 音效
- 角色入场音效
- 对话推进音效
- 选择音效
- 环境音效（雨声、便利店声）

---

## 📋 实施优先级

### 第一阶段（核心功能）
1. ✅ 变量系统
2. ✅ 对话特效
3. ✅ 角色关系系统
4. ✅ 更多像素艺术场景

### 第二阶段（增强功能）
1. 物品/道具系统
2. YAML 脚本支持
3. 更多分支选择
4. CG 收集系统

### 第三阶段（高级功能）
1. 成就系统
2. 场景过渡动画
3. 音频系统完善
4. 跨平台支持

---

## 📚 参考资源

### 开源项目
- [simple-visual-novel](https://www.npmjs.com/package/simple-visual-novel)
- [vn-engine](https://www.npmjs.com/package/vn-engine)
- [Pixi'VN](https://github.com/DRincs-Productions/pixi-vn)
- [Ren'Py](https://www.renpy.org/)

### 学习资源
- [视觉小说设计指南](https://itch.io/games/tag-visual-novel)
- [Twine](https://twinery.org/) - 交互式叙事工具
- [Ink](https://www.inklestudios.com/ink/) - 叙事脚本语言
