---
name: naming-conventions
description: 团队约定的 Node.js (JavaScript/TypeScript) 与 Java 通用代码命名规范。**任何时候**为本团队/项目编写、审查、重构 Node.js 或 Java 代码时都必须使用，包括但不限于：声明变量/常量/布尔值、定义函数或方法、命名类与接口、创建源代码文件。即使用户没有明确提到"命名规范"或"代码规范"，只要在写或改这两种语言的代码就要套用这套规则。
---

# 命名规范（Node.js & Java 通用）

本规范覆盖 Node.js（JavaScript / TypeScript）与 Java。**多数规则两种语言通用**，少数语言特有的差异在条目末尾用 ⚠️ 标注。

写代码前先按这个顺序自检：变量 → 函数/方法 → 类/接口 → 文件名。缩写词大小写（见第 5 节）贯穿所有元素。

## 语言差异速览（最容易踩坑）

| 项目 | Node (JS/TS) | Java |
|---|---|---|
| 私有方法前缀 | `_` 前缀（如 `_validateInput`） | **不加**前缀，仅用 `private` 关键字 |
| 文件名 | `kebab-case` + 后缀 或 `PascalCase` | **必须**与 public 类名完全一致 |

其余规则两种语言一致。

---

## 1. 变量命名

### 1.1 一般变量：`camelCase`

小写字母开头，多单词驼峰拼接。

```typescript
// Node
const userName = "John";
let userAge = 25;
```

```java
// Java
String userName = "John";
int userAge = 25;
```

### 1.2 常量：`UPPER_SNAKE_CASE`

全大写 + 下划线分隔，仅用于**真正不变**的值。

```typescript
// Node
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
```

```java
// Java
public static final int MAX_RETRY_COUNT = 3;
public static final long DEFAULT_TIMEOUT_MS = 5000L;
```

> Node 里只有"真正不变的字面量"才用全大写；像 `const user = fetchUser()` 这种引用绑定仍然用 camelCase。

### 1.3 布尔变量：以 `is` / `has` / `should` 开头

读起来像一个判断句。

```typescript
// Node
const isActive = true;
const hasPermission = false;
const shouldRetry = true;
```

```java
// Java —— 字段同理；getter 跟着叫 isActive()，不要写成 getActive()
private boolean isActive = true;
private boolean hasPermission = false;
```

### 1.4 集合 / 数组：用复数名词

存放多个元素的变量用复数，读代码时一眼能看出它是集合。

```typescript
// Node
const users = await fetchUsers();
const orderIds = orders.map((o) => o.id);
```

```java
// Java
List<User> users = fetchUsers();
Set<Long> orderIds = new HashSet<>();
```

> 需要强调底层数据结构时可加后缀（`userList`、`idSet`），但默认优先用复数名词。

---

## 2. 函数 / 方法命名

### 2.1 动词 + 名词组合

函数名直接说明"它做了什么"。

```typescript
// Node
function getUserById(id: number): User { /* ... */ }
function calculateTotalPrice(items: Item[]): number { /* ... */ }
function sendNotification(userId: number, message: string): void { /* ... */ }
```

```java
// Java
public User getUserById(long id) { /* ... */ }
public BigDecimal calculateTotalPrice(List<Item> items) { /* ... */ }
public void sendNotification(long userId, String message) { /* ... */ }
```

常用动词参考：`get` / `set` / `fetch` / `create` / `update` / `delete` / `validate` / `parse` / `format` / `handle` / `build`。

### 2.2 私有方法 ⚠️ 两种语言不同

**Node (JS/TS)**：以 `_` 开头。TS 里同时加 `private` 修饰符。

```typescript
class UserService {
  private _validateInput(input: string): void { /* ... */ }
}
```

**Java**：**不要**加 `_` 前缀，**只用** `private` 关键字。Java 社区不接受下划线前缀的方法名。

```java
public class UserService {
    private void validateInput(String input) { /* ... */ }
}
```

---

## 3. 类与接口命名

### 3.1 类：`PascalCase`

每个单词首字母大写。描述具体实体（`User`、`Order`）或行为载体（`UserService`、`OrderValidator`）。

```typescript
// Node
class UserService { /* ... */ }
class OrderValidator { /* ... */ }
```

```java
// Java
public class UserService { /* ... */ }
public class OrderValidator { /* ... */ }
```

### 3.2 接口：`PascalCase`，无 `I` 前缀

接口名描述行为或结构本身。

