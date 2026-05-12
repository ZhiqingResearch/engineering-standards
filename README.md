# 团队研发规范

供团队成员和 AI 助手（Claude）共同遵循的研发规范集合。每条规范都打包为 [Claude skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)，安装后 Claude 写代码时会自动遵循。

## 包含的规范

| 规范 | 适用范围 | 状态 |
|---|---|---|
| [naming-conventions](./naming-conventions/) | Node.js & Java 通用命名规范 | ✅ 可用 |

> 规划中：MySQL 设计规范、API 设计规范、Git commit 格式、错误处理 / 日志规范……欢迎补充。

---

## 如何使用

有两种方式，**优先选方式一**。

### 方式一：安装为 Claude Skill（推荐）

安装后，Claude 在编写、审查、重构对应语言的代码时会**自动**遵循规范，无需每次手动提醒。

1. clone 本仓库，或直接下载需要的 `.skill` 文件（如有提供）
2. 打开 [claude.ai](https://claude.ai) → **Settings** → **Capabilities** → **Skills**
3. 点击 **Upload skill**，选择对应的 `.skill` 文件上传
4. 安装完成，正常使用即可

如果只有 `SKILL.md` 源文件没有 `.skill` 包，需要先打包——让 Claude 帮你做：发一句"帮我把这个 skill 目录打包成 .skill 文件"并附上目录即可。

### 方式二：作为文档参考

直接阅读各目录下的 `SKILL.md`——它本身就是一份规范文档，适合在 code review、新人 onboarding 时引用。

---

## 触发机制说明

装好 skill 后，Claude **自动**判断什么时候该用，**不需要**你说"请使用 xxx skill"。

不过 Claude 偶尔会"少触发"，下面这些场景建议在 prompt 里明确提一句"**按团队规范写**"：

- **重要交付**：PR 提交前、客户可见的代码
- **长对话**：聊了几十轮之后，Claude 注意力会衰减——重要任务建议**开新对话**
- **极简任务**："改一下这个变量名" 这种一句话任务可能跳过 skill

想确认是否生效：直接问 Claude "你刚才用了 naming-conventions 这个 skill 吗？"

---

## 目录结构

```
.
├── README.md                    ← 你正在看的文件
└── naming-conventions/          ← 一条规范 = 一个目录
    └── SKILL.md                 ← skill 主文件（文件名必须是这个）
```

每条新规范按相同结构组织：一个目录，里面放 `SKILL.md`。如有补充材料（示例代码、参考文档），同目录追加 `references/`、`examples/` 等子目录即可。

---

## 添加新规范

1. 在仓库根目录新建 `<规范名>/` 目录（kebab-case，如 `mysql-design`）
2. 目录内创建 `SKILL.md`，参考 [`naming-conventions/SKILL.md`](./naming-conventions/SKILL.md) 的格式
3. `SKILL.md` 头部需要 YAML 元数据：

   ```yaml
   ---
   name: <skill-name>
   description: <什么时候触发、做什么。建议写得"啰嗦"一点，对抗 Claude 少触发的倾向>
   ---
   ```

4. 在本 README 的"包含的规范"表格里登记
5. 提 PR

`description` 的写法很关键——它是 Claude 判断"要不要用这个 skill"的唯一依据。务必包含：
- 这条规范**适用于什么场景**（具体的关键词，比如"写 SQL"、"设计表结构"）
- **强调"必须使用"**，即使用户没有明确提到"规范"二字

可参考 `naming-conventions/SKILL.md` 的 description 写法。