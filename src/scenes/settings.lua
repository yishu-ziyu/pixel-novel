-- scenes/settings.lua
-- 设置场景

local settings = {
    name = "settings",
}

-- 设置选项
local options = {}
local selectedOption = 1
local currentTab = "general"  -- general, audio, display

-- 初始化
function settings.onEnter(params)
    print("进入设置场景")

    -- 初始化设置选项
    settings.initOptions()
    selectedOption = 1
    currentTab = "general"
end

function settings.onExit()
    print("离开设置场景")
    -- 保存设置
    settings.saveSettings()
end

-- 初始化选项
function settings.initOptions()
    options = {
        general = {
            { id = "text_speed", name = "文字速度", type = "slider", value = 30, min = 10, max = 100 },
            { id = "auto_play", name = "自动播放", type = "toggle", value = false },
            { id = "skip_read", name = "仅跳过已读", type = "toggle", value = true },
        },
        audio = {
            { id = "master_volume", name = "主音量", type = "slider", value = 80, min = 0, max = 100 },
            { id = "bgm_volume", name = "音乐音量", type = "slider", value = 70, min = 0, max = 100 },
            { id = "sfx_volume", name = "音效音量", type = "slider", value = 90, min = 0, max = 100 },
            { id = "voice_volume", name = "语音音量", type = "slider", value = 100, min = 0, max = 100 },
        },
        display = {
            { id = "fullscreen", name = "全屏模式", type = "toggle", value = false },
            { id = "vsync", name = "垂直同步", type = "toggle", value = true },
            { id = "scale", name = "缩放比例", type = "choice", value = 4, choices = {1, 2, 3, 4, 5, 6} },
        },
    }
end

-- 保存设置
function settings.saveSettings()
    print("保存设置...")
    -- TODO: 实现设置保存逻辑
    -- 可以将设置保存到文件或本地存储
end

-- 更新
function settings.update(dt)
    -- 设置界面不需要太多更新逻辑
end

-- 绘制
function settings.draw()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT

    -- 背景
    love.graphics.setColor(GameConfig.COLORS.dark_blue)
    love.graphics.rectangle("fill", 0, 0, w, h)

    -- 标题
    love.graphics.setColor(GameConfig.COLORS.white)
    love.graphics.setFont(GameState.fonts.medium)
    local title = "设置"
    local titleX = (w - GameState.fonts.medium:getWidth(title)) / 2
    love.graphics.print(title, titleX, 10)
    love.graphics.setFont(GameState.fonts.default)

    -- 绘制标签页
    settings.drawTabs(w, h)

    -- 绘制选项
    settings.drawOptions(w, h)

    -- 绘制返回提示
    love.graphics.setColor(GameConfig.COLORS.light_gray)
    love.graphics.print("按 ESC 返回", 4, h - 12)

    love.graphics.setColor(1, 1, 1)
end

-- 绘制标签页
function settings.drawTabs(w, h)
    local tabs = {
        { id = "general", name = "常规" },
        { id = "audio", name = "音频" },
        { id = "display", name = "显示" },
    }

    local tabWidth = 60
    local tabHeight = 16
    local spacing = 4
    local totalWidth = #tabs * tabWidth + (#tabs - 1) * spacing
    local startX = (w - totalWidth) / 2
    local startY = 35

    for i, tab in ipairs(tabs) do
        local x = startX + (i - 1) * (tabWidth + spacing)
        local isSelected = (tab.id == currentTab)

        -- 背景
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.dark_blue)
        else
            love.graphics.setColor(0, 0, 0, 0.5)
        end
        love.graphics.rectangle("fill", x, startY, tabWidth, tabHeight)

        -- 边框
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.white)
        else
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        end
        love.graphics.rectangle("line", x, startY, tabWidth, tabHeight)

        -- 文字
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.white)
        else
            love.graphics.setColor(GameConfig.COLORS.light_gray)
        end
        local textX = x + (tabWidth - GameState.fonts.default:getWidth(tab.name)) / 2
        local textY = startY + (tabHeight - 8) / 2
        love.graphics.print(tab.name, textX, textY)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 绘制选项
function settings.drawOptions(w, h)
    local currentOptions = options[currentTab] or {}

    local optionHeight = 18
    local spacing = 6
    local startX = 20
    local startY = 60
    local maxWidth = w - 40

    for i, option in ipairs(currentOptions) do
        local y = startY + (i - 1) * (optionHeight + spacing)
        local isSelected = (i == selectedOption)

        -- 高亮背景
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.dark_blue[1], GameConfig.COLORS.dark_blue[2], GameConfig.COLORS.dark_blue[3], 0.5)
            love.graphics.rectangle("fill", startX - 4, y - 2, maxWidth + 8, optionHeight + 4)
        end

        -- 选项名称
        love.graphics.setColor(isSelected and GameConfig.COLORS.white or GameConfig.COLORS.light_gray)
        love.graphics.print(option.name, startX, y + 4)

        -- 根据类型绘制值控件
        local valueX = startX + 100

        if option.type == "slider" then
            -- 滑块
            local sliderWidth = 60
            local sliderHeight = 6
            local fillWidth = sliderWidth * (option.value - option.min) / (option.max - option.min)

            love.graphics.setColor(GameConfig.COLORS.dark_gray)
            love.graphics.rectangle("fill", valueX, y + 6, sliderWidth, sliderHeight)

            love.graphics.setColor(isSelected and GameConfig.COLORS.blue or GameConfig.COLORS.light_gray)
            love.graphics.rectangle("fill", valueX, y + 6, fillWidth, sliderHeight)

            -- 数值显示
            love.graphics.setColor(GameConfig.COLORS.white)
            love.graphics.print(tostring(option.value), valueX + sliderWidth + 6, y + 4)

        elseif option.type == "toggle" then
            -- 开关
            local toggleWidth = 20
            local toggleHeight = 10
            local isOn = option.value

            love.graphics.setColor(isOn and GameConfig.COLORS.green or GameConfig.COLORS.dark_gray)
            love.graphics.rectangle("fill", valueX, y + 4, toggleWidth, toggleHeight)

            -- 开关按钮
            local knobX = isOn and (valueX + toggleWidth - 6) or valueX
            love.graphics.setColor(GameConfig.COLORS.white)
            love.graphics.rectangle("fill", knobX, y + 4, 6, toggleHeight)

            -- 文字
            love.graphics.setColor(GameConfig.COLORS.white)
            love.graphics.print(isOn and "开" or "关", valueX + toggleWidth + 6, y + 4)

        elseif option.type == "choice" then
            -- 选择
            local currentChoice = option.value
            love.graphics.setColor(isSelected and GameConfig.COLORS.blue or GameConfig.COLORS.light_gray)
            love.graphics.print("< " .. tostring(currentChoice) .. " >", valueX, y + 4)
        end
    end

    love.graphics.setColor(1, 1, 1)
