-- TextUtils.lua
-- 文本工具函数

local TextUtils = {}

-- 自动换行
function TextUtils.wrapText(text, maxWidth, font)
    font = font or love.graphics.getFont()

    local lines = {}
    local currentLine = ""

    for word in text:gmatch("%S+") do
        local testLine = currentLine .. (currentLine == "" and "" or " ") .. word
        if font:getWidth(testLine) <= maxWidth then
            currentLine = testLine
        else
            if currentLine ~= "" then
                table.insert(lines, currentLine)
            end
            currentLine = word
        end
    end

    if currentLine ~= "" then
        table.insert(lines, currentLine)
    end

    return lines
end

-- 截断文本
function TextUtils.truncateText(text, maxWidth, suffix, font)
    font = font or love.graphics.getFont()
    suffix = suffix or "..."

    if font:getWidth(text) <= maxWidth then
        return text
    end

    local truncated = text
    while font:getWidth(truncated .. suffix) > maxWidth and #truncated > 0 do
        truncated = truncated:sub(1, -2)
    end

    return truncated .. suffix
end

-- 格式化时间 (秒 -> 分:秒)
function TextUtils.formatTime(seconds)
    local mins = math.floor(seconds / 60)
    local secs = math.floor(seconds % 60)
    return string.format("%02d:%02d", mins, secs)
end

-- 格式化日期
function TextUtils.formatDate(timestamp)
    local date = os.date("*t", timestamp)
    return string.format("%04d-%02d-%02d %02d:%02d",
        date.year, date.month, date.day, date.hour, date.min)
end

-- 颜色文本解析 (支持颜色标记)
-- 格式: [color=red]文本[/color]
function TextUtils.parseColorText(text)
    local segments = {}
    local pos = 1
    local currentColor = nil

    while pos <= #text do
        local colorStart = text:find("%[color=(%w+)%]", pos)
        local colorEnd = text:find("%[/color%]", pos)

        if colorStart and (not colorEnd or colorStart < colorEnd) then
            -- 提取颜色标记前的文本
            if colorStart > pos then
                table.insert(segments, {
                    text = text:sub(pos, colorStart - 1),
                    color = currentColor
                })
            end

            -- 设置当前颜色
            currentColor = text:match("%[color=(%w+)%]", colorStart)
            pos = colorStart + #("[color=" .. currentColor .. "]")
        elseif colorEnd then
            -- 提取颜色结束标记前的文本
            if colorEnd > pos then
                table.insert(segments, {
                    text = text:sub(pos, colorEnd - 1),
                    color = currentColor
                })
            end

            currentColor = nil
            pos = colorEnd + #("[/color]")
        else
            -- 没有更多颜色标记
            table.insert(segments, {
                text = text:sub(pos),
                color = currentColor
            })
            break
        end
    end

    return segments
end

-- 打字机效果文本处理
function TextUtils.typewriterText(fullText, currentIndex, cursorChar)
    cursorChar = cursorChar or ""
    return fullText:sub(1, currentIndex) .. cursorChar
end

-- 计算文本的行数
function TextUtils.getLineCount(text, maxWidth, font)
    local lines = TextUtils.wrapText(text, maxWidth, font)
    return #lines
end

-- 获取文本尺寸
function TextUtils.getTextSize(text, font)
    font = font or love.graphics.getFont()
    local width = font:getWidth(text)
    local height = font:getHeight()
    return width, height
end

return TextUtils
