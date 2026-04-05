-- hump.gamestate
-- 简化的游戏状态管理器

local gamestate = {}

-- 存储所有状态
local states = {}
local current = nil
local nextState = nil
local transitionActive = false

-- 注册一个状态
function gamestate.register(name, state)
    states[name] = state
    return state
end

-- 切换到指定状态
function gamestate.switch(name, params)
    if not states[name] then
        error("State not found: " .. tostring(name))
    end

    -- 调用当前状态的退出函数
    if current and current.leave then
        current.leave()
    end

    -- 切换状态
    current = states[name]

    -- 调用新状态的进入函数
    if current.enter then
        current.enter(params)
    end

    return current
end

-- 获取当前状态
function gamestate.current()
    return current
end

-- 更新
function gamestate.update(dt)
    if current and current.update then
        current.update(dt)
    end
end

-- 绘制
function gamestate.draw()
    if current and current.draw then
        current.draw()
    end
end

-- 键盘/鼠标事件
function gamestate.keypressed(key, scancode, isrepeat)
    if current and current.keypressed then
        current.keypressed(key, scancode, isrepeat)
    end
end

function gamestate.keyreleased(key, scancode)
    if current and current.keyreleased then
        current.keyreleased(key, scancode)
    end
end

function gamestate.mousepressed(x, y, button, istouch, presses)
    if current and current.mousepressed then
        current.mousepressed(x, y, button, istouch, presses)
    end
end

function gamestate.mousereleased(x, y, button, istouch, presses)
    if current and current.mousereleased then
        current.mousereleased(x, y, button, istouch, presses)
    end
end

function gamestate.mousemoved(x, y, dx, dy, istouch)
    if current and current.mousemoved then
        current.mousemoved(x, y, dx, dy, istouch)
    end
end

function gamestate.wheelmoved(x, y)
    if current and current.wheelmoved then
        current.wheelmoved(x, y)
    end
end

function gamestate.textinput(text)
    if current and current.textinput then
        current.textinput(text)
    end
end

function gamestate.resize(w, h)
    if current and current.resize then
        current.resize(w, h)
    end
end

function gamestate.focus(f)
    if current and current.focus then
        current.focus(f)
    end
end

function gamestate.visible(v)
    if current and current.visible then
        current.visible(v)
    end
end

function gamestate.quit()
    if current and current.quit then
        return current.quit()
    end
end

return gamestate
