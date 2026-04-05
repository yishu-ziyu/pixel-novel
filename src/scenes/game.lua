-- scenes/game.lua
-- 游戏主场景

local game = {
    name = "game",
}

-- 子系统引用
local DialogueSystem = nil
local SceneManager = nil

-- 场景状态
local state = {
    -- 游戏数据
    gameData = nil,

    -- 当前房间/场景
    currentRoom = nil,

    -- 玩家状态
    player = {
        x = 0,
        y = 0,
        inventory = {},
    },

    -- 相机
    camera = {
        x = 0,
        y = 0,
    },

    -- 游戏标志/变量
    flags = {},

    -- 交互对象
    interactables = {},
}

-- 初始化
function game.onEnter(params)
    print("进入游戏场景")
    params = params or {}

    -- 获取子系统引用
    DialogueSystem = require("src.systems.DialogueSystem")
    SceneManager = require("src.core.SceneManager")

    -- 新游戏或继续
    if params.newGame then
        game.startNewGame()
    elseif params.continue then
        game.loadGame()
    else
        -- 默认开始新游戏
        game.startNewGame()
    end
end

function game.onExit()
    print("离开游戏场景")
    -- 自动保存
    game.autoSave()
end

-- 开始新游戏
function game.startNewGame()
    print("开始新游戏")

    -- 重置状态
    state.player.inventory = {}
    state.flags = {}
    state.interactables = {}

    -- 加载示例游戏数据
    game.loadSampleGameData()

    -- 显示开场对话
    game.showOpeningDialogue()
end

-- 加载游戏
function game.loadGame()
    print("加载游戏存档")
    -- TODO: 实现存档加载
    game.startNewGame()  -- 临时：加载失败则开始新游戏
end

-- 自动保存
function game.autoSave()
    print("自动保存游戏")
    -- TODO: 实现自动保存
end

-- 快速保存/加载
function game.quickSave()
    print("快速保存")
    -- TODO: 实现快速保存
end

function game.quickLoad()
    print("快速加载")
    -- TODO: 实现快速加载
end

-- 加载示例游戏数据
function game.loadSampleGameData()
    state.gameData = {
        title = "雨夜迷案",
        rooms = {
            {
                id = "study",
                name = "书房",
                description = "昏暗的书房，落地窗外是暴雨...",
                background = "study_rainy",
                interactables = {
                    { id = "desk", name = "书桌", x = 120, y = 100, w = 60, h = 40 },
                    { id = "bookshelf", name = "书架", x = 20, y = 60, w = 40, h = 80 },
                    { id = "window", name = "窗户", x = 200, y = 50, w = 80, h = 60 },
                }
            }
        },
        characters = {
            {
                id = "detective",
                name = "侦探",
                color = GameConfig.COLORS.blue,
            },
            {
                id = "narrator",
                name = nil,  -- 旁白
                color = GameConfig.COLORS.white,
            }
        }
    }

    -- 设置初始房间
    state.currentRoom = state.gameData.rooms[1]
end

-- 显示开场对话
function game.showOpeningDialogue()
    local openingDialogue = {
        lines = {
            {
                text = "雨夜。雷声轰鸣。",
                speaker = nil,  -- 旁白
            },
            {
                text = "你站在一座古老庄园的门前，雨水顺着帽檐滴落。",
                speaker = nil,
            },
            {
                text = "委托人说这里有离奇的案件...",
                speaker = nil,
            },
            {
                text = "让我们开始调查吧。",
                speaker = "侦探",
                choices = {
                    {
                        text = "进入书房",
                        action = function()
                            game.enterRoom("study")
                        end
                    },
                    {
                        text = "先查看一下周围",
                        action = function()
                            game.showNarration("周围一片漆黑，只有门廊的灯微弱地亮着...")
                        end
                    }
                }
            }
        }
    }

    DialogueSystem.startDialogue(openingDialogue)
end

-- 进入房间
function game.enterRoom(roomId)
    print("进入房间: " .. roomId)

    -- 查找房间
    for _, room in ipairs(state.gameData.rooms) do
        if room.id == roomId then
            state.currentRoom = room
            break
        end
    end

    -- 显示房间描述
    if state.currentRoom then
        game.showNarration("进入了" .. state.currentRoom.name .. "。" .. state.currentRoom.description)
    end
end

-- 显示旁白
function game.showNarration(text)
    DialogueSystem.startDialogue({
        lines = { { text = text, speaker = nil } }
    })
end

-- 调查物品
function game.investigate(itemId)
    print("调查物品: " .. itemId)

    -- 根据物品ID显示不同的调查结果
    local investigations = {
        desk = {
            text = "书桌上散落着一些文件。其中一份引起了你的注意——这是一份遗嘱，签署日期是三天前。",
            clue = "遗嘱"
        },
        bookshelf = {
            text = "书架上大多是法律书籍。有一本书明显比其他的要新，似乎经常被翻阅。",
            clue = nil
        },
        window = {
            text = "雨水敲打着窗户。窗外是漆黑的夜色，但隐约可以看到花园里有脚印的痕迹。",
            clue = "窗外脚印"
        }
    }

    local investigation = investigations[itemId]
    if investigation then
        -- 添加线索到玩家收集的线索中
        if investigation.clue then
            table.insert(GameState.clues, investigation.clue)
            print("获得线索: " .. investigation.clue)
        end

        -- 显示调查结果
        game.showNarration(investigation.text)
    end
end

-- 更新
function game.update(dt)
    -- 游戏逻辑更新
end

-- 绘制
function game.draw()
    -- 绘制房间背景
    if state.currentRoom then
        -- 绘制背景色
        love.graphics.setColor(GameConfig.COLORS.dark_blue)
        love.graphics.rectangle("fill", 0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT)

        -- 绘制房间名称
        love.graphics.setColor(GameConfig.COLORS.light_gray)
        love.graphics.print(state.currentRoom.name, 4, 4)

        -- 绘制可互动物品 (调试用，实际游戏中可能是隐藏的)
        if state.currentRoom.interactables then
            for _, item in ipairs(state.currentRoom.interactables) do
                -- 绘制交互区域 (调试用)
                love.graphics.setColor(1, 1, 1, 0.1)
                love.graphics.rectangle("line", item.x, item.y, item.w, item.h)

                -- 绘制物品名称
                love.graphics.setColor(GameConfig.COLORS.light_gray)
                love.graphics.print(item.name, item.x, item.y - 10)
            end
        end
    else
        -- 没有当前房间，绘制默认背景
        love.graphics.setColor(GameConfig.COLORS.black)
        love.graphics.rectangle("fill", 0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT)
    end

    love.graphics.setColor(1, 1, 1)
end

-- 输入处理
function game.keypressed(key)
    -- 游戏特定的按键处理
end

function game.mousepressed(x, y, button)
    if button ~= 1 then return end

    -- 检查是否点击了可互动物品
    if state.currentRoom and state.currentRoom.interactables then
        for _, item in ipairs(state.currentRoom.interactables) do
            if x >= item.x and x <= item.x + item.w and
               y >= item.y and y <= item.y + item.h then
                -- 点击了物品
                game.investigate(item.id)
                return
            end
        end
    end
end

return game
