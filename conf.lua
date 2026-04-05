-- LÖVE2D 配置文件
-- 视觉小说风格像素游戏配置

function love.conf(t)
    -- 窗口标题
    t.window.title = "Pixel Novel - 文本驱动解谜游戏"

    -- 游戏版本
    t.version = "11.4"

    -- 游戏分辨率设置
    -- 基础分辨率 320x180 (16:9 像素风)
    -- 默认 4x 缩放 = 1280x720
    t.window.width = 1280
    t.window.height = 720

    -- 窗口设置
    t.window.resizable = true
    t.window.minwidth = 640
    t.window.minheight = 360
    t.window.fullscreen = false
    t.window.fullscreentype = "desktop"
    t.window.vsync = 1

    -- 禁用不需要的模块以优化性能
    t.modules.joystick = false
    t.modules.thread = true
    t.modules.physics = false

    -- 启用需要的模块
    t.modules.audio = true
    t.modules.data = true
    t.modules.event = true
    t.modules.font = true
    t.modules.graphics = true
    t.modules.image = true
    t.modules.keyboard = true
    t.modules.math = true
    t.modules.mouse = true
    t.modules.sound = true
    t.modules.system = true
    t.modules.timer = true
    t.modules.touch = false
    t.modules.video = false
    t.modules.window = true
end
