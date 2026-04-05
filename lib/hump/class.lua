-- hump.class
-- 简化的面向对象类实现

local class = {}

-- 创建一个新类
function class.new(name, super)
    local cls = {}
    cls.__name = name or "UnnamedClass"
    cls.__super = super
    cls.__index = cls

    -- 继承父类
    if super then
        setmetatable(cls, { __index = super })
    end

    -- 构造函数
    function cls.new(...)
        local instance = setmetatable({}, cls)
        if instance.init then
            instance:init(...)
        end
        return instance
    end

    -- 创建别名
    cls.create = cls.new

    return cls
end

-- 创建类的别名
setmetatable(class, {
    __call = function(_, ...)
        return class.new(...)
    end
})

return class
