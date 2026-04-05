-- TextBox.lua
-- 文本框组件 - 视觉小说风格的对话文本框

local TextBox = {}

-- 默认配置
local defaultConfig = {
    -- 尺寸和位置
    x = 8,
    y = 118,
    width = 304,
    height = 54,

    -- 外观
    bgColor = { 0, 0, 0, 0.85 },
    borderColor = { 0.76, 0.76, 0.76, 1 },  -- light_gray
    textColor = { 1, 1, 1, 1 },
    nameBgColor = { 0.11, 0.17, 0.33, 1 },  -- dark_blue
    nameBorderColor = { 0.76, 0.76, 0.76, 1 },
    nameTextColor = { 1, 1, 1, 1 },

    -- 边距
    paddingX = 8,
    paddingY = 6,
    namePaddingX = 8,
    namePaddingY = 2,

    -- 行高
    lineHeight = 10,

    -- 打字机效果
    typewriterSpeed = 30,  -- 字符/秒
    showCursor = true,
    cursorChar = "_",
    cursorBlinkRate = 0.5,
}

-- 创建新的文本框实例
function TextBox.new(config)
    local self = setmetatable({}, { __index = TextBox })

    -- 合并配置
    self.config = {}
    for k, v in pairs(defaultConfig) do
        self.config[k] = config and config[k] or v
    end

    -- 状态
    self.state = {
        text = "",              -- 当前显示的文本
        fullText = "",          -- 完整文本
        charIndex = 0,          -- 当前字符索引
        timer = 0,              -- 计时器
        paused = false,         -- 是否暂停
        completed = false,    -- 是否完成
        cursorVisible = true,   -- 光标是否可见
        cursorTimer = 0,        -- 光标计时器
        speaker = nil,          -- 说话者
        lines = {},             -- 分行后的文本
    }

    return self
end

-- 设置文本
function TextBox:setText(text, speaker)
    self.state.fullText = text or ""
    self.state.speaker = speaker
    self.state.charIndex = 0
    self.state.text = ""
    self.state.timer = 0
    self.state.paused = false
    self.state.completed = false
    self.state.lines = {}

    -- 预计算换行
    self:wrapText()
end

-- 自动换行
function TextBox:wrapText()
    local font = love.graphics.getFont()
    local maxWidth = self.config.width - self.config.paddingX * 2

    self.state.lines = {}
    local currentLine = ""

    for word in self.state.fullText:gmatch("%S+") do
        local testLine = currentLine .. (currentLine == "" and "" or " ") .. word
        if font:getWidth(testLine) <= maxWidth then
            currentLine = testLine
        else
            if currentLine ~= "" then
                table.insert(self.state.lines, currentLine)
            end
            currentLine = word
        end
    end

    if currentLine ~= "" then
        table.insert(self.state.lines, currentLine)
    end
end

-- 更新
function TextBox:update(dt)
    -- 打字机效果
    if not self.state.paused and not self.state.completed then
        self.state.timer = self.state.timer + dt

        local charDelay = 1 / self.config.typewriterSpeed

        while self.state.timer >= charDelay and self.state.charIndex < #self.state.fullText do
            self.state.timer = self.state.timer - charDelay
            self.state.charIndex = self.state.charIndex + 1

            -- 添加字符
            local char = self.state.fullText:sub(self.state.charIndex, self.state.charIndex)
            self.state.text = self.state.text .. char

            -- 播放打字音效 (可选)
            if char ~= " " and char ~= "\n" then
                -- AudioManager.playTypeSound()
            end
        end

        -- 检查是否完成
        if self.state.charIndex >= #self.state.fullText then
            self.state.completed = true
        end
    end

    -- 光标闪烁
    if self.config.showCursor then
        self.state.cursorTimer = self.state.cursorTimer + dt
        if self.state.cursorTimer >= self.config.cursorBlinkRate then
            self.state.cursorTimer = 0
            self.state.cursorVisible = not self.state.cursorVisible
        end
    end
end

