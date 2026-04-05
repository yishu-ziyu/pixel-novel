-- InventorySystem.lua
-- 物品栏系统 - 管理玩家收集的物品

local InventorySystem = {}

-- 物品定义
local itemDefinitions = {
    -- 调查类物品
    clue_letter = {
        id = "clue_letter",
        name = "神秘信件",
        description = "一封没有署名的信，字迹潦草。",
        icon = "letter",
        category = "clue",
        usable = true,
        combinable = false,
    },
    key_study = {
        id = "key_study",
        name = "书房钥匙",
        description = "一把古铜色的钥匙，上面刻着书房字样。",
        icon = "key",
        category = "key",
        usable = true,
        combinable = false,
    },
    photo_old = {
        id = "photo_old",
        name = "旧照片",
        description = "一张泛黄的照片，上面有几个人站在一起。",
        icon = "photo",
        category = "clue",
        usable = true,
        combinable = true,
        combineTarget = "photo_frame",
    },
    photo_frame = {
        id = "photo_frame",
        name = "相框",
        description = "一个空的相框，看起来需要放入一张照片。",
        icon = "frame",
        category = "misc",
        usable = false,
        combinable = true,
        combineTarget = "photo_old",
    },
    -- 工具类物品
    flashlight = {
        id = "flashlight",
        name = "手电筒",
        description = "一支老旧的手电筒，电池还剩一些电量。",
        icon = "flashlight",
        category = "tool",
        usable = true,
        combinable = false,
    },
    matches = {
        id = "matches",
        name = "火柴",
        description = "一盒火柴，还有几根。",
        icon = "matches",
        category = "tool",
        usable = true,
        combinable = true,
        combineTarget = "candle",
    },
    candle = {
        id = "candle",
        name = "蜡烛",
        description = "一支未点燃的白色蜡烛。",
        icon = "candle",
        category = "misc",
        usable = false,
        combinable = true,
        combineTarget = "matches",
    },
}

-- 玩家库存
local inventory = {
    items = {},  -- { itemId = quantity }
    maxSlots = 20,  -- 最大槽位数
    equipped = {},  -- 装备的物品
}

-- 组合配方
local recipes = {
    -- 照片 + 相框 = 装框照片
    {
        ingredients = { "photo_old", "photo_frame" },
        result = {
            id = "photo_framed",
            name = "装框照片",
            description = "一张放入相框的照片，可以挂在墙上了。",
            icon = "photo_framed",
            category = "clue",
        },
        consumeIngredients = true,
    },
    -- 火柴 + 蜡烛 = 点燃的蜡烛
    {
        ingredients = { "matches", "candle" },
        result = {
            id = "candle_lit",
            name = "点燃的蜡烛",
            description = "一支燃烧的蜡烛，发出温暖的光芒。",
            icon = "candle_lit",
            category = "tool",
            usable = true,
        },
        consumeIngredients = true,
    },
}

-- 初始化
function InventorySystem.init()
    print("InventorySystem 初始化完成")
    InventorySystem.clear()
end

-- 清空库存
function InventorySystem.clear()
    inventory.items = {}
    inventory.equipped = {}
    print("库存已清空")
end

-- 添加物品
function InventorySystem.addItem(itemId, quantity)
    quantity = quantity or 1

    -- 检查物品定义是否存在
    if not itemDefinitions[itemId] then
        print("错误: 未知物品 " .. itemId)
        return false
    end

    -- 检查是否有足够空间
    if not InventorySystem.hasSpace() then
        print("错误: 库存已满")
        return false
    end

    -- 添加物品
    inventory.items[itemId] = (inventory.items[itemId] or 0) + quantity

    print("获得物品: " .. itemDefinitions[itemId].name .. " x" .. quantity)

    -- 触发事件
    -- EventBus.emit("inventory:add", itemId, quantity)

    return true
end

-- 移除物品
function InventorySystem.removeItem(itemId, quantity)
    quantity = quantity or 1

    -- 检查物品是否存在
    if not inventory.items[itemId] or inventory.items[itemId] < quantity then
        print("错误: 物品数量不足")
        return false
    end

    -- 移除物品
    inventory.items[itemId] = inventory.items[itemId] - quantity

    if inventory.items[itemId] <= 0 then
        inventory.items[itemId] = nil
        -- 如果物品已装备，取消装备
        if inventory.equipped[itemId] then
            inventory.equipped[itemId] = nil
        end
    end

    local itemName = itemDefinitions[itemId] and itemDefinitions[itemId].name or itemId
    print("失去物品: " .. itemName .. " x" .. quantity)

    -- 触发事件
    -- EventBus.emit("inventory:remove", itemId, quantity)

    return true
