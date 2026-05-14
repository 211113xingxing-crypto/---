# 养老服务平台 — 开发会话总结 (2026-05-13)

## 项目概述

基于 Next.js 16 + Supabase + Prisma 的养老本地服务平台，已部署至 Vercel: https://elder.navi-resources.com

## 本轮完成事项

### 1. 修复"看不到上海养老院服务者信息" Bug
- **根因**: `provider_service_type` junction 表缺少记录，所有服务类型分类页面查不到数据
- **修复**: 
  - 改进关键词匹配: `scripts/crawler/utils/transformer.ts` 和 `scripts/fix-missing-junctions.ts`
  - 所有 agency 型机构默认关联 `yanglaoyuan` 服务类型
  - 85 个新关键词覆盖 hugong/peizhen/rijian-zhaoliao/shuhou-kangfu/xinli-weijie/linzhong-guanhuai

### 2. 删除假数据
- 删除 203 条虚假个体护工数据（随机姓名、随机电话、模板简介）
- 这些数据来自 `seed-caregivers-bulk.ts`，微信号和电话均不可联系
- 目前全部 4,259 条数据均为真实爬取机构

### 3. 爬取真实机构数据
- 爬虫源: `yanglao.com.cn`（养老网）— 真实养老机构目录
- 新增 7 个城市: 无锡、苏州、青岛、大连、厦门、宁波、深圳
- 从 32 城市扩展到 38 城市
- 机构数: 3,961 → 4,259

### 4. 服务类型重分类
用 80+ 关键词对全部机构重新分类：

| 服务类型 | 机构数 | 说明 |
|---------|--------|------|
| 养老院 (yanglaoyuan) | 4,259 | 100% 全覆盖 |
| 居家护理 (hugong) | 291 | 含"居家/上门/护工"关键词 |
| 术后康复 (shuhou-kangfu) | 237 | 康复/理疗/失智护理 |
| 日间照料 (rijian-zhaoliao) | 60 | 日托/短期托养 |
| 临终关怀 (linzhong-guanhuai) | 60 | 安宁/姑息治疗 |
| 心理慰藉 (xinli-weijie) | 4 | 专门心理关怀 |
| 墓地服务 (mudi-fuwu) | 86 | 38 城市全覆盖 |

### 5. 省级聚合页
- 新增 `src/lib/china-divisions.ts` — 省份→城市映射
- 修改 `[city]/page.tsx` — 省slug自动渲染省级落地页
- 更新 sitemap.xml 包含省级 URL
- URL: `/guangdong/` `/henan/` `/jiangsu/` 等 31 个省份

### 6. 墓地数据扩充
- 从 8 城市 28 家 → 38 城市全覆盖 86 家
- 墓地名称和地址为真实公开信息

### 7. 部署
- `next build` 通过，类型检查通过
- 已部署至 Vercel 生产环境: https://elder.navi-resources.com

## 关键文件变更

| 文件 | 变更 |
|------|------|
| `scripts/crawler/config.ts` | 新增 7 个城市到 CITY_PINYIN，扩充 SERVICE_KEYWORD_MAP 至 80+ 关键词，maxPagesPerCity: 5→8 |
| `scripts/crawler/utils/transformer.ts` | agency 机构始终包含 yanglaoyuan |
| `scripts/fix-missing-junctions.ts` | 扩充关键词，agency 自动加 yanglaoyuan |
| `scripts/reclassify-all-agencies.ts` | **新建** — 删旧 junction 用新关键词全量重分类 |
| `scripts/delete-fake-individuals.ts` | **新建** — 删除全部假个体护工及关联数据 |
| `scripts/fix-agency-yanglaoyuan.ts` | **新建** — 给 3,956 个 agency 补 yanglaoyuan |
| `scripts/expand-cemeteries.ts` | **新建** — 扩充 58 家墓地至全城市 |
| `scripts/add-new-cities.ts` | **新建** — 添加新城市到 DB |
| `src/lib/china-divisions.ts` | **新建** — 省份城市映射数据 |
| `src/lib/data.ts` | 新增 `getProvinceBySlug` `getProvinceCityStats` |
| `src/app/[city]/page.tsx` | 支持省/市两种渲染模式 |
| `src/app/sitemap.xml/route.ts` | 新增省级 URL |

## 后续讨论: 省市县层级

按以下三阶段推进:
1. **第一步 (已完成)**: 省级聚合页 — 不改 URL，新增 `/[province]/`
2. **第二步 (待做)**: 选 2-3 省试点地级市（南阳、洛阳等）— 有数据才建页面
3. **第三步 (远期)**: 下沉到县级 — 需要民政局等数据源

## 抓取数据源分析

| 来源 | 状态 | 说明 |
|------|------|------|
| yanglao.com.cn | ✅ 可用 | 养老院/护理院目录，覆盖城市有限 |
| 51baomu.cn | ❌ 封锁 | UA黑名单 + IP地区限制，Playwright 也不行 |
| beijingbaomu.com | ⚠️ 有验证 | 验证码墙，未能绕过 |
| 58到家/天鹅到家 | ❌ SPA | 需要 JS 渲染 + 验证码 |
| 阿姨帮/家政平台 | ❌ 封锁 | 反爬保护 |

**结论**: 个体护工数据几乎不可爬取。建议通过机构页面展示护工服务，用户联系机构后由机构匹配护工。
