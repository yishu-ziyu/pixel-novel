-- DialogueSystem.lua
-- 对话系统 - 处理视觉小说风格的对话展示

local DialogueSystem = {}

-- 状态
local state = {
    active = false,
    currentDialogue = nil,
    dialogueQueue = {},

    -- 打字机效果
    text = "",
    fullText = "",
    charIndex = 0,
    timer = 0,
    speed = GameConfig.TYPEWRITER_SPEED,
    paused = false,

    -- 对话显示
    speaker = nil,
    emotion = nil,
    background = nil,

    -- 选项
    choices = {},
    selectedChoice = 1,
    showingChoices = false,

    -- 自动播放
    autoPlay = false,
    autoPlayTimer = 0,
    autoPlayDelay = 2.0,

    -- 跳过
    skipping = false,
    skipSpeed = 0.01,
}

-- 配置
local config = {
    textBoxHeight = 50,
    textBoxPadding = 8,
    textSpeedMin = 10,
    textSpeedMax = 100,
    choiceSpacing = 16,
    maxCharsPerLine = 38,
}

-- 初始化
function DialogueSystem.init()
    print("DialogueSystem 初始化完成")
end

-- 开始一段对话
function DialogueSystem.startDialogue(dialogueData)
    state.active = true
    state.dialogueQueue = {}

    -- 处理单个对话或对话队列
    if dialogueData.lines then
        -- 对话队列
        for _, line in ipairs(dialogueData.lines) do
            table.insert(state.dialogueQueue, line)
        end
    else
        -- 单个对话
        table.insert(state.dialogueQueue, dialogueData)
    end

    -- 开始显示第一个对话
    DialogueSystem.nextLine()

    print("对话开始，共 " .. #state.dialogueQueue .. " 行")
end

-- 显示下一行对话
function DialogueSystem.nextLine()
    if #state.dialogueQueue == 0 then
        -- 对话结束
        DialogueSystem.endDialogue()
        return
    end

    -- 获取下一行
    local line = table.remove(state.dialogueQueue, 1)
    state.currentDialogue = line

    -- 设置说话者和文本
    state.speaker = line.speaker or nil
    state.emotion = line.emotion or "normal"
    state.fullText = line.text or ""

    -- 重置打字机效果
    state.text = ""
    state.charIndex = 0
    state.timer = 0
    state.paused = false

    -- 设置选项
    if line.choices and #line.choices > 0 then
        state.choices = line.choices
        state.showingChoices = false  -- 等文本显示完再显示选项
        state.selectedChoice = 1
    else
        state.choices = {}
        state.showingChoices = false
    end

    -- 触发事件
    if line.onStart then
        line.onStart()
    end

    print("显示对话: " .. (state.speaker or "旁白") .. " - " .. string.sub(state.fullText, 1, 30) .. "...")
end

-- 结束对话
function DialogueSystem.endDialogue()
    state.active = false
    state.currentDialogue = nil
    state.dialogueQueue = {}
    state.text = ""
    state.speaker = nil
    state.choices = {}
    state.showingChoices = false

    print("对话结束")

    -- 触发对话结束事件
    -- EventBus.emit("dialogue_end")
end

-- 更新
function DialogueSystem.update(dt)
    if not state.active then return end

    -- 跳过模式
    if state.skipping then
        state.timer = state.timer + dt * (1 / state.skipSpeed)
    else
        state.timer = state.timer + dt
    end

    -- 打字机效果
    if not state.paused and state.charIndex < #state.fullText then
        local charDelay = 1 / state.speed

        while state.timer >= charDelay and state.charIndex < #state.fullText do
            state.timer = state.timer - charDelay
            state.charIndex = state.charIndex + 1

            -- 添加字符
            local char = state.fullText:sub(state.charIndex, state.charIndex)
            state.text = state.text .. char

            -- 处理音效 (可选)
            if char ~= " " and char ~= "\n" then
                -- AudioManager.playTypeSound()
            end
        end
    end

    -- 自动播放
    if state.autoPlay and state.charIndex >= #state.fullText and not state.showingChoices then
        state.autoPlayTimer = state.autoPlayTimer + dt
        if state.autoPlayTimer >= state.autoPlayDelay then
            state.autoPlayTimer = 0
            DialogueSystem.advance()
        end
    end

    -- 更新选项选择
    if state.showingChoices then
        -- 处理选项悬停等效果
    end
end

-- 绘制
function DialogueSystem.draw()
    if not state.active then return end

    -- 绘制文本框背景
    drawTextBox()

    -- 绘制说话者名字
    if state.speaker then
        drawSpeakerName()
    end

    -- 绘制对话文本
    drawText()

    -- 绘制选项
    if state.showingChoices then
        drawChoices()
    end

    -- 绘制继续提示
    if not state.showingChoices and state.charIndex >= #state.fullText then
        drawContinuePrompt()
    end
end

-- 绘制文本框
function drawTextBox()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT
    local boxHeight = config.textBoxHeight
    local padding = config.textBoxPadding

    -- 文本框背景
    love.graphics.setColor(0, 0, 0, 0.85)
    love.graphics.rectangle("fill", padding, h - boxHeight - padding, w - padding * 2, boxHeight)

    -- 边框
    love.graphics.setColor(GameConfig.COLORS.light_gray)
    love.graphics.setLineWidth(1)
    love.graphics.rectangle("line", padding, h - boxHeight - padding, w - padding * 2, boxHeight)

    love.graphics.setColor(1, 1, 1)
end

-- 绘制说话者名字
function drawSpeakerName()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT
    local boxHeight = config.textBoxHeight
    local padding = config.textBoxPadding

    local name = state.speaker
    local nameWidth = GameState.fonts.default:getWidth(name) + 16
    local nameHeight = 14

    -- 名字背景
    love.graphics.setColor(GameConfig.COLORS.dark_blue)
    love.graphics.rectangle("fill", padding + 4, h - boxHeight - padding - nameHeight + 4, nameWidth, nameHeight)

    -- 名字边框
    love.graphics.setColor(GameConfig.COLORS.light_gray)
    love.graphics.rectangle("line", padding + 4, h - boxHeight - padding - nameHeight + 4, nameWidth, nameHeight)

    -- 名字文字
    love.graphics.setColor(GameConfig.COLORS.white)
    love.graphics.print(name, padding + 12, h - boxHeight - padding - nameHeight + 6)

    love.graphics.setColor(1, 1, 1)
end

-- 绘制对话文本
function drawText()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT
    local boxHeight = config.textBoxHeight
    local padding = config.textBoxPadding

    -- 计算文本区域
    local textX = padding + 12
    local textY = h - boxHeight - padding + 10
    local maxWidth = w - padding * 2 - 24

    -- 绘制文本
    love.graphics.setColor(GameConfig.COLORS.white)

    -- 简单的自动换行处理
    local text = state.text
    local lineHeight = 10
    local lines = {}
    local currentLine = ""

    for word in text:gmatch("%S+") do
        local testLine = currentLine .. (currentLine == "" and "" or " ") .. word
        if GameState.fonts.default:getWidth(testLine) <= maxWidth then
            currentLine = testLine
        else
            table.insert(lines, currentLine)
            currentLine = word
        end
    end
    if currentLine ~= "" then
        table.insert(lines, currentLine)
    end

    -- 绘制每一行
    for i, line in ipairs(lines) do
        love.graphics.print(line, textX, textY + (i - 1) * lineHeight)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 绘制选项
function drawChoices()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT

    local choiceWidth = 180
    local choiceHeight = 20
    local spacing = config.choiceSpacing
    local totalHeight = #state.choices * (choiceHeight + spacing) - spacing

    local startX = (w - choiceWidth) / 2
    local startY = (h - totalHeight) / 2 - 30

    for i, choice in ipairs(state.choices) do
        local y = startY + (i - 1) * (choiceHeight + spacing)
        local isSelected = (i == state.selectedChoice)

        -- 背景
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.dark_blue)
        else
            love.graphics.setColor(0, 0, 0, 0.7)
        end
        love.graphics.rectangle("fill", startX, y, choiceWidth, choiceHeight)

        -- 边框
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.light_gray)
        else
            love.graphics.setColor(GameConfig.COLORS.dark_gray)
        end
        love.graphics.rectangle("line", startX, y, choiceWidth, choiceHeight)

        -- 文字
        if isSelected then
            love.graphics.setColor(GameConfig.COLORS.white)
        else
            love.graphics.setColor(GameConfig.COLORS.light_gray)
        end
        local text = choice.text
        local textX = startX + (choiceWidth - GameState.fonts.default:getWidth(text)) / 2
        local textY = y + (choiceHeight - 8) / 2
        love.graphics.print(text, textX, textY)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 绘制继续提示
