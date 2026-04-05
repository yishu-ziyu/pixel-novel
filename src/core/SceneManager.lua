-- SceneManager.lua
-- 场景管理器 - 管理游戏场景的切换和状态

local SceneManager = {}

-- 场景存储
local scenes = {}
local currentScene = nil
local previousScene = nil

-- 过渡效果
local transition = {
    active = false,
    type = "fade",  -- fade, slide, pixelate
    progress = 0,
    duration = 0.5,
    timer = 0,
    callback = nil,
    data = nil
}

-- 初始化
function SceneManager.init()
    -- 加载所有场景
    SceneManager.loadScenes()

    print("SceneManager 初始化完成")
end

-- 加载所有场景模块
function SceneManager.loadScenes()
    local sceneFiles = {
        "main_menu",
        "game",
        "settings",
        "save_menu",
    }

    for _, sceneName in ipairs(sceneFiles) do
        local success, sceneModule = pcall(require, "src.scenes." .. sceneName)
        if success then
            scenes[sceneName] = sceneModule
            print("场景加载成功: " .. sceneName)
        else
            print("场景加载失败: " .. sceneName .. " - " .. tostring(sceneModule))
        end
    end
end

-- 切换场景
function SceneManager.changeScene(sceneName, params, transitionType)
    params = params or {}
    transitionType = transitionType or "fade"

    -- 检查场景是否存在
    if not scenes[sceneName] then
        print("错误: 场景不存在 - " .. sceneName)
        return false
    end

    -- 如果有正在进行的过渡，先完成它
    if transition.active then
        SceneManager.completeTransition()
    end

    -- 设置过渡
    transition.type = transitionType
    transition.active = true
    transition.progress = 0
    transition.timer = 0
    transition.data = {
        targetScene = sceneName,
        params = params,
        fromScene = currentScene and currentScene.name or nil
    }

    -- 调用当前场景的退出回调
    if currentScene and currentScene.onExit then
        currentScene.onExit()
    end

    print("开始场景切换: " .. (currentScene and currentScene.name or "nil") .. " -> " .. sceneName)
    return true
end

-- 更新过渡效果
function SceneManager.updateTransition(dt)
    if not transition.active then return end

    transition.timer = transition.timer + dt
    transition.progress = math.min(transition.timer / transition.duration, 1)

    -- 过渡完成
    if transition.progress >= 1 then
        SceneManager.completeTransition()
    end
end

-- 完成过渡
function SceneManager.completeTransition()
    if not transition.active then return end

    local data = transition.data

    -- 保存前一个场景
    previousScene = currentScene

    -- 切换到新场景
    currentScene = scenes[data.targetScene]

    if currentScene then
        GameState.currentScene = data.targetScene

        -- 调用场景的进入回调
        if currentScene.onEnter then
            currentScene.onEnter(data.params)
        end

        print("场景切换完成: " .. data.targetScene)
    else
        print("错误: 无法切换到场景 " .. data.targetScene)
    end

    -- 重置过渡状态
    transition.active = false
    transition.progress = 0
    transition.timer = 0
    transition.data = nil
end

-- 绘制过渡效果
function SceneManager.drawTransition()
    if not transition.active then return end

    local p = transition.progress
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT

    if transition.type == "fade" then
        -- 淡入淡出效果
        local alpha = p < 0.5 and (p * 2) or ((1 - p) * 2)
        love.graphics.setColor(0, 0, 0, alpha)
        love.graphics.rectangle("fill", 0, 0, w, h)

    elseif transition.type == "slide" then
        -- 滑动效果
        local offset = w * p
        love.graphics.setColor(0, 0, 0)
        love.graphics.rectangle("fill", w - offset, 0, offset, h)

    elseif transition.type == "pixelate" then
        -- 像素化效果 (简化为方块扩散)
        local size = 20
        local cols = math.ceil(w / size)
        local rows = math.ceil(h / size)
        love.graphics.setColor(0, 0, 0)
        for i = 0, cols - 1 do
            for j = 0, rows - 1 do
                local noise = math.sin(i * 12.9898 + j * 78.233) * 43758.5453
                local threshold = (noise - math.floor(noise))
                if threshold < p then
                    love.graphics.rectangle("fill", i * size, j * size, size, size)
                end
            end
        end
    end

    love.graphics.setColor(1, 1, 1, 1)
end

-- 主更新函数
function SceneManager.update(dt)
    -- 更新过渡效果
    SceneManager.updateTransition(dt)

    -- 更新当前场景
    if currentScene and currentScene.update and not transition.active then
        currentScene.update(dt)
    end
end

-- 主绘制函数
function SceneManager.draw()
    -- 绘制当前场景
    if currentScene and currentScene.draw and not transition.active then
        currentScene.draw()
    end

    -- 绘制过渡效果
    SceneManager.drawTransition()
end

-- 输入处理
function SceneManager.keypressed(key)
    if transition.active then return end

    if currentScene and currentScene.keypressed then
        currentScene.keypressed(key)
    end
end

function SceneManager.mousepressed(x, y, button)
    if transition.active then return end

    if currentScene and currentScene.mousepressed then
        currentScene.mousepressed(x, y, button)
    end
end

function SceneManager.mousereleased(x, y, button)
    if transition.active then return end

    if currentScene and currentScene.mousereleased then
        currentScene.mousereleased(x, y, button)
    end
end

-- 菜单相关
function SceneManager.openMenu()
    if currentScene and currentScene.name ~= "main_menu" then
        SceneManager.changeScene("main_menu", {}, "fade")
    end
end

-- 存档相关
function SceneManager.quickSave()
    -- 实现快速保存逻辑
    print("快速保存...")
end

function SceneManager.quickLoad()
    -- 实现快速加载逻辑
    print("快速加载...")
end

function SceneManager.autoSave()
    -- 自动保存
    print("自动保存...")
end

-- 获取当前场景
function SceneManager.getCurrentScene()
    return currentScene
end

-- 获取场景列表
function SceneManager.getScenes()
    return scenes
end

return SceneManager
