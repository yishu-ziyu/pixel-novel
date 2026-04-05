-- SaveSystem.lua
-- 存档系统 - 管理游戏的保存和加载

local SaveSystem = {}

-- 存档配置
local config = {
    maxSaveSlots = 10,      -- 最大存档槽位数
    maxAutoSaves = 3,       -- 最大自动存档数
    maxQuickSaves = 1,      -- 最大快速存档数
    saveDirectory = "saves", -- 存档目录
    autoSaveInterval = 300, -- 自动保存间隔(秒)
}

-- 存档数据缓存
local saveCache = {}

-- 当前存档槽位
local currentSlot = 1

-- 初始化
function SaveSystem.init()
    print("SaveSystem 初始化...")

    -- 创建存档目录
    love.filesystem.createDirectory(config.saveDirectory)

    -- 加载存档列表
    SaveSystem.refreshCache()

    print("SaveSystem 初始化完成")
end

-- 刷新存档缓存
function SaveSystem.refreshCache()
    saveCache = {}

    local files = love.filesystem.getDirectoryItems(config.saveDirectory)

    for _, filename in ipairs(files) do
        if filename:match("^save_%d+\.dat$") then
            local slot = tonumber(filename:match("save_(%d+)"))
            if slot then
                local metadata = SaveSystem.loadMetadata(slot)
                if metadata then
                    saveCache[slot] = metadata
                end
            end
        end
    end
end

-- 获取存档元数据
function SaveSystem.loadMetadata(slot)
    local filename = string.format("%s/save_%d.dat", config.saveDirectory, slot)

    if not love.filesystem.getInfo(filename) then
        return nil
    end

    local data = love.filesystem.read(filename)
    if not data then
        return nil
    end

    -- 解析存档头部(元数据)
    local success, saveData = pcall(function()
        -- 简单的存档格式: 元数据JSON + 分隔符 + 游戏数据
        local metadataEnd = data:find("\n===DATA===\n")
        if metadataEnd then
            local metadataStr = data:sub(1, metadataEnd - 1)
            return love.json and love.json.decode(metadataStr) or loadstring(metadataStr)()
        end
        return nil
    end)

    if success and saveData then
        return saveData
    end

    return nil
end

-- 创建存档
function SaveSystem.save(slot, options)
    options = options or {}

    if slot < 1 or slot > config.maxSaveSlots then
        print("错误: 存档槽位 " .. slot .. " 超出范围")
        return false
    end

    -- 收集游戏数据
    local gameData = {
        -- 玩家数据
        player = {
            inventory = GameState.inventory,
            position = { x = 0, y = 0 }, -- TODO: 获取玩家位置
        },

        -- 游戏状态
        state = {
            currentScene = GameState.currentScene,
            flags = GameState.flags,
            clues = GameState.clues,
        },

        -- 时间戳
        timestamp = os.time(),

        -- 游戏时间 (如果实现了计时系统)
        playTime = 0, -- TODO: 获取实际游戏时间
    }

    -- 创建元数据
    local metadata = {
        slot = slot,
        timestamp = gameData.timestamp,
        playTime = gameData.playTime,
        currentScene = gameData.state.currentScene,
        description = options.description or ("存档 " .. slot),
        isAutoSave = options.isAutoSave or false,
        isQuickSave = options.isQuickSave or false,
    }

    -- 序列化存档数据
    local success, saveString = pcall(function()
        local metadataStr = "return " .. SaveSystem.tableToString(metadata)
        local dataStr = "return " .. SaveSystem.tableToString(gameData)
        return metadataStr .. "\n===DATA===\n" .. dataStr
    end)

    if not success then
        print("错误: 序列化存档数据失败 - " .. tostring(saveString))
        return false
    end

    -- 写入文件
    local filename = string.format("%s/save_%d.dat", config.saveDirectory, slot)
    local writeSuccess, writeError = love.filesystem.write(filename, saveString)

    if not writeSuccess then
        print("错误: 写入存档文件失败 - " .. tostring(writeError))
        return false
    end

    -- 更新缓存
    saveCache[slot] = metadata
    currentSlot = slot

    print("存档成功: 槽位 " .. slot)
    return true