function drawContinuePrompt()
    local w = GameConfig.GAME_WIDTH
    local h = GameConfig.GAME_HEIGHT

    -- 闪烁效果
    local alpha = (math.sin(love.timer.getTime() * 4) + 1) / 2 * 0.8 + 0.2

    love.graphics.setColor(1, 1, 1, alpha)

    local prompt = "▼"
    local x = w - 20
    local y = h - 20

    love.graphics.print(prompt, x, y)

    love.graphics.setColor(1, 1, 1, 1)
end

-- 推进对话
function DialogueSystem.advance()
    if not state.active then return end

    if state.showingChoices then
        -- 确认选项选择
        DialogueSystem.selectChoice(state.selectedChoice)
    elseif state.charIndex < #state.fullText then
        -- 如果文本还没显示完，立即显示全部
        state.text = state.fullText
        state.charIndex = #state.fullText
    else
        -- 进入下一行
        DialogueSystem.nextLine()
    end
end

-- 选择选项
function DialogueSystem.selectChoice(choiceIndex)
    if not state.showingChoices then return end
    if choiceIndex < 1 or choiceIndex > #state.choices then return end

    local choice = state.choices[choiceIndex]

    print("选择了选项: " .. choice.text)

    -- 执行选项动作
    if choice.action then
        choice.action()
    end

    -- 如果有后续对话，继续
    if choice.next then
        -- 根据next类型处理
        if type(choice.next) == "string" then
            -- 跳转到指定对话ID
            -- TODO: 实现对话ID系统
        elseif type(choice.next) == "table" then
            -- 继续显示后续对话
            DialogueSystem.startDialogue({ lines = choice.next })
            return
        end
    end

    -- 否则继续下一段对话
    state.showingChoices = false
    DialogueSystem.nextLine()
