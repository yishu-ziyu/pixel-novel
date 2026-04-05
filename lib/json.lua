-- json.lua
-- 简单的JSON编码/解码库

local json = {}

-- 编码: 将Lua表转换为JSON字符串
function json.encode(tbl)
    if type(tbl) ~= "table" then
        error("json.encode expects a table, got " .. type(tbl))
    end

    local result = {}

    local function encodeValue(val)
        local valType = type(val)

        if valType == "nil" then
            return "null"
        elseif valType == "boolean" then
            return tostring(val)
        elseif valType == "number" then
            return tostring(val)
        elseif valType == "string" then
            -- 转义特殊字符
            local escaped = val
            escaped = escaped:gsub("\\", "\\\\")
            escaped = escaped:gsub("\"", "\\\"")
            escaped = escaped:gsub("\b", "\\b")
            escaped = escaped:gsub("\f", "\\f")
            escaped = escaped:gsub("\n", "\\n")
            escaped = escaped:gsub("\r", "\\r")
            escaped = escaped:gsub("\t", "\\t")
            return "\"" .. escaped .. "\""
        elseif valType == "table" then
            -- 判断是数组还是对象
            local isArray = true
            local maxIndex = 0
            local count = 0

            for k, v in pairs(val) do
                count = count + 1
                if type(k) ~= "number" or k <= 0 or k ~= math.floor(k) then
                    isArray = false
                    break
                end
                if k > maxIndex then
                    maxIndex = k
                end
            end

            if isArray and maxIndex ~= count then
                isArray = false
            end

            if isArray then
                -- 编码数组
                local items = {}
                for i = 1, maxIndex do
                    table.insert(items, encodeValue(val[i]))
                end
                return "[" .. table.concat(items, ",") .. "]"
            else
                -- 编码对象
                local items = {}
                for k, v in pairs(val) do
                    if type(k) == "string" or type(k) == "number" then
                        local key = type(k) == "string" and k or tostring(k)
                        table.insert(items, encodeValue(key) .. ":" .. encodeValue(v))
                    end
                end
                return "{" .. table.concat(items, ",") .. "}"
            end
        else
            error("Cannot encode value of type " .. valType)
        end
    end

    return encodeValue(tbl)
end

