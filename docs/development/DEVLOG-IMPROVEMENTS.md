# Pixel Novel 游戏改进开发日志

> 记录时间: 2026-04-06
> 目标: 基于开源VN/GA游戏研究结果，改进游戏可玩性

## 改进任务清单

| ID | 任务 | 优先级 | 状态 | 负责人 |
|----|------|--------|------|--------|
| 1 | 优化打字机效果和快速跳过 | 🔴 高 | 待开始 | - |
| 2 | 实现自动存档系统 | 🔴 高 | 进行中 | - |
| 3 | 增强分支选择UI | 🟡 中 | 待开始 | - |
| 4 | 添加场景过渡效果 | 🟡 中 | 已完成 | - |
| 5 | 增强设置菜单 | 🟡 中 | 待开始 | - | |

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
**开始时间**: -
**完成时间**: -
**修改文件**: -
**改动内容**: -

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
**开始时间**: -
**完成时间**: -
**修改文件**: -
**改动内容**: -

### Task #4: 场景过渡效果
**开始时间**: -
**完成时间**: -
**修改文件**: -
**改动内容**: -

### Task #5: 设置菜单增强
**开始时间**: -
**完成时间**: -
**修改文件**: -
**改动内容**: -
