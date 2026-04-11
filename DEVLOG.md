# 便利店夜班的奇妙客人 - 开发日志

## 项目信息

**项目路径**: `/Users/mahaoxuan/pixel-novel-game`
**游戏标题**: 便利店夜班的奇妙客人
**类型**: 治愈/奇幻/轻喜剧 视觉小说
**时长**: 15-20分钟

---

## 开发记录

### 2026-03-19

#### 视觉效果增强

完成了视觉小说引擎的视觉效果增强，添加了以下功能：

**新增文件**:
- `src/renderer/components/CharacterSprite.tsx` - 角色立绘组件，支持 CSS 动画
- `src/renderer/components/CharacterLayer.tsx` - 管理多个角色显示
- `src/renderer/assets/scripts/convenience_store.json` - 完整剧本

**修改文件**:
- `src/renderer/engine/types.ts` - 添加 CharacterAnimation, CharacterSpriteConfig, CharacterDisplay, BackgroundTransition 类型
- `src/renderer/components/DialogueBox.tsx` - 添滑入+淡入动画，CLICK TO CONTINUE 闪烁
- `src/renderer/components/SceneRenderer.tsx` - 支持双 Canvas 背景过渡
- `src/renderer/components/index.ts` - 导出新组件
- `src/renderer/engine/NovelEngine.ts` - 扩展 EngineData
- `src/renderer/engine/ScriptParser.ts` - 验证新字段
- `src/renderer/App.tsx` - 集成角色层
- `src/renderer/assets/scripts/demo.json` - 演示新格式

**动画效果**:
- 角色入场: fadeIn, slideInLeft, slideInRight, slideInCenter
- 角色退场: fadeOut, slideOutLeft, slideOutRight
- 对话框: slideUpFadeIn (0.3s)
- CLICK TO CONTINUE: 闪烁 (0.5s 间隔)
- 背景过渡: fade (默认 500ms)

#### 剧本内容

完成了《便利店夜班的奇妙客人》完整剧本：

**角色**:
- 主角 (player) - 大一新生，便利店夜班兼职
- 银樱 (silver_girl) - 梦的收集者，银发紫瞳少女
- 狐狸先生 (fox) - 月下信使，穿小西装的狐狸
- 小萝 (radish) - 暖冬精灵，住在关东煮锅里
- 店长 - 普通人类

**剧情分支**:
1. 整理货架 → 遇见银樱 → 许愿 → 不同结局
2. 继续摸鱼玩手机 → 遇见狐狸先生 → 对话选择
3. 检查关东煮 → 遇见小萝 → 温馨对话

**场景**:
- convenience_store_night.png - 深夜便利店
- shelf_area.png - 零食货架区
- window_night.png - 窗边夜景
- counter.png - 收银台
- oden_station.png - 关东煮站
- store_entrance.png - 便利店入口
- dawn.png - 黎明
- black.png - 黑屏（字幕）

---

### 2026-04-06

#### 🎬 意图导演系统 (Intent Director System) 

为了打破视觉小说传统的静态感，引入了基于“叙事意图”的动态镜头系统。该系统允许开发者通过描述故事氛围（Intent）来自动驱动镜头的缩放、平移和震动。

**新增文件**:
- `src/renderer/components/CameraWrapper.tsx` - 核心摄影机组件，负责处理所有镜头变换（Zoom, Pan, Shake）。

**技术更新**:
- **`src/renderer/engine/types.ts`**: 新增 `CinematicIntent` 和 `CameraState` 类型，增强 `Dialogue` 接口支持 `intent`。
- **`src/renderer/engine/NovelEngine.ts`**: 实现了 `calculateCameraState` 逻辑：支持意图映射和**动态追踪 (Character Focus)**，镜头自动跟随发言角色。
- **`src/renderer/App.tsx`**: 集成 `CameraWrapper`，实现游戏世界与 HUD UI 的渲染解耦。
- **剧本增强**: 在 `convenience_store.json` 中注入了 `melancholy` (忧郁), `intrigue` (探寻), `shock` (惊吓) 等意图。

**核心特性**:
- **自动化聚焦**: 镜头平滑跟随对话角色位置。
- **叙事共鸣**: 动画由故事意图驱动，非模板化动作。
- **性能优化**: 纯 CSS Transform 实现，流畅无卡顿。

---

## 运行方式

```bash
cd /Users/mahaoxuan/pixel-novel-game
npm run dev:renderer    # 仅前端 (http://localhost:5173)
npm run dev             # 前后端同时运行
```

---

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **后端**: Electron
- **游戏引擎**: 自研 Visual Novel Engine
- **像素字体**: Press Start 2P

---

## 待办事项

- [x] 添加角色立绘图片资源
- [x] 添加背景图片资源
- [x] 添加背景音乐和音效
- [ ] 添加更多表情变化
- [x] 实现角色退场动画
- [x] 添加存档/读档缩略图反馈机制功能
