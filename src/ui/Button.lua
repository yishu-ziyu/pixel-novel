-- Button.lua
-- 按钮组件 - 像素风格的按钮

local Button = {}

-- 默认配置
local defaultConfig = {
    -- 尺寸
    x = 0,
    y = 0,
    width = 80,
    height = 20,

    -- 外观
    bgColor = { 0, 0, 0, 0.7 },
    borderColor = { 0.37, 0.34, 0.31, 1 },  -- dark_gray
    textColor = { 0.76, 0.76, 0.76, 1 },    -- light_gray

    -- 悬停状态
    hoverBgColor = { 0.11, 0.17, 0.33, 1 },  -- dark_blue
    hoverBorderColor = { 1, 1, 1, 1 },
    hoverTextColor = { 1, 1, 1, 1 },

    -- 按下状态
    pressedBgColor = { 0.05, 0.09, 0.2, 1 },
    pressedBorderColor = { 0.76, 0.76, 0.76, 1 },

    -- 禁用状态
    disabledBgColor = { 0.37, 0.34, 0.31, 0.5 },
    disabledBorderColor = { 0.37, 0.34, 0.31, 0.5 },
    disabledTextColor = { 0.37, 0.34, 0.31, 1 },

    -- 文字
    text = "Button",
    font = nil,  -- nil 使用默认字体
    textAlign = "center",  -- "left", "center", "right"

    -- 边框
    borderWidth = 1,
    cornerRadius = 0,  -- 0 表示直角
}

-- 创建新按钮
function Button.new(config)
    local self = setmetatable({}, { __index = Button })

    -- 合并配置
    self.config = {}
    for k, v in pairs(defaultConfig) do
        self.config[k] = config and config[k] or v
    end

    -- 状态
    self.state = {
        hovered = false,
        pressed = false,
        disabled = false,
        visible = true,
    }

    -- 回调
    self.callbacks = {
        onClick = nil,
        onPress = nil,
        onRelease = nil,
        onHover = nil,
        onLeave = nil,
    }

    return self
end

-- 设置位置
function Button:setPosition(x, y)
    self.config.x = x
    self.config.y = y
end

-- 设置尺寸
function Button:setSize(width, height)
    self.config.width = width
    self.config.height = height
end

-- 设置文本
function Button:setText(text)
    self.config.text = text
end

-- 设置禁用状态
function Button:setDisabled(disabled)
    self.state.disabled = disabled
end

-- 设置可见性
function Button:setVisible(visible)
    self.state.visible = visible
end

-- 检查是否包含点
function Button:contains(x, y)
    return x >= self.config.x and
           x <= self.config.x + self.config.width and
           y >= self.config.y and
           y <= self.config.y + self.config.height
end

-- 更新
function Button:update(dt)
    if not self.state.visible or self.state.disabled then
        return
    end

    -- 光标闪烁等动画可以在这里更新
end

-- 绘制
function Button:draw()
    if not self.state.visible then
        return
    end

    local x = self.config.x
    local y = self.config.y
    local w = self.config.width
    local h = self.config.height

    -- 确定当前状态的颜色
    local bgColor, borderColor, textColor

    if self.state.disabled then
        bgColor = self.config.disabledBgColor
        borderColor = self.config.disabledBorderColor
        textColor = self.config.disabledTextColor
    elseif self.state.pressed then
        bgColor = self.config.pressedBgColor
        borderColor = self.config.pressedBorderColor
        textColor = self.config.hoverTextColor
    elseif self.state.hovered then
        bgColor = self.config.hoverBgColor
        borderColor = self.config.hoverBorderColor
        textColor = self.config.hoverTextColor
    else
        bgColor = self.config.bgColor
        borderColor = self.config.borderColor
        textColor = self.config.textColor
    end

    -- 绘制背景
    love.graphics.setColor(bgColor)
    if self.config.cornerRadius > 0 then
        love.graphics.rectangle("fill", x, y, w, h, self.config.cornerRadius)
    else
        love.graphics.rectangle("fill", x, y, w, h)
    end

    -- 绘制边框
    love.graphics.setColor(borderColor)
    love.graphics.setLineWidth(self.config.borderWidth)
    if self.config.cornerRadius > 0 then
        love.graphics.rectangle("line", x, y, w, h, self.config.cornerRadius)
    else
        love.graphics.rectangle("line", x, y, w, h)
    end

    -- 绘制文本
    love.graphics.setColor(textColor)

    local font = self.config.font or love.graphics.getFont()
    local text = self.config.text
    local textWidth = font:getWidth(text)
    local textHeight = font:getHeight()

    local textX, textY

    -- 水平对齐
    if self.config.textAlign == "left" then
        textX = x + self.config.paddingX
    elseif self.config.textAlign == "right" then
        textX = x + w - textWidth - self.config.paddingX
    else  -- center
        textX = x + (w - textWidth) / 2
    end

    -- 垂直居中
    textY = y + (h - textHeight) / 2

    love.graphics.print(text, textX, textY)

    love.graphics.setColor(1, 1, 1)
end

-- 事件处理
function Button:onMouseEnter()
    if not self.state.disabled then
        self.state.hovered = true
        if self.callbacks.onHover then
            self.callbacks.onHover(self)
        end
    end
end

function Button:onMouseLeave()
    self.state.hovered = false
    self.state.pressed = false
    if self.callbacks.onLeave then
        self.callbacks.onLeave(self)
    end
end

function Button:onMousePressed()
    if not self.state.disabled and self.state.hovered then
        self.state.pressed = true
        if self.callbacks.onPress then
            self.callbacks.onPress(self)
        end
    end
end

function Button:onMouseReleased()
    if self.state.pressed then
        self.state.pressed = false
        if self.callbacks.onRelease then
            self.callbacks.onRelease(self)
        end

        -- 如果还在悬停状态，触发点击
        if self.state.hovered and self.callbacks.onClick then
            self.callbacks.onClick(self)
        end
    end
end

-- 设置回调
function Button:setCallbacks(callbacks)
    for k, v in pairs(callbacks) do
        self.callbacks[k] = v
    end
end

return Button