```typescript
// Node
interface User {
  id: number;
  name: string;
}

interface UserRepository {
  findById(id: number): Promise<User | null>;
}
```

```java
// Java
public interface User {
    long getId();
    String getName();
}

public interface UserRepository {
    Optional<User> findById(long id);
}
```

> 若现有项目中已存在大量 `IXxx` 风格的 Java 接口，**保持与既有代码一致**，统一改造时再过渡到新风格。

---

## 4. 文件 / 模块命名 ⚠️ 两种语言不同

### 4.1 Node (JS/TS)

文件名用 **`kebab-case` + 功能后缀**，或主导出类用 **`PascalCase`**：

```
user.controller.ts        // 控制器
auth.module.ts            // 模块
order.service.ts          // 服务
user-repository.ts        // 仓储（多单词用 kebab-case）
UserEntity.ts             // 主要导出一个同名类时，文件名与类同名
```

选择原则：
- 文件主要导出**一个同名类**（entity、DTO 等） → `PascalCase` 与类名一致
- 文件按**功能/层次组织**（controller、service、module 等） → `kebab-case` 加后缀

### 4.2 Java

文件名**必须**与文件内 `public` 类/接口名完全一致（PascalCase），扩展名 `.java`。这是编译器强制要求，不是风格选择。

```
UserService.java          // 内含 public class UserService
UserController.java       // 内含 public class UserController
UserRepository.java       // 内含 public interface UserRepository
User.java                 // 内含 public class User
```

包名全小写，单词之间**不加**分隔符或下划线：

```
com.example.project.user.service
com.example.project.order.repository
```

---

## 5. 缩写词 / 首字母缩略词

`ID`、`URL`、`HTTP`、`API`、`DB` 等缩写词一律**当作普通单词**处理：只大写首字母，其余小写，**不要**整体大写。这条规则贯穿变量、函数、类、文件名。

```typescript
// Node
const userId = 1;                 // ✅ 不是 userID
const httpClient = createClient(); // ✅ 不是 HTTPClient
function parseUrl(raw: string): URL { /* ... */ }  // ✅ 不是 parseURL
class HttpRequest { /* ... */ }    // ✅ 不是 HTTPRequest
```

```java
// Java
long userId = 1L;                 // ✅ 不是 userID
HttpClient httpClient;            // ✅ 不是 HTTPClient
void parseUrl(String raw) { /* ... */ }
public class HttpRequest { /* ... */ }  // 文件名同为 HttpRequest.java
```

> 唯一例外：缩写词出现在常量里时，跟随 `UPPER_SNAKE_CASE`，如 `DEFAULT_API_TIMEOUT_MS`、`MAX_URL_LENGTH`。

---

## 速查表

| 元素 | 风格 | Node | Java |
|---|---|---|---|
| 变量 | `camelCase` | `userName` | `userName` |
| 常量 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` | `MAX_RETRY_COUNT` |
| 布尔 | `is/has/should` 前缀 | `isActive` | `isActive` |
| 集合/数组 | 复数名词 | `users` | `users` |
| 函数/方法 | 动词+名词 `camelCase` | `getUserById` | `getUserById` |
| 私有方法 | ⚠️ | `_validateInput` | `validateInput` |
| 类 | `PascalCase` | `UserService` | `UserService` |
| 接口 | `PascalCase`，无 `I` 前缀 | `UserRepository` | `UserRepository` |
| 文件名 | ⚠️ | `user.controller.ts` | `UserController.java` |
| 包/目录 | — | 团队约定 | `com.example.user`（全小写） |
| 缩写词 | 仅首字母大写 | `userId` `httpClient` | `userId` `httpClient` |

---

## 代码生成/审查时的自检清单

应用本规范后，逐项确认：

1. ☐ 所有变量是 `camelCase`，所有常量是 `UPPER_SNAKE_CASE`
2. ☐ 布尔变量/字段/方法以 `is` / `has` / `should` 开头
3. ☐ 函数/方法是"动词+名词"组合，名字本身能说明做什么
4. ☐ 私有方法的下划线前缀**只**用在 Node 代码里
5. ☐ 类和接口都是 `PascalCase`，接口没有 `I` 前缀
6. ☐ Java 文件名与 public 类名完全一致
7. ☐ Node 文件名符合 `kebab-case + 后缀` 或 `PascalCase` 规则
8. ☐ 集合/数组变量用复数名词（`users` 而非 `userList`，除非要强调结构）
9. ☐ 缩写词只大写首字母（`userId` 而非 `userID`，`HttpRequest` 而非 `HTTPRequest`）