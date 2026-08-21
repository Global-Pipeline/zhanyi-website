# 展益 GitHub Pages 静态独立站

这是东莞市展益五金制品有限公司国际站的纯静态版本。运行时只有 HTML、CSS、JavaScript、JSON 和图片，可直接部署到 GitHub Pages，不依赖 Node 服务、数据库或管理后台。

原有完整前后端项目不会被该目录覆盖；本目录是一套独立交付物。

## 已包含

- 英文与中文双语网站
- 首页轮播、移动菜单、产品筛选和搜索
- 24 个产品及独立详情页
- 4 篇 Insights 及独立文章页
- 产品图片灯箱、前进后退和 URL 状态恢复
- Formspree 邮件询盘、电话、WhatsApp 和结构化项目询价
- 图纸文件名整理与邮件回复 / WhatsApp 手动附件提示
- 网页内直接嵌入的百度交互地图
- 百度地图加载失败时的 Leaflet 国际地图降级
- Sitemap、robots、Canonical、Open Graph 和双语 alternate
- GitHub Actions 自动构建和发布
- 自定义域名、GA4 和 Microsoft Clarity 配置入口

## 本地检查

要求 Node.js 18 或更高版本。

```powershell
npm run check
npm run preview
```

本地预览地址：

`http://127.0.0.1:4180/`

最终静态文件位于 `dist/`。

## Vercel 自动部署

仓库已包含 `vercel.json`，Vercel 会自动执行 `npm run build` 并发布 `dist/`，不需要手动填写 Framework Preset、Build Command 或 Output Directory。

在 Vercel 导入本 GitHub 仓库后，后续推送到 `main` 会自动触发生产构建。构建器会自动使用 Vercel 提供的生产域名生成 Canonical、Sitemap 和 Open Graph URL；如需固定为自定义域名，可在 Vercel 项目的 Environment Variables 中设置 `SITE_URL`（完整网址）或 `CUSTOM_DOMAIN`（仅域名）。

## 直接上传 GitHub

1. 在 GitHub 创建一个空仓库。
2. 把本目录中的全部文件上传到仓库根目录。
3. 仓库默认分支使用 `main`。
4. 打开 `Settings → Pages`。
5. 在 `Build and deployment` 中选择 `GitHub Actions`。
6. 推送完成后，工作流会自动执行 `npm run check`、生成 `dist` 并发布。

不需要上传父目录中的原全栈项目，也不要把管理员密码、邮箱 SMTP 密码或其他私密密钥放进静态仓库。

## 映射自定义域名

推荐以 `www.example.com` 作为正式主域名。

在 GitHub 仓库的 `Settings → Secrets and variables → Actions → Variables` 添加：

- `SITE_URL`：完整正式地址，例如 `https://www.example.com`
- `CUSTOM_DOMAIN`：只填域名，例如 `www.example.com`

重新运行 Pages 工作流后，构建产物会包含正确的 Canonical、Sitemap 和 `CNAME`。

随后在域名服务商添加 DNS：

- `www` 子域名：CNAME 指向 `你的GitHub用户名.github.io`
- 根域名：使用域名服务商的 ALIAS/ANAME，或按 GitHub Pages 当前官方文档添加 A 记录

最后回到 GitHub Pages 设置确认自定义域名并开启 `Enforce HTTPS`。

## 百度地图

默认模式为 `baidu-embed`，百度地图直接显示在联系页面内部，不需要客户先点击外部按钮，也不需要 AK。

地图支持百度页面本身提供的拖拽、缩放、地点查看和路线入口。页面上的“使用百度地图规划路线”只是辅助入口。

当前标记使用登记地址区域坐标：

- 纬度：`22.994420`
- 经度：`113.926813`
- 状态：`region_level`

该标记不能描述为已核实厂门入口。获得现场定位后，修改 `src/data/settings.json` 中的经纬度与 `mapStatus`，再执行 `npm run build`。

如需改用百度 JavaScript API，在 `src/data/settings.json` 中把 `mapProvider` 改为 `baidu` 并填写 `baiduMapAk`。静态网页中的 AK 对访客可见，必须在百度地图控制台设置 Referer 域名白名单。

## Formspree 询价与私域引流

GitHub Pages 本身不保存询盘、账号、私有附件或管理员会话。当前网站使用 Formspree 表单 `xbgrpbkd` 接收项目资料，并保留 WhatsApp 与复制询价内容作为备用方式：

1. 客户填写项目资料。
2. 前端完成必填项和文件类型检查。
3. 表单通过 AJAX 提交到 Formspree，页面内显示成功或错误状态。
4. 所选图纸的文件名随询盘提交，实际文件不上传到 Formspree。
5. 客户可回复通知邮件，或通过 `+86 132 3832 3259` 的 WhatsApp 补充发送图纸。

“复制询价内容”可用于微信、邮件或其他私域工具。页面会明确说明实际图纸尚未上传或存储。

Formspree 表单 ID 位于 `src/data/settings.json` 的 `formspreeFormId`。构建页固定加载 `@formspree/ajax@1.1.5`，不需要安装前端依赖。

## 更新产品和内容

- 产品：`src/data/products.json`
- 页面和文章：`src/data/site-content.json`
- 公司、电话和地图：`src/data/settings.json`
- 图片：`src/assets/`

修改后执行：

```powershell
npm run check
git add .
git commit -m "Update website content"
git push
```

GitHub Actions 会自动重新构建并上线。

## 可选统计

在 GitHub Actions Variables 中配置：

- `GOOGLE_ANALYTICS_ID`
- `CLARITY_ID`

留空时网站不会加载第三方统计脚本。
