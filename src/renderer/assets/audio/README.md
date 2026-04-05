# 音频资源目录

将游戏音频文件放在此目录下。

## 目录结构

```
audio/
├── bgm/          # 背景音乐
├── sfx/          # 音效
└── ambience/     # 环境音
```

## 支持的格式

- MP3
- OGG
- WAV
- WebM

## 在剧本中使用

在剧本的 `scene` 中添加 `bgm` 或 `ambience` 字段：

```json
{
  "scenes": [
    {
      "id": "scene_1",
      "name": "便利店",
      "bgm": "assets/audio/bgm/cozy-night.mp3",
      "ambience": "assets/audio/ambience/rain-loop.ogg",
      "dialogues": [...]
    }
  ]
}
```

## 音频来源建议

- [Freesound](https://freesound.org/) - 免费音效库
- [Incompetech](https://incompetech.com/music/royalty-free/) - 免费背景音乐
- [OpenGameArt](https://opengameart.org/) - 游戏音频资源
- 使用 AI 音乐生成工具（如 Suno、Udio）
