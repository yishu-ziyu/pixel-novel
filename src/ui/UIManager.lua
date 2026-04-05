-- UIManager.lua
-- UI管理器 - 管理所有UI组件和交互

local UIManager = {}

-- UI元素存储
local elements = {}
local focusedElement = nil
local hoveredElement = nil

-- UI状态
local uiState = {
    visible = true,
    modal = false,  -- 是否有模态窗口
    modalStack = {}, -- 模态窗口堆栈
}

-- 初始化
function UIManager.init()
    print("UIManager 初始化完成")
end

-- 更新
function UIManager.update(dt)
    if not uiState.visible then return end

    -- 更新所有UI元素
    for _, element in ipairs(elements) do
        if element.update then
            element:update(dt)
        end
    end
end

-- 绘制
function UIManager.draw()
    if not uiState.visible then return end

    -- 绘制所有UI元素
    for _, element in ipairs(elements) do
        if element.visible ~= false and element.draw then
            element:draw()
        end
    end

    -- 绘制模态遮罩
    if uiState.modal then
        love.graphics.setColor(0, 0, 0, 0.6)
        love.graphics.rectangle("fill", 0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT)
        love.graphics.setColor(1, 1, 1)
    end
end

-- 注册UI元素
function UIManager.register(element)
    table.insert(elements, element)
    element.id = #elements
    return element
end

-- 移除UI元素
function UIManager.unregister(element)
    for i, e in ipairs(elements) do
        if e == element then
            table.remove(elements, i)
            return true
        end
    end
    return false
end

-- 清除所有UI元素
function UIManager.clear()
    elements = {}
    focusedElement = nil
    hoveredElement = nil
end

-- 键盘输入处理
function UIManager.keypressed(key)
    if not uiState.visible then return end

    -- 处理模态窗口
    if #uiState.modalStack > 0 then
        local modal = uiState.modalStack[#uiState.modalStack]
        if modal.keypressed then
            modal:keypressed(key)
        end
        return
    end

    -- 传递给焦点元素
    if focusedElement and focusedElement.keypressed then
        focusedElement:keypressed(key)
    end

    -- Tab键切换焦点
    if key == "tab" then
        UIManager.nextFocus()
    end
end

-- 鼠标输入处理
function UIManager.mousepressed(x, y, button)
    if not uiState.visible then return end

    -- 检查点击了哪个元素
    local clickedElement = nil
    for i = #elements, 1, -1 do  -- 倒序检查，后绘制的在上面
        local e = elements[i]
        if e.visible ~= false and e.contains and e:contains(x, y) then
            clickedElement = e
            break
        end
    end

    -- 设置焦点
    if clickedElement then
        UIManager.setFocus(clickedElement)
        if clickedElement.mousepressed then
            clickedElement:mousepressed(x, y, button)
        end
    else
        UIManager.setFocus(nil)
    end
end

function UIManager.mousereleased(x, y, button)
    if not uiState.visible then return end

    -- 传递给焦点元素
    if focusedElement and focusedElement.mousereleased then
        focusedElement:mousereleased(x, y, button)
    end
end

function UIManager.mousemoved(x, y)
    if not uiState.visible then return end

    -- 更新悬停状态
    local newHover = nil
    for i = #elements, 1, -1 do
        local e = elements[i]
        if e.visible ~= false and e.contains and e:contains(x, y) then
            newHover = e
            break
        end
    end

    -- 触发hover事件
    if newHover ~= hoveredElement then
        if hoveredElement and hoveredElement.onMouseLeave then
            hoveredElement:onMouseLeave()
        end
        if newHover and newHover.onMouseEnter then
            newHover:onMouseEnter()
        end
        hoveredElement = newHover
    end

    -- 传递给焦点元素
    if focusedElement and focusedElement.mousemoved then
        focusedElement:mousemoved(x, y)
    end
end

-- 焦点管理
function UIManager.setFocus(element)
    if focusedElement == element then return end

    -- 通知旧焦点失去焦点
    if focusedElement and focusedElement.onBlur then
        focusedElement:onBlur()
    end

    focusedElement = element

    -- 通知新焦点获得焦点
    if focusedElement and focusedElement.onFocus then
        focusedElement:onFocus()
    end
end

function UIManager.nextFocus()
    if #elements == 0 then return end

    local currentIndex = 0
    for i, e in ipairs(elements) do
        if e == focusedElement then
            currentIndex = i
            break
        end
    end

    local nextIndex = currentIndex + 1
    if nextIndex > #elements then
        nextIndex = 1
    end

    UIManager.setFocus(elements[nextIndex])
end

-- 模态窗口管理
function UIManager.pushModal(modal)
    table.insert(uiState.modalStack, modal)
    uiState.modal = true
end

function UIManager.popModal()
    if #uiState.modalStack > 0 then
        table.remove(uiState.modalStack)
    end
    uiState.modal = #uiState.modalStack > 0
end

-- 获取/设置UI可见性
function UIManager.setVisible(visible)
    uiState.visible = visible
end

function UIManager.isVisible()
    return uiState.visible
end

-- 获取全局状态
function DialogueSystem.getState()
    return state
end

-- 设置速度
function DialogueSystem.setSpeed(speed)
    state.speed = speed
end

return UIManager