end

-- 检查是否拥有物品
function InventorySystem.hasItem(itemId, quantity)
    quantity = quantity or 1
    return inventory.items[itemId] and inventory.items[itemId] >= quantity
end

-- 获取物品数量
function InventorySystem.getItemCount(itemId)
    return inventory.items[itemId] or 0
end

-- 检查是否有足够空间
function InventorySystem.hasSpace()
    return InventorySystem.getItemCountTotal() < inventory.maxSlots
end

-- 获取物品总数
function InventorySystem.getItemCountTotal()
    local total = 0
    for _, count in pairs(inventory.items) do
        total = total + count
    end
    return total
end

-- 获取所有物品
function InventorySystem.getAllItems()
    local items = {}
    for itemId, quantity in pairs(inventory.items) do
        local definition = itemDefinitions[itemId]
        if definition then
            table.insert(items, {
                id = itemId,
                quantity = quantity,
                definition = definition,
            })
        end
    end
    return items
end

-- 使用物品
function InventorySystem.useItem(itemId, target)
    local definition = itemDefinitions[itemId]

    if not definition then
        print("错误: 未知物品")
        return false
    end

    if not InventorySystem.hasItem(itemId) then
        print("错误: 没有该物品")
        return false
    end

    if not definition.usable then
        print("错误: 该物品无法使用")
        return false
    end

    -- 执行使用效果
    print("使用物品: " .. definition.name)

    if definition.onUse then
        definition.onUse(target)
    end

    -- 如果物品是一次性的，移除它
    if definition.consumable then
        InventorySystem.removeItem(itemId, 1)
    end

    -- 触发事件
    -- EventBus.emit("inventory:use", itemId, target)

    return true
end

-- 组合物品
function InventorySystem.combineItems(itemId1, itemId2)
    -- 查找配方
    for _, recipe in ipairs(recipes) do
        local ingredients = recipe.ingredients

        -- 检查是否匹配
        if (ingredients[1] == itemId1 and ingredients[2] == itemId2) or
           (ingredients[1] == itemId2 and ingredients[2] == itemId1) then

            -- 检查是否拥有所有材料
            for _, ingredientId in ipairs(ingredients) do
                if not InventorySystem.hasItem(ingredientId) then
                    print("错误: 缺少材料 " .. ingredientId)
                    return false
                end
            end

            -- 消耗材料
            if recipe.consumeIngredients then
                for _, ingredientId in ipairs(ingredients) do
                    InventorySystem.removeItem(ingredientId, 1)
                end
            end

            -- 生成结果
            local result = recipe.result
            InventorySystem.addItem(result.id, 1)

            -- 临时添加物品定义
            if not itemDefinitions[result.id] then
                itemDefinitions[result.id] = result
            end

            print("合成成功: " .. result.name)

            -- 触发事件
            -- EventBus.emit("inventory:combine", itemId1, itemId2, result.id)

            return true
        end
    end

    print("错误: 没有找到匹配的配方")
    return false
end

-- 检查是否可以组合
function InventorySystem.canCombine(itemId1, itemId2)
    for _, recipe in ipairs(recipes) do
        local ingredients = recipe.ingredients
        if (ingredients[1] == itemId1 and ingredients[2] == itemId2) or
           (ingredients[1] == itemId2 and ingredients[2] == itemId1) then
            return true
        end
    end
    return false
end

-- 获取库存状态 (用于存档)
function InventorySystem.getState()
    return {
        items = inventory.items,
        equipped = inventory.equipped,
    }
end

-- 恢复库存状态 (用于读档)
function InventorySystem.setState(state)
    inventory.items = state.items or {}
    inventory.equipped = state.equipped or {}
end

-- 调试: 打印库存内容
function InventorySystem.debugPrint()
    print("=== 库存内容 ===")
    print("总槽位: " .. inventory.maxSlots)
    print("已使用: " .. InventorySystem.getItemCountTotal())
    print("物品列表:")
    for itemId, quantity in pairs(inventory.items) do
        local name = itemDefinitions[itemId] and itemDefinitions[itemId].name or itemId
        print("  - " .. name .. " x" .. quantity)
    end
    print("===============")
end

return InventorySystem
