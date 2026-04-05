-- EventBus.lua
-- 事件总线 - 实现发布-订阅模式的组件间通信

local EventBus = {}

-- 事件监听器存储
local listeners = {}

-- 事件队列 (用于延迟触发)
local eventQueue = {}

-- 是否正在处理事件
local processing = false

-- 订阅事件
-- @param eventName: 事件名称
-- @param callback: 回调函数
-- @param priority: 优先级 (数字越大优先级越高，默认0)
-- @return subscriptionId: 订阅ID，用于取消订阅
function EventBus.on(eventName, callback, priority)
    if not eventName or type(callback) ~= "function" then
        print("Error: Invalid event subscription")
        return nil
    end

    priority = priority or 0

    -- 初始化事件监听器列表
    if not listeners[eventName] then
        listeners[eventName] = {}
    end

    -- 生成订阅ID
    local subscriptionId = tostring(callback) .. tostring(os.clock())

    -- 插入监听器，按优先级排序
    local inserted = false
    for i, listener in ipairs(listeners[eventName]) do
        if priority > listener.priority then
            table.insert(listeners[eventName], i, {
                id = subscriptionId,
                callback = callback,
                priority = priority,
                once = false,
            })
            inserted = true
            break
        end
    end

    if not inserted then
        table.insert(listeners[eventName], {
            id = subscriptionId,
            callback = callback,
            priority = priority,
            once = false,
        })
    end

    return subscriptionId
end

-- 订阅一次性事件
-- @param eventName: 事件名称
-- @param callback: 回调函数
-- @param priority: 优先级
function EventBus.once(eventName, callback, priority)
    local subscriptionId = EventBus.on(eventName, callback, priority)

    if subscriptionId and listeners[eventName] then
        for _, listener in ipairs(listeners[eventName]) do
            if listener.id == subscriptionId then
                listener.once = true
                break
            end
        end
    end

    return subscriptionId
end

-- 取消订阅
-- @param eventName: 事件名称
-- @param subscriptionId: 订阅ID
function EventBus.off(eventName, subscriptionId)
    if not eventName or not subscriptionId then return end
    if not listeners[eventName] then return end

    for i, listener in ipairs(listeners[eventName]) do
        if listener.id == subscriptionId then
            table.remove(listeners[eventName], i)
            break
        end
    end
end

-- 取消事件的所有订阅
-- @param eventName: 事件名称
function EventBus.clear(eventName)
    if eventName then
        listeners[eventName] = nil
    else
        listeners = {}
    end
end

-- 触发事件 (立即执行)
-- @param eventName: 事件名称
-- @param ...: 传递给回调函数的参数
function EventBus.emit(eventName, ...)
    if not listeners[eventName] then return end

    processing = true

    -- 复制监听器列表，防止在回调中修改原列表导致的问题
    local currentListeners = {}
    for _, listener in ipairs(listeners[eventName]) do
        table.insert(currentListeners, listener)
    end

    -- 执行回调
    for _, listener in ipairs(currentListeners) do
        local success, result = pcall(listener.callback, ...)

        if not success then
            print("Error in event callback for '" .. eventName .. "': " .. tostring(result))
        end

        -- 如果是一次性订阅，移除它
        if listener.once then
            EventBus.off(eventName, listener.id)
        end
    end

    processing = false

    -- 处理在事件触发期间排队的事件
    EventBus.processQueue()
end

-- 延迟触发事件 (下一帧执行)
-- @param eventName: 事件名称
-- @param ...: 传递给回调函数的参数
function EventBus.emitLater(eventName, ...)
    table.insert(eventQueue, {
        eventName = eventName,
        args = {...}
    })
end

-- 处理事件队列
function EventBus.processQueue()
    if processing then return end
    if #eventQueue == 0 then return end

    -- 复制队列并清空原队列
    local queue = eventQueue
    eventQueue = {}

    -- 处理队列中的事件
    for _, event in ipairs(queue) do
        EventBus.emit(event.eventName, unpack(event.args))
    end
end

-- 获取事件信息 (用于调试)
function EventBus.getInfo()
    local info = {
        eventCount = 0,
        listenerCount = 0,
        events = {}
    }

    for eventName, listeners in pairs(listeners) do
        info.eventCount = info.eventCount + 1
        info.listenerCount = info.listenerCount + #listeners
        table.insert(info.events, {
            name = eventName,
            listenerCount = #listeners
        })
    end

    return info
end

-- 预定义事件名称 (用于代码提示和避免拼写错误)
EventBus.Events = {
    -- 游戏生命周期
    GAME_INIT = "game:init",
    GAME_START = "game:start",
    GAME_PAUSE = "game:pause",
    GAME_RESUME = "game:resume",
    GAME_SAVE = "game:save",
    GAME_LOAD = "game:load",
    GAME_QUIT = "game:quit",

    -- 场景相关
    SCENE_ENTER = "scene:enter",
    SCENE_EXIT = "scene:exit",
    SCENE_CHANGE = "scene:change",

    -- 对话相关
    DIALOGUE_START = "dialogue:start",
    DIALOGUE_END = "dialogue:end",
    DIALOGUE_ADVANCE = "dialogue:advance",
    DIALOGUE_CHOICE = "dialogue:choice",

    -- 输入相关
    INPUT_KEY = "input:key",
    INPUT_MOUSE = "input:mouse",
    INPUT_TOUCH = "input:touch",

    -- UI相关
    UI_OPEN = "ui:open",
    UI_CLOSE = "ui:close",
    UI_FOCUS = "ui:focus",
    UI_BLUR = "ui:blur",

    -- 音频相关
    AUDIO_PLAY = "audio:play",
    AUDIO_STOP = "audio:stop",
    AUDIO_VOLUME = "audio:volume",

    -- 存档相关
    SAVE_CREATE = "save:create",
    SAVE_DELETE = "save:delete",
    SAVE_IMPORT = "save:import",
    SAVE_EXPORT = "save:export",
}

return EventBus
