-- scenes/main_menu.lua
-- 主菜单场景

local main_menu = {
    name = "main_menu",
}

-- UI元素
local buttons = {}
local selectedButton = 1
local logoY = 0
local logoTimer = 0

-- 初始化
function main_menu.onEnter(params)
    print("进入主菜单")

    -- 初始化按钮
    buttons = {
        { text = "开始游戏", action = "start_game" },
        { text = "继续游戏", action = "continue", disabled = not main_menu.hasSaveData() },
        { text = "设置", action = "settings" },
        { text = "退出", action = "quit" },
    }

    selectedButton = 1
    logoY = 0
    logoTimer = 0
end

function main_menu.onExit()
    print("离开主菜单")
end

-- 更新
function main_menu.update(dt)
    -- Logo动画
    logoTimer = logoTimer + dt
    logoY = math.sin(logoTimer * 2) * 3

    -- 更新按钮状态
    buttons[2].disabled = not main_menu.hasSaveData()
end

-- 绘制
function main_menu.draw()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT

    -- 背景 (深色渐变效果)
    love.graphics.setColor(GameConfig.COLORS.dark_blue)
    love.graphics.rectangle("fill", 0, 0, w, h)

    -- 装饰性像素图案
    drawPixelPattern(w, h)

    -- Logo/标题
    love.graphics.setColor(GameConfig.COLORS.white)
    local title = "PIXEL NOVEL"
    local titleX = (w - GameState.fonts.large:getWidth(title)) / 2
    love.graphics.setFont(GameState.fonts.large)
    love.graphics.print(title, titleX, 30 + logoY)

    -- 副标题
    love.graphics.setColor(GameConfig.COLORS.light_gray)
    local subtitle = "文本驱动解谜游戏"
    local subtitleX = (w - GameState.fonts.default:getWidth(subtitle)) / 2
    love.graphics.setFont(GameState.fonts.default)
    love.graphics.print(subtitle, subtitleX, 50 + logoY)

    -- 绘制按钮
    drawButtons(w, h)

    -- 版本信息
    love.graphics.setColor(GameConfig.COLORS.dark_gray)
    love.graphics.print("v0.1.0", 4, h - 12)

    -- 恢复字体
    love.graphics.setFont(GameState.fonts.default)
    love.graphics.setColor(1, 1, 1)
end

-- 绘制像素图案
function drawPixelPattern(w, h)
    love.graphics.setColor(GameConfig.COLORS.dark_purple[1], GameConfig.COLORS.dark_purple[2], GameConfig.COLORS.dark_purple[3], 0.3)

    -- 随机像素点
    for i = 1, 50 do
        local x = math.random(0, w)
        local y = math.random(0, h)
        love.graphics.rectangle("fill", x, y, 1, 1)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 绘制按钮
function drawButtons(w, h)
    local buttonWidth = 100
    local buttonHeight = 18
    local buttonSpacing = 8
    local startY = 90

    for i, button in ipairs(buttons) do
        local y = startY + (i - 1) * (buttonHeight + buttonSpacing)
        local x = (w - buttonWidth) / 2

        local isSelected = (i == selectedButton)
        local isDisabled = button.disabled

        -- 背景
        if isDisabled then
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        elseif isSelected then
            love.graphics.setColor(GameConfig.COLORS.dark_blue)
        else
            love.graphics.setColor(0, 0, 0, 0.5)
        end
        love.graphics.rectangle("fill", x, y, buttonWidth, buttonHeight)

        -- 边框
        if isDisabled then
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        elseif isSelected then
            love.graphics.setColor(GameConfig.COLORS.white)
        else
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        end
        love.graphics.rectangle("line", x, y, buttonWidth, buttonHeight)

        -- 文字
        if isDisabled then
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        elseif isSelected then
            love.graphics.setColor(GameConfig.COLORS.white)
        else
            love.graphics.setColor(GameConfig.COLORS.light_gray)
        end
        local textX = x + (buttonWidth - GameState.fonts.default:getWidth(button.text)) / 2
        local textY = y + (buttonHeight - 8) / 2
        love.graphics.print(button.text, textX, textY)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 输入处理
function main_menu.keypressed(key)
    if key == "up" or key == "w" then
        repeat
            selectedButton = selectedButton - 1
            if selectedButton < 1 then
                selectedButton = #buttons
            end
        until not buttons[selectedButton].disabled

    elseif key == "down" or key == "s" then
        repeat
            selectedButton = selectedButton + 1
            if selectedButton > #buttons then
                selectedButton = 1
            end
        until not buttons[selectedButton].disabled

    elseif key == "return" or key == "z" or key == "space" then
        main_menu.activateButton(selectedButton)
    end
end

function main_menu.mousepressed(x, y, button)
    if button ~= 1 then return end

    local w = GameConfig.GAME_WIDTH
    local buttonWidth = 100
    local buttonHeight = 18
    local buttonSpacing = 8
    local startY = 90

    for i, btn in ipairs(buttons) do
        if not btn.disabled then
            local by = startY + (i - 1) * (buttonHeight + buttonSpacing)
            local bx = (w - buttonWidth) / 2

            if x >= bx and x <= bx + buttonWidth and
               y >= by and y <= by + buttonHeight then
                selectedButton = i
                main_menu.activateButton(i)
                return
            end
        end
    end
end

-- 激活按钮
function main_menu.activateButton(index)
    local button = buttons[index]
    if not button or button.disabled then return end

    print("激活按钮: " .. button.text)

    local action = button.action
    if action == "start_game" then
        -- 开始新游戏
        local SceneManager = require("src.core.SceneManager")
        SceneManager.changeScene("game", { newGame = true }, "fade")

    elseif action == "continue" then
        -- 继续游戏
        local SceneManager = require("src.core.SceneManager")
        SceneManager.changeScene("game", { continue = true }, "fade")

    elseif action == "settings" then
        -- 打开设置
        local SceneManager = require("src.core.SceneManager")
        SceneManager.changeScene("settings", {}, "slide")

    elseif action == "quit" then
        -- 退出游戏
        love.event.quit()
    end
end

-- 检查是否有存档数据
function main_menu.hasSaveData()
    -- TODO: 实现存档检测逻辑
    return false
end

return main_menu