-- 绘制
function TextBox:draw()
    local x = self.config.x
    local y = self.config.y
    local w = self.config.width
    local h = self.config.height

    -- 绘制说话者名字框
    if self.state.speaker then
        self:drawSpeakerName(x, y)
    end

    -- 绘制文本框背景
    love.graphics.setColor(self.config.bgColor)
    love.graphics.rectangle("fill", x, y, w, h)

    -- 绘制边框
    love.graphics.setColor(self.config.borderColor)
    love.graphics.setLineWidth(1)
    love.graphics.rectangle("line", x, y, w, h)

    -- 绘制文本
    self:drawText(x, y, w, h)

    -- 绘制继续提示
    if self.state.completed then
        self:drawContinuePrompt(x + w - 20, y + h - 15)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 绘制说话者名字
function TextBox:drawSpeakerName(textBoxX, textBoxY)
    local name = self.state.speaker
    local font = love.graphics.getFont()
    local textWidth = font:getWidth(name)
    local textHeight = font:getHeight()

    local nameBoxWidth = textWidth + self.config.namePaddingX * 2
    local nameBoxHeight = textHeight + self.config.namePaddingY * 2
    local nameBoxX = textBoxX + 4
    local nameBoxY = textBoxY - nameBoxHeight + 4

    -- 背景
    love.graphics.setColor(self.config.nameBgColor)
    love.graphics.rectangle("fill", nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight)

    -- 边框
    love.graphics.setColor(self.config.nameBorderColor)
    love.graphics.rectangle("line", nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight)

    -- 文字
    love.graphics.setColor(self.config.nameTextColor)
    love.graphics.print(name, nameBoxX + self.config.namePaddingX, nameBoxY + self.config.namePaddingY)
end

-- 绘制文本
function TextBox:drawText(x, y, w, h)
    love.graphics.setColor(self.config.textColor)

    local startX = x + self.config.paddingX
    local startY = y + self.config.paddingY
    local lineHeight = self.config.lineHeight

    -- 获取要显示的文本
    local displayText = self.state.text
    if self.state.completed and self.config.showCursor and self.state.cursorVisible then
        displayText = displayText .. self.config.cursorChar
    end

    -- 如果文本已经完成，使用预计算的行
    if self.state.completed then
        for i, line in ipairs(self.state.lines) do
            love.graphics.print(line, startX, startY + (i - 1) * lineHeight)
        end
    else
        -- 实时换行显示
        local lines = {}
        local currentLine = ""
        local font = love.graphics.getFont()
        local maxWidth = w - self.config.paddingX * 2

        for i = 1, #displayText do
            local char = displayText:sub(i, i)
            local testLine = currentLine .. char

            if char == "\n" then
                table.insert(lines, currentLine)
                currentLine = ""
            elseif font:getWidth(testLine) > maxWidth then
                table.insert(lines, currentLine)
                currentLine = char
            else
                currentLine = testLine
            end
        end

        if currentLine ~= "" then
            table.insert(lines, currentLine)
        end

        -- 绘制行
        for i, line in ipairs(lines) do
            love.graphics.print(line, startX, startY + (i - 1) * lineHeight)
        end
    end
end

-- 绘制继续提示
function TextBox:drawContinuePrompt(x, y)
    local alpha = (math.sin(love.timer.getTime() * 4) + 1) / 2 * 0.8 + 0.2
    love.graphics.setColor(1, 1, 1, alpha)
    love.graphics.print("▼", x, y)
end

-- 完成打字机效果
function TextBox:complete()
    self.state.text = self.state.fullText
    self.state.charIndex = #self.state.fullText
    self.state.completed = true
end

-- 检查是否完成
function TextBox:isCompleted()
    return self.state.completed
end

-- 设置暂停
function TextBox:setPaused(paused)
    self.state.paused = paused
end

-- 获取文本
function TextBox:getText()
    return self.state.fullText
end

-- 获取说话者
function TextBox:getSpeaker()
    return self.state.speaker
end

return TextBox