-- 解码: 将JSON字符串转换为Lua表
function json.decode(str)
    if type(str) ~= "string" then
        error("json.decode expects a string, got " .. type(str))
    end

    -- 移除BOM
    str = str:gsub("^\xEF\xBB\xBF", "")

    -- 移除空白字符
    local pos = 1
    local len = #str

    local function skipWhitespace()
        while pos <= len do
            local c = str:sub(pos, pos)
            if c == " " or c == "\t" or c == "\n" or c == "\r" then
                pos = pos + 1
            else
                break
            end
        end
    end

    local function parseValue()
        skipWhitespace()

        if pos > len then
            error("Unexpected end of input")
        end

        local c = str:sub(pos, pos)

        if c == "{" then
            return parseObject()
        elseif c == "[" then
            return parseArray()
        elseif c == "\"" then
            return parseString()
        elseif c == "t" then
            return parseLiteral("true", true)
        elseif c == "f" then
            return parseLiteral("false", false)
        elseif c == "n" then
            return parseLiteral("null", nil)
        elseif c:match("[%d%-]") then
            return parseNumber()
        else
            error("Unexpected character: " .. c)
        end
    end

    function parseObject()
        local obj = {}
        pos = pos + 1  -- skip '{'
        skipWhitespace()

        if str:sub(pos, pos) == "}" then
            pos = pos + 1
            return obj
        end

        while true do
            skipWhitespace()
            local key = parseString()
            skipWhitespace()

            if str:sub(pos, pos) ~= ":" then
                error("Expected ':' in object")
            end
            pos = pos + 1

            local value = parseValue()
            obj[key] = value

            skipWhitespace()
            local c = str:sub(pos, pos)
            pos = pos + 1

            if c == "}" then
                break
            elseif c ~= "," then
                error("Expected ',' or '}' in object")
            end
        end

        return obj
    end

    function parseArray()
        local arr = {}
        pos = pos + 1  -- skip '['
        skipWhitespace()

        if str:sub(pos, pos) == "]" then
            pos = pos + 1
            return arr
        end

        while true do
            local value = parseValue()
            table.insert(arr, value)

            skipWhitespace()
            local c = str:sub(pos, pos)
            pos = pos + 1

            if c == "]" then
                break
            elseif c ~= "," then
                error("Expected ',' or ']' in array")
            end
        end

        return arr
    end

    function parseString()
        pos = pos + 1  -- skip opening quote
        local result = {}

        while pos <= len do
            local c = str:sub(pos, pos)

            if c == "\"" then
                pos = pos + 1
                return table.concat(result)
            elseif c == "\\" then
                pos = pos + 1
                if pos > len then
                    error("Unexpected end of string escape")
                end
                local esc = str:sub(pos, pos)
                if esc == "\"" then table.insert(result, "\"")
                elseif esc == "\\" then table.insert(result, "\\")
                elseif esc == "/" then table.insert(result, "/")
                elseif esc == "b" then table.insert(result, "\b")
                elseif esc == "f" then table.insert(result, "\f")
                elseif esc == "n" then table.insert(result, "\n")
                elseif esc == "r" then table.insert(result, "\r")
                elseif esc == "t" then table.insert(result, "\t")
                elseif esc == "u" then
                    -- Unicode escape
                    local hex = str:sub(pos + 1, pos + 4)
                    local code = tonumber(hex, 16)
                    if code then
                        if code < 128 then
                            table.insert(result, string.char(code))
                        else
                            -- UTF-8 encoding for larger code points
                            if code < 2048 then
                                table.insert(result, string.char(192 + math.floor(code / 64), 128 + code % 64))
                            else
                                table.insert(result, string.char(224 + math.floor(code / 4096), 128 + math.floor(code / 64) % 64, 128 + code % 64))
                            end
                        end
                    end
                    pos = pos + 4
                else
                    table.insert(result, esc)
                end
                pos = pos + 1
            elseif c:match("[\x00-\x1f]") then
                error("Control character in string")
            else
                table.insert(result, c)
                pos = pos + 1
            end
        end

        error("Unterminated string")
    end

    function parseNumber()
        local start = pos
        local c = str:sub(pos, pos)

        if c == "-" then
            pos = pos + 1
            c = str:sub(pos, pos)
        end

        if c == "0" then
            pos = pos + 1
        elseif c:match("[1-9]") then
            while pos <= len and str:sub(pos, pos):match("%d") do
                pos = pos + 1
            end
        else
            error("Invalid number")
        end

        if pos <= len and str:sub(pos, pos) == "." then
            pos = pos + 1
            if not str:sub(pos, pos):match("%d") then
                error("Invalid number: expected digit after decimal point")
            end
            while pos <= len and str:sub(pos, pos):match("%d") do
                pos = pos + 1
            end
        end

        if pos <= len and str:sub(pos, pos):match("[eE]") then
            pos = pos + 1
            if str:sub(pos, pos):match("[+-]") then
                pos = pos + 1
            end
            if not str:sub(pos, pos):match("%d") then
                error("Invalid number: expected digit in exponent")
            end
            while pos <= len and str:sub(pos, pos):match("%d") do
                pos = pos + 1
            end
        end

        local numStr = str:sub(start, pos - 1)
        local num = tonumber(numStr)

        if not num then
            error("Failed to parse number: " .. numStr)
        end

        return num
    end

    function parseLiteral(literal, value)
        if str:sub(pos, pos + #literal - 1) ~= literal then
            error("Expected '" .. literal .. "'")
        end
        pos = pos + #literal
        return value
    end

    return parseValue()
end

-- 导出json模块
love.json = json

return json
