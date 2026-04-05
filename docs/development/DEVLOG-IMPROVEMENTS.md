# Pixel Novel 游戏改进开发日志

> 记录时间: 2026-04-06
> 目标: 基于开源VN/GA游戏研究结果，改进游戏可玩性

## 改进任务清单

| ID | 任务 | 优先级 | 状态 | 负责人 |
|----|------|--------|------|--------|
| 1 | 优化打字机效果和快速跳过 | 🔴 高 | 已完成 | - |
| 2 | 实现自动存档系统 | 🔴 高 | 已完成 | - |
| 3 | 增强分支选择UI | 🟡 中 | 已完成 | - |
| 4 | 添加场景过渡效果 | 🟡 中 | 已完成 | - |
| 5 | 增强设置菜单 | 🟡 中 | 已完成 | - | |

## 开发过程记录

### 2026-04-06

#### 上午

**Bug修复提交 (6f89349)**
- 修复背景显示问题：App.tsx 用 scene.id 而非 scene.background
- 修复 EngineData 未导出问题
- 修复 Scene.nextSceneId 缺失
- 修复 SaveManager settings 未初始化
- 扩展 BackgroundTransition 类型

**研究完成**
- GitHub 优秀项目研究：12个项目分析
- 游戏UX设计模式研究：6大类别
- 研究结果保存在 docs/research/

#### 下午

