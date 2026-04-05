-- Pixel Novel - 文本驱动解谜游戏
-- 主入口文件

-- 设置加载路径
local function setupPath()
    local path = love.filesystem.getSource()
    package.path = package.path .. ";" .. path .. "/?.lua"
    package.path = package.path .. ";" .. path .. "/?/init.lua"
    package.path = package.path .. ";" .. path .. "/src/?.lua"
    package.path = package.path .. ";" .. path .. "/src/?/init.lua"
end

-- 全局配置
GameConfig = {
    -- 游戏基础分辨率
    GAME_WIDTH = 320,
    GAME_HEIGHT = 180,

    -- 默认缩放
    DEFAULT_SCALE = 4,

    -- 颜色调色板 (Pico-8 风格)
    COLORS = {
        black = {0, 0, 0},
        dark_blue = {29, 43, 83},
        dark_purple = {126, 37, 83},
        dark_green = {0, 135, 81},
        brown = {171, 82, 54},
        dark_gray = {95, 87, 79},
        light_gray = {194, 195, 199},
        white = {255, 255, 255},
        red = {255, 0, 77},
        orange = {255, 163, 0},
        yellow = {255, 236, 39},
        green = {0, 228, 54},
        blue = {41, 173, 255},
        lavender = {131, 118, 156},
        pink = {255, 119, 168},
        peach = {255, 204, 170},
    },

    -- 打字机速度 (字符/秒)
    TYPEWRITER_SPEED = 30,

    -- 自动保存间隔 (秒)
    AUTOSAVE_INTERVAL = 60,
}

-- 全局状态
GameState = {
    currentScene = nil,
    currentDialogue = nil,
    inventory = {},
    flags = {},  -- 游戏标志/变量
    clues = {},  -- 已收集线索
    saveSlot = 1,
}

-- 核心系统引用
local SceneManager = nil
local DialogueSystem = nil
local UIManager = nil

-- 游戏缩放相关
local scale = 4
local offsetX = 0
local offsetY = 0

function love.load()
    setupPath()

    -- 设置随机种子
    math.randomseed(os.time())

    -- 设置默认滤镜为最近邻 (像素风)
    love.graphics.setDefaultFilter("nearest", "nearest")

    -- 加载字体
    loadFonts()

    -- 初始化核心系统
    SceneManager = require("src.core.SceneManager")
    DialogueSystem = require("src.systems.DialogueSystem")
    UIManager = require("src.ui.UIManager")

    -- 初始化系统
    SceneManager.init()
    DialogueSystem.init()
    UIManager.init()

    -- 计算初始缩放
    calculateScale()

    -- 加载开始场景
    SceneManager.changeScene("main_menu")

    print("Pixel Novel 游戏已加载完成")
end

function love.update(dt)
    -- 更新缩放
    calculateScale()

    -- 更新核心系统
    SceneManager.update(dt)
    DialogueSystem.update(dt)
    UIManager.update(dt)
end

function love.draw()
    -- 设置画布缩放
    love.graphics.push()
    love.graphics.translate(offsetX, offsetY)
    love.graphics.scale(scale, scale)

    -- 绘制游戏内容
    SceneManager.draw()
    DialogueSystem.draw()
    UIManager.draw()

    -- 恢复画布
    love.graphics.pop()

    -- 绘制调试信息 (开发模式)
    if love.keyboard.isDown("f3") then
        drawDebugInfo()
    end
end

function love.keypressed(key)
    -- 全局快捷键
    if key == "escape" then
        -- 打开菜单或返回
        SceneManager.openMenu()
    elseif key == "f11" then
        -- 全屏切换
        love.window.setFullscreen(not love.window.getFullscreen())
    elseif key == "s" and love.keyboard.isDown("lctrl") then
        -- 快速保存
        SceneManager.quickSave()
    elseif key == "l" and love.keyboard.isDown("lctrl") then
        -- 快速加载
        SceneManager.quickLoad()
    end

    -- 传递给当前系统
    SceneManager.keypressed(key)
    DialogueSystem.keypressed(key)
    UIManager.keypressed(key)
end

function love.mousepressed(x, y, button)
    -- 转换鼠标坐标到游戏坐标
    local gameX = (x - offsetX) / scale
    local gameY = (y - offsetY) / scale

    SceneManager.mousepressed(gameX, gameY, button)
    DialogueSystem.mousepressed(gameX, gameY, button)
    UIManager.mousepressed(gameX, gameY, button)
end

function love.mousereleased(x, y, button)
    local gameX = (x - offsetX) / scale
    local gameY = (y - offsetY) / scale

    SceneManager.mousereleased(gameX, gameY, button)
    UIManager.mousereleased(gameX, gameY, button)
end

function love.mousemoved(x, y, dx, dy)
    local gameX = (x - offsetX) / scale
    local gameY = (y - offsetY) / scale

    UIManager.mousemoved(gameX, gameY)
end

function love.resize(w, h)
    calculateScale()
end

function love.quit()
    -- 自动保存
    SceneManager.autoSave()
end

-- 私有函数

function loadFonts()
    -- 尝试加载像素字体，如果失败则使用默认字体
    local fontPaths = {
        "assets/fonts/pixel_font.ttf",
        "assets/fonts/PressStart2P.ttf",
        "assets/fonts/VCR_OSD.ttf",
    }

    local loadedFont = nil
    for _, path in ipairs(fontPaths) do
        if love.filesystem.getInfo(path) then
            loadedFont = love.graphics.newFont(path, 8)
            break
        end
    end

    -- 如果找不到字体文件，使用默认字体
    if not loadedFont then
        loadedFont = love.graphics.newFont(8)
    end

    -- 设置字体
    love.graphics.setFont(loadedFont)

    -- 存储字体引用供其他模块使用
    GameState.fonts = {
        default = loadedFont,
        small = loadedFont,
        medium = love.graphics.newFont(loadedFont:getFilename() or 12, 12),
        large = love.graphics.newFont(loadedFont:getFilename() or 16, 16),
    }
end

function calculateScale()
    local windowWidth = love.graphics.getWidth()
    local windowHeight = love.graphics.getHeight()

    -- 计算最佳缩放比例
    local scaleX = windowWidth / GameConfig.GAME_WIDTH
    local scaleY = windowHeight / GameConfig.GAME_HEIGHT

    -- 使用较小的缩放比例以保持宽高比
    scale = math.min(scaleX, scaleY)

    -- 限制最大缩放
    scale = math.min(scale, 6)

    -- 计算居中的偏移量
    offsetX = (windowWidth - GameConfig.GAME_WIDTH * scale) / 2
    offsetY = (windowHeight - GameConfig.GAME_HEIGHT * scale) / 2
end

function drawDebugInfo()
    local debugText = string.format(
        "FPS: %d | Scale: %.2f | Scene: %s | Entities: %d",
        love.timer.getFPS(),
        scale,
        GameState.currentScene or "none",
        0
    )

    -- 在屏幕左上角绘制调试信息
    love.graphics.setColor(0, 0, 0, 0.8)
    love.graphics.rectangle("fill", 10, 10, love.graphics.getFont():getWidth(debugText) + 10, 20)
    love.graphics.setColor(0, 255, 0)
    love.graphics.print(debugText, 15, 13)
    love.graphics.setColor(1, 1, 1)
end