end

-- 加载存档
function SaveSystem.load(slot)
    if slot < 1 or slot > config.maxSaveSlots then
        print("错误: 存档槽位 " .. slot .. " 超出范围")
        return false
    end

    -- 检查存档是否存在
    if not SaveSystem.hasSave(slot) then
        print("错误: 存档槽位 " .. slot .. " 不存在")
        return false
    end

    local filename = string.format("%s/save_%d.dat", config.saveDirectory, slot)
    local data = love.filesystem.read(filename)

    if not data then
        print("错误: 读取存档文件失败")
        return false
    end

    -- 解析存档数据
    local success, gameData = pcall(function()
        local dataStart = data:find("\n===DATA===\n")
        if dataStart then
            local dataStr = data:sub(dataStart + 11)
            return loadstring(dataStr)()
        end
        return nil
    end)

    if not success or not gameData then
        print("错误: 解析存档数据失败 - " .. tostring(gameData))
        return false
    end

    -- 应用游戏数据
    GameState.inventory = gameData.player.inventory or {}
    GameState.flags = gameData.state.flags or {}
    GameState.clues = gameData.state.clues or {}

    currentSlot = slot

    print("加载存档成功: 槽位 " .. slot)

    -- 切换到游戏场景
    local SceneManager = require("src.core.SceneManager")
    SceneManager.changeScene(gameData.state.currentScene or "game", { loaded = true })

    return true
end

-- 删除存档
function SaveSystem.delete(slot)
    if not SaveSystem.hasSave(slot) then
        return false
    end

    local filename = string.format("%s/save_%d.dat", config.saveDirectory, slot)
    local success = love.filesystem.remove(filename)

    if success then
        saveCache[slot] = nil
        print("删除存档: 槽位 " .. slot)
    end

    return success
end

-- 检查存档是否存在
function SaveSystem.hasSave(slot)
    return saveCache[slot] ~= nil
end

-- 获取存档信息
function SaveSystem.getSaveInfo(slot)
    return saveCache[slot]
end

-- 获取所有存档信息
function SaveSystem.getAllSaves()
    return saveCache
end

-- 获取存档槽位列表
function SaveSystem.getSaveSlots()
    local slots = {}
    for i = 1, config.maxSaveSlots do
        table.insert(slots, {
            slot = i,
            exists = SaveSystem.hasSave(i),
            info = saveCache[i],
        })
    end
    return slots
end

-- 快速保存
function SaveSystem.quickSave()
    return SaveSystem.save(config.maxSaveSlots, { isQuickSave = true })
end

-- 快速加载
function SaveSystem.quickLoad()
    return SaveSystem.load(config.maxSaveSlots)
end

-- 自动保存
function SaveSystem.autoSave()
    -- 找到最早的自动存档并覆盖，或者使用新的槽位
    local autoSaveSlot = 8  -- 使用槽位8-10作为自动存档
    return SaveSystem.save(autoSaveSlot, { isAutoSave = true })
end

-- 工具函数: 将表转换为字符串
function SaveSystem.tableToString(tbl, indent)
    indent = indent or 0
    local result = {}
    local indentStr = string.rep("  ", indent)

    if type(tbl) ~= "table" then
        return tostring(tbl)
    end

    table.insert(result, "{")

    for k, v in pairs(tbl) do
        local key = type(k) == "number" and "[" .. k .. "]" or "[\"" .. k .. "\"]"
        local value

        if type(v) == "table" then
            value = SaveSystem.tableToString(v, indent + 1)
        elseif type(v) == "string" then
            value = "\"" .. v .. "\""
        elseif type(v) == "number" or type(v) == "boolean" then
            value = tostring(v)
        else
            value = "nil"
        end

        table.insert(result, indentStr .. "  " .. key .. " = " .. value .. ",")
    end

    table.insert(result, indentStr .. "}")

    return table.concat(result, "\n")
end

-- 设置当前槽位
function SaveSystem.setCurrentSlot(slot)
    currentSlot = slot
end

-- 获取当前槽位
function SaveSystem.getCurrentSlot()
    return currentSlot
end

return SaveSystem