**开始实施改进计划**
- 创建任务清单 (Task #1-5)
- 准备并行执行

---

## 实施日志

### Task #1: 打字机效果优化
**开始时间**: 2026-04-06
**完成时间**: 2026-04-06
**修改文件**:
- `src/renderer/engine/types.ts` - 新增 TextSpeedPreset 类型和 TEXT_SPEED_VALUES
- `src/renderer/engine/NovelEngine.ts` - 新增 skip mode 和 visitedDialogueIds 追踪
- `src/renderer/components/DialogueBox.tsx` - 新增 isAutoPlay/isSkipping 状态显示
- `src/renderer/App.tsx` - 新增 Tab 键跳过模式切换，空格/Enter 跳过打字机效果

**改动内容**:
1. **Typewriter Effect Enhancement**:
   - 添加 textSpeed 速度配置 (0.5=slow, 1=medium, 2=fast, 5=instant)
   - instant 模式(textSpeed>=5)直接显示完整文本
   - 打字机效果基础延迟 50ms，按 textSpeed 缩放

2. **Skip Mode (Tab 键)**:
   - 新增 `isSkipping` 状态追踪
   - 新增 `visitedDialogueIds` Set 追踪已读对话框
   - 对话框 ID 格式: `{sceneId}-{dialogueIndex}`
   - Skip mode 下自动跳过已读对话框，直到遇到未读内容
   - 切换到主菜单时自动关闭 skip mode

3. **Auto-play Enhancement**:
   - 用户交互时自动停止 auto-play (点击、空格、Enter)
   - 可配置的 autoPlayInterval (1000/2000/3000ms)

4. **Keyboard Shortcuts**:
   - `Tab` - 切换 skip mode
   - `Space` / `Enter` - 继续对话 / 跳过打字机效果
   - `A` - 切换 auto-play
   - `Esc` - 打开菜单

5. **Visual Indicators**:
   - DialogueBox 右上角显示 AUTO (蓝色) 和 SKIP (红色) 状态标签
   - 状态标签带脉冲动画
   - 顶部状态栏显示 "跳过模式" (红色文字)

### Task #2: 自动存档系统
**开始时间**: 2026-04-06
**完成时间**: 2026-04-06
**修改文件**:
- `src/renderer/engine/types.ts` - 扩展 SaveData 和新增 AutoSaveData 接口
- `src/renderer/engine/SaveManager.ts` - 新增 autoSave/loadAutoSave/shouldAutoSave 方法
- `src/renderer/engine/NovelEngine.ts` - 新增 auto-save 触发逻辑和 playTime 追踪
- `src/renderer/components/AutoSaveToast.tsx` - 新增自动存档提示组件
- `src/renderer/components/SaveLoadMenu.tsx` - 新增 scene name 和 play time 显示
- `src/renderer/components/index.ts` - 导出 AutoSaveToast

**改动内容**:
1. **Auto-save 触发时机**:
   - `startScene()` 时检查是否应该自动存档
   - `selectChoice()` 前检查是否应该自动存档
   - 使用 `shouldAutoSave(sceneId)` 智能判断

2. **Smart Auto-save 逻辑**:
   - `justLoaded` 标志防止读取后立即自动存档
   - `lastAutoSaveSceneId` 防止同一场景重复存档
   - 30秒备份间隔通过 `startAutoSave()` 实现

3. **Play Time 追踪**:
   - `playTimeSeconds` 在 NovelEngine 中以秒为单位追踪
   - 显示在存档槽位中

4. **AutoSaveToast 组件**:
   - 右上角显示，2秒后淡出
   - 绿色脉冲动画表示存档成功

5. **存档槽位增强**:
   - 显示场景名称 (sceneName)
   - 显示游玩时间 (playTimeSeconds)

### Task #3: 分支选择UI
**开始时间**: 2026-04-06
**完成时间**: 2026-04-06
**修改文件**:
- `src/renderer/engine/types.ts` - 扩展 Choice 接口，新增 choiceType 和 isCritical 字段
- `src/renderer/components/ChoicePanel.tsx` - 完全重写，增强UI和交互

**改动内容**:
1. **Choice 接口扩展**:
   - 新增 `choiceType?: 'hub' | 'committed'` 字段
   - 新增 `isCritical?: boolean` 字段
   - 支持通过显式标记或关键词推断类型

2. **Hub vs Committed 视觉区分**:
   - Hub (可逆/非承诺): 虚线边框、浅色背景、圆形绿色指示器
   - Committed (单向/承诺): 实线红色边框、红色箭头指示器
   - 关键词推断: "will", "always", "forever", "never", "must", "shall", "决定", "承诺", "永远", "必然"

3. **最优选项数量 (2-4)**:
   - 2个选项时: 水平并排布局
   - 3-4个选项时: 垂直堆叠布局
   - 超过4个选项: 分页显示，底部页码导航

4. **关键选择指示器**:
   - 红色边框 + 红色脉冲动画
   - 警告图标 (&#9888;) 和感叹号 (!)
   - 关键词触发: "!", "danger", "warning", "critical", "final", "死亡", "危险", "关键", "最终"
   - 长文本(>50字符)自动标记为重要

5. **悬停/选择动画**:
   - 悬停: scale(1.05) + 白色光晕效果
   - 选中: scale(0.95) + 颜色反转(白底黑字)
   - 退出: scale(1.1) + 淡出 (300ms)

6. **键盘导航**:
   - 方向键切换焦点
   - Enter/Space 确认选择
   - 焦点状态可视化

7. **分页支持**:
   - 每页最多4个选项
   - 数字页码按钮导航
   - 页码指示器 (当前页/总页数)

### Task #4: 场景过渡效果
**开始时间**: 2026-04-06
**完成时间**: 2026-04-06
**修改文件**:
- `src/renderer/engine/types.ts` - 扩展 BackgroundTransition 类型，新增 irisOrigin
- `src/renderer/components/SceneTransition.tsx` - 新增场景过渡组件
- `src/renderer/components/index.ts` - 导出 SceneTransition 和 TransitionManager
- `src/renderer/App.tsx` - 集成场景过渡逻辑
- `src/renderer/assets/scripts/scott_antarctic.json` - 更新过渡效果配置

**改动内容**:
1. **新增过渡类型**:
   - `fadeToBlack`: 淡出 → 黑屏 → 淡入 (800ms)
   - `crossDissolve`: 交叉淡入淡出 (600ms)
   - `slide`: 水平滑动 (400ms)
   - `iris`: 圆形收缩/扩展 (500ms)

2. **SceneTransition 组件**:
   - 使用 CSS opacity 和 transform 实现过渡效果
   - Iris 使用 SVG mask 实现圆形遮罩
   - 支持自定义过渡原点 (center/top/bottom/left/right)

3. **TransitionManager 组件**:
   - 同时渲染旧场景和新场景
   - 管理过渡动画时序
   - 过渡完成后清理状态

4. **App.tsx 集成**:
   - 检测 scene.id 变化触发过渡
   - 使用 `previousSceneIdRef` 追踪上一个场景
   - `isTransitioning` 状态防止重复过渡

5. **南极故事过渡配置**:
   - `black_flag` → `the_letter`: fadeToBlack 800ms
   - `the_letter` → `evans_falls`: iris 500ms
   - `evans_falls` → `oates_sacrifice`: crossDissolve 600ms
   - `oates_sacrifice` → `final_camp`: crossDissolve 600ms
   - `final_camp` → `final_entry`: fadeToBlack 800ms

### Task #5: 设置菜单增强
**开始时间**: 2026-04-06
**完成时间**: 2026-04-06
**修改文件**:
- `src/renderer/engine/types.ts` - 新增 SkipMode 类型，扩展 SettingsData 接口
- `src/renderer/engine/SaveManager.ts` - 更新默认设置，新增 voiceVolume、autoPlayStopOnInteraction、skipMode
- `src/renderer/components/SettingsMenu.tsx` - 完全重写，增强UI和功能

**改动内容**:
1. **文本速度设置**:
   - 新增预设按钮：慢(0.5x) / 中(1x) / 快(2x) / 瞬间(5x)
   - 滑块实时调节，显示当前速度值
   - 预设按钮与滑块联动

2. **自动播放设置**:
   - 间隔选择：1秒 / 2秒 / 3秒 / 5秒（按钮组）
   - 新增"交互时停止"开关（默认开启）
   - 像素风格toggle按钮

3. **音量控制**:
   - 分离滑块：BGM / 音效 / 语音
   - 每个通道带静音按钮
   - 显示百分比数值
   - 静音时滑块变灰

4. **跳过模式设置**:
   - 选项：跳过未读 / 跳过已读
   - 按钮组UI，与Tab键行为对应

5. **UI改进**:
   - 模态对话框样式，带像素风格边框和光晕效果
   - 设置分组显示（文本/自动播放/音量/跳过/显示/快捷键）
   - 快捷键参考面板
   - "恢复默认"按钮（红色危险色）
   - "返回"按钮（金色高亮）
   - 像素风格按钮组件（带hover/active状态）

6. **键盘快捷键显示**:
   - Tab - 切换跳过模式
   - Space/Enter - 继续对话/跳过打字效果
   - A - 切换自动播放
   - Esc - 打开菜单