end

-- 设置打字机速度
function DialogueSystem.setSpeed(speed)
    state.speed = math.max(config.textSpeedMin, math.min(config.textSpeedMax, speed))
end

-- 获取当前状态
function DialogueSystem.getState()
    return state
end

-- 是否活跃
function DialogueSystem.isActive()
    return state.active
end

-- 键盘输入处理
function DialogueSystem.keypressed(key)
    if not state.active then return end

    if key == "space" or key == "return" or key == "z" then
        DialogueSystem.advance()
    elseif key == "up" or key == "w" then
        if state.showingChoices then
            state.selectedChoice = state.selectedChoice - 1
            if state.selectedChoice < 1 then
                state.selectedChoice = #state.choices
            end
        end
    elseif key == "down" or key == "s" then
        if state.showingChoices then
            state.selectedChoice = state.selectedChoice + 1
            if state.selectedChoice > #state.choices then
                state.selectedChoice = 1
            end
        end
    elseif key == "ctrl" then
        state.skipping = true
    end
end

function DialogueSystem.keyreleased(key)
    if key == "ctrl" then
        state.skipping = false
    end
end

-- 鼠标输入处理
function DialogueSystem.mousepressed(x, y, button)
    if not state.active then return end

    if button == 1 then  -- 左键
        if state.showingChoices then
            -- 检查是否点击了某个选项
            local w = GameConfig.GAME_WIDTH
            local h = GameConfig.GAME_HEIGHT
            local choiceWidth = 180
            local choiceHeight = 20
            local spacing = config.choiceSpacing
            local totalHeight = #state.choices * (choiceHeight + spacing) - spacing
            local startX = (w - choiceWidth) / 2
            local startY = (h - totalHeight) / 2 - 30

            for i, choice in ipairs(state.choices) do
                local cy = startY + (i - 1) * (choiceHeight + spacing)
                if x >= startX and x <= startX + choiceWidth and
                   y >= cy and y <= cy + choiceHeight then
                    DialogueSystem.selectChoice(i)
                    return
                end
            end
        else
            -- 普通点击推进
            DialogueSystem.advance()
        end
    end
end

return DialogueSystem