end

-- 键盘输入处理
function settings.keypressed(key)
    local currentOptions = options[currentTab] or {}

    if key == "up" or key == "w" then
        selectedOption = selectedOption - 1
        if selectedOption < 1 then
            selectedOption = #currentOptions
        end

    elseif key == "down" or key == "s" then
        selectedOption = selectedOption + 1
        if selectedOption > #currentOptions then
            selectedOption = 1
        end

    elseif key == "left" or key == "a" then
        settings.adjustOption(-1)

    elseif key == "right" or key == "d" then
        settings.adjustOption(1)

    elseif key == "return" or key == "space" then
        -- 切换开关类型选项
        local option = currentOptions[selectedOption]
        if option and option.type == "toggle" then
            option.value = not option.value
            settings.applySetting(option)
        end

    elseif key == "escape" or key == "q" then
        -- 返回主菜单
        local SceneManager = require("src.core.SceneManager")
        SceneManager.changeScene("main_menu", {}, "fade")
    end
end

-- 调整选项值
function settings.adjustOption(direction)
    local currentOptions = options[currentTab] or {}
    local option = currentOptions[selectedOption]

    if not option then return end

    if option.type == "slider" then
        option.value = option.value + direction * 5
        option.value = math.max(option.min, math.min(option.max, option.value))
        settings.applySetting(option)

    elseif option.type == "choice" then
        local currentIndex = 1
        for i, v in ipairs(option.choices) do
            if v == option.value then
                currentIndex = i
                break
            end
        end
        currentIndex = currentIndex + direction
        if currentIndex < 1 then currentIndex = #option.choices end
        if currentIndex > #option.choices then currentIndex = 1 end
        option.value = option.choices[currentIndex]
        settings.applySetting(option)

    elseif option.type == "toggle" then
        if direction ~= 0 then
            option.value = not option.value
            settings.applySetting(option)
        end
    end
end

-- 应用设置
function settings.applySetting(option)
    print("应用设置: " .. option.id .. " = " .. tostring(option.value))

    -- 根据设置ID应用不同的设置
    if option.id == "text_speed" then
        local DialogueSystem = require("src.systems.DialogueSystem")
        DialogueSystem.setSpeed(option.value)

    elseif option.id == "fullscreen" then
        love.window.setFullscreen(option.value)

    elseif option.id == "vsync" then
        -- 注意: vsync 只能在 conf.lua 中设置，这里只是记录设置值
        -- 实际应用需要重启游戏

    elseif option.id == "scale" then
        -- 缩放比例设置 (需要重新计算窗口大小)
        -- 这里只是记录，实际应用可能需要重新加载
    end
end

-- 鼠标输入处理
function settings.mousepressed(x, y, button)
    -- 处理标签页点击
    local w = GameConfig.GAME_WIDTH
    local tabs = { "general", "audio", "display" }
    local tabWidth = 60
    local tabHeight = 16
    local spacing = 4
    local totalWidth = #tabs * tabWidth + (#tabs - 1) * spacing
    local startX = (w - totalWidth) / 2
    local startY = 35

    for i, tab in ipairs(tabs) do
        local tx = startX + (i - 1) * (tabWidth + spacing)
        if x >= tx and x <= tx + tabWidth and
           y >= startY and y <= startY + tabHeight then
            currentTab = tab
            selectedOption = 1
            return
        end
    end

    -- 处理选项点击
    local currentOptions = options[currentTab] or {}
    local optionHeight = 18
    local spacing = 6
    local startX = 20
    local startY = 60

    for i, option in ipairs(currentOptions) do
        local oy = startY + (i - 1) * (optionHeight + spacing)
        if x >= startX and x <= startX + 200 and
           y >= oy and y <= oy + optionHeight then
            selectedOption = i

            -- 根据类型处理点击
            if option.type == "toggle" then
                option.value = not option.value
                settings.applySetting(option)
            elseif option.type == "slider" then
                -- 根据点击位置设置滑块值
                local sliderX = startX + 100
                local sliderWidth = 60
                local relativeX = x - sliderX
                local ratio = math.max(0, math.min(1, relativeX / sliderWidth))
                option.value = math.floor(option.min + ratio * (option.max - option.min))
                settings.applySetting(option)
            end
            return
        end
    end
end

return settings
