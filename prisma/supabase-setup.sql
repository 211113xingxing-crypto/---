-- ============================================================
-- 养老本地服务平台 — Supabase 数据库初始化
-- 复制到 Supabase SQL Editor 执行：
-- https://supabase.com/dashboard/project/xcfwdwmqrdtchnckutoc/sql/new
-- ============================================================

-- ====== MIGRATION ======

CREATE SCHEMA IF NOT EXISTS "public";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE "ProviderType" AS ENUM ('individual', 'agency');
CREATE TYPE "ProviderStatus" AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" VARCHAR(20) NOT NULL,
    "parent_id" INTEGER,
    "slug" VARCHAR(100) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "geo_polygon" TEXT,
    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    CONSTRAINT "service_type_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "provider_service_type" (
    "provider_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,
    CONSTRAINT "provider_service_type_pkey" PRIMARY KEY ("provider_id","service_type_id")
);

CREATE TABLE "service_provider" (
    "id" SERIAL NOT NULL,
    "provider_type" "ProviderType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "wechat_id" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "bio" TEXT,
    "years_experience" INTEGER,
    "total_served" INTEGER NOT NULL DEFAULT 0,
    "avg_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address_text" VARCHAR(300),
    "district_id" INTEGER,
    "city_id" INTEGER NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'pending',
    "gender" VARCHAR(10),
    "age" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_provider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_listing" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "price_unit" VARCHAR(20),
    "price_note" VARCHAR(200),
    "is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_listing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "verify_type" VARCHAR(30) NOT NULL,
    "file_url" VARCHAR(500),
    "verify_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMP(3),
    "note" TEXT,
    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "provider_photo" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "caption" VARCHAR(200),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "provider_photo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "openid" VARCHAR(100),
    "nickname" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "phone" VARCHAR(20),
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_verified_booking" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favorite" (
    "user_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorite_pkey" PRIMARY KEY ("user_id","provider_id")
);

CREATE TABLE "contact_request" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "contact_type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contact_request_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");
CREATE INDEX "district_parent_id_idx" ON "district"("parent_id");
CREATE UNIQUE INDEX "district_city_id_slug_key" ON "district"("city_id", "slug");
CREATE UNIQUE INDEX "service_type_slug_key" ON "service_type"("slug");
CREATE UNIQUE INDEX "service_provider_slug_key" ON "service_provider"("slug");
CREATE INDEX "sp_city_status_idx" ON "service_provider"("city_id", "status");
CREATE INDEX "sp_district_rating_idx" ON "service_provider"("district_id", "avg_rating" DESC);
CREATE INDEX "sp_type_district_status_idx" ON "service_provider"("provider_type", "district_id", "status");
CREATE INDEX "sp_status_idx" ON "service_provider"("status");
CREATE INDEX "sl_provider_idx" ON "service_listing"("provider_id");
CREATE INDEX "sl_type_active_idx" ON "service_listing"("service_type_id", "is_active");
CREATE INDEX "verification_provider_idx" ON "verification"("provider_id");
CREATE INDEX "photo_provider_idx" ON "provider_photo"("provider_id");
CREATE UNIQUE INDEX "user_openid_key" ON "user"("openid");
CREATE INDEX "review_provider_created_idx" ON "review"("provider_id", "created_at" DESC);
CREATE INDEX "review_user_idx" ON "review"("user_id");
CREATE INDEX "contact_provider_created_idx" ON "contact_request"("provider_id", "created_at" DESC);

-- Foreign Keys
ALTER TABLE "district" ADD CONSTRAINT "district_parent_fkey" FOREIGN KEY ("parent_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "district" ADD CONSTRAINT "district_city_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "provider_service_type" ADD CONSTRAINT "pst_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "provider_service_type" ADD CONSTRAINT "pst_type_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_provider" ADD CONSTRAINT "sp_city_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_provider" ADD CONSTRAINT "sp_district_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "service_listing" ADD CONSTRAINT "sl_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "service_listing" ADD CONSTRAINT "sl_type_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification" ADD CONSTRAINT "verification_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "provider_photo" ADD CONSTRAINT "photo_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review" ADD CONSTRAINT "review_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "review" ADD CONSTRAINT "review_user_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contact_request" ADD CONSTRAINT "cr_provider_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contact_request" ADD CONSTRAINT "cr_user_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ====== SEED DATA ======

-- City
INSERT INTO "city" ("name", "slug", "lat", "lng") VALUES ('上海市', 'shanghai', 31.2304, 121.4737);

-- Service Types
INSERT INTO "service_type" ("name", "slug", "description") VALUES
  ('居家护理', 'hugong', '全天/半天居家照护、生活起居、康复训练、服药管理'),
  ('陪诊服务', 'peizhen', '医院陪诊、代取药、检查陪同、病历整理'),
  ('日间照料', 'rijian-zhaoliao', '日托服务、社区养老驿站、老年活动中心'),
  ('术后康复', 'shuhou-kangfu', '术后护理、康复指导、功能训练、营养支持'),
  ('心理慰藉', 'xinli-weijie', '老年陪伴、情绪疏导、认知训练');

-- Districts (16)
DO $$
DECLARE
  shanghai_id INT;
BEGIN
  SELECT id INTO shanghai_id FROM "city" WHERE slug = 'shanghai';

  INSERT INTO "district" ("city_id", "name", "slug", "level", "lat", "lng") VALUES
    (shanghai_id, '黄浦区', 'huangpu-qu', 'district', 31.2313, 121.4695),
    (shanghai_id, '徐汇区', 'xuhui-qu', 'district', 31.1886, 121.4365),
    (shanghai_id, '长宁区', 'changning-qu', 'district', 31.2204, 121.4232),
    (shanghai_id, '静安区', 'jingan-qu', 'district', 31.2284, 121.4491),
    (shanghai_id, '普陀区', 'putuo-qu', 'district', 31.2496, 121.3970),
    (shanghai_id, '虹口区', 'hongkou-qu', 'district', 31.2646, 121.5051),
    (shanghai_id, '杨浦区', 'yangpu-qu', 'district', 31.2595, 121.5257),
    (shanghai_id, '浦东新区', 'pudong-xinqu', 'district', 31.2213, 121.5447),
    (shanghai_id, '闵行区', 'minhang-qu', 'district', 31.1128, 121.3817),
    (shanghai_id, '宝山区', 'baoshan-qu', 'district', 31.4053, 121.4895),
    (shanghai_id, '嘉定区', 'jiading-qu', 'district', 31.3756, 121.2663),
    (shanghai_id, '松江区', 'songjiang-qu', 'district', 31.0322, 121.2277),
    (shanghai_id, '青浦区', 'qingpu-qu', 'district', 31.1507, 121.1242),
    (shanghai_id, '奉贤区', 'fengxian-qu', 'district', 30.9181, 121.4739),
    (shanghai_id, '金山区', 'jinshan-qu', 'district', 30.7412, 121.3423),
    (shanghai_id, '崇明区', 'chongming-qu', 'district', 31.6233, 121.3973);
END $$;

-- Sub-districts
DO $$
DECLARE
  c_id INT;
  d_id INT;
BEGIN
  SELECT id INTO c_id FROM "city" WHERE slug = 'shanghai';

  SELECT id INTO d_id FROM "district" WHERE slug = 'huangpu-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '南京东路街道', 'nanjingdonglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '外滩街道', 'waitan-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '豫园街道', 'yuyuan-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '老西门街道', 'laoximen-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'xuhui-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '徐家汇街道', 'xujiahui-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '天平路街道', 'tianpinglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '湖南路街道', 'hunanlu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '田林街道', 'tianlin-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'changning-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '华阳路街道', 'huayanglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '天山街道', 'tianshan-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '仙霞新村街道', 'xianxiaxincun-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '虹桥街道', 'hongqiao-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'jingan-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '静安寺街道', 'jingansi-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '南京西路街道', 'nanjingxilu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '石门二路街道', 'shimen-erlu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '江宁路街道', 'jiangninglu-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'pudong-xinqu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '陆家嘴街道', 'lujiazui-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '花木街道', 'huamu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '塘桥街道', 'tangqiao-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '金杨新村街道', 'jinyangxincun-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'hongkou-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '四川北路街道', 'sichuanbeilu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '欧阳路街道', 'ouyanglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '广中路街道', 'guangzhonglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '凉城新村街道', 'liangchengxincun-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'yangpu-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '五角场街道', 'wujiaochang-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '控江路街道', 'kongjianglu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '长白新村街道', 'changbaixincun-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '殷行街道', 'yinxing-jiedao', 'sub_district', d_id, 0, 0);

  SELECT id INTO d_id FROM "district" WHERE slug = 'putuo-qu';
  INSERT INTO "district" ("city_id", "name", "slug", "level", "parent_id", "lat", "lng") VALUES
    (c_id, '长寿路街道', 'changshoulu-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '曹杨新村街道', 'caoyangxincun-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '长风新村街道', 'changfengxincun-jiedao', 'sub_district', d_id, 0, 0),
    (c_id, '真如镇街道', 'zhenruzhen-jiedao', 'sub_district', d_id, 0, 0);
END $$;

-- Providers
DO $$
DECLARE
  sh_id INT;
  d_changning INT; d_jingan INT; d_pudong INT; d_xuhui INT;
  d_hongkou INT; d_yangpu INT; d_putuo INT; d_huangpu INT; d_minhang INT;
  st_hugong INT; st_peizhen INT; st_rijian INT; st_kangfu INT; st_xinli INT;
  p_id INT;
BEGIN
  SELECT id INTO sh_id FROM "city" WHERE slug = 'shanghai';
  SELECT id INTO d_changning FROM "district" WHERE slug = 'changning-qu';
  SELECT id INTO d_jingan FROM "district" WHERE slug = 'jingan-qu';
  SELECT id INTO d_pudong FROM "district" WHERE slug = 'pudong-xinqu';
  SELECT id INTO d_xuhui FROM "district" WHERE slug = 'xuhui-qu';
  SELECT id INTO d_hongkou FROM "district" WHERE slug = 'hongkou-qu';
  SELECT id INTO d_yangpu FROM "district" WHERE slug = 'yangpu-qu';
  SELECT id INTO d_putuo FROM "district" WHERE slug = 'putuo-qu';
  SELECT id INTO d_huangpu FROM "district" WHERE slug = 'huangpu-qu';
  SELECT id INTO d_minhang FROM "district" WHERE slug = 'minhang-qu';

  SELECT id INTO st_hugong FROM "service_type" WHERE slug = 'hugong';
  SELECT id INTO st_peizhen FROM "service_type" WHERE slug = 'peizhen';
  SELECT id INTO st_rijian FROM "service_type" WHERE slug = 'rijian-zhaoliao';
  SELECT id INTO st_kangfu FROM "service_type" WHERE slug = 'shuhou-kangfu';
  SELECT id INTO st_xinli FROM "service_type" WHERE slug = 'xinli-weijie';

  -- 王阿姨 (长宁)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '王阿姨', 'wang-ayi-changning', '13812346789', 'wang_ayi_care', '10年居家养老护理经验，曾在三甲医院老年科工作3年。擅长术后康复护理和失能老人日常照护，尤其对髋关节/膝关节术后康复有丰富经验。性格温和有耐心，深受老人和家属信赖。持有高级养老护理员证书和红十字会急救证。', 10, true, 31.216, 121.406, '上海市长宁区天山街道', d_changning, sh_id, 'active', '女', 52, 4.8, 3)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_kangfu);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '24小时住家护理', 200, 'day'),
    (p_id, st_hugong, '半天居家照护', '8小时日间照护', 120, 'day'),
    (p_id, st_kangfu, '术后康复护理', '专业康复指导和训练', 250, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now()),
    (p_id, 'health_cert', 'approved', now()), (p_id, 'background_check', 'approved', now());

  -- 李叔叔 (静安)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '李叔叔', 'li-shushu-jingan', '13912348901', 'li_care_giver', '8年养老陪护经验，曾照顾过多位失智老人。擅长阿尔茨海默症老人的日常照护和情绪安抚。有耐心、力气大，可以协助行动不便的老人转移和外出。', 8, true, 31.228, 121.453, '上海市静安区南京西路街道', d_jingan, sh_id, 'active', '男', 55, 4.6, 1)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '24小时住家护理', 220, 'day'),
    (p_id, st_peizhen, '医院陪诊', '陪同就医、取药、检查', 150, 'per_visit');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now()), (p_id, 'health_cert', 'approved', now());

  -- 张阿姨 (浦东)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '张阿姨', 'zhang-ayi-pudong', '13712343456', 'zhang_nurse_pd', '12年专业养老护理经验，原华山医院老年科护士。擅长各类慢性病老人护理，包括高血压、糖尿病、中风后遗症的日常管理。能够进行生命体征监测、胰岛素注射等基础医疗操作。', 12, true, 31.235, 121.519, '上海市浦东新区陆家嘴街道', d_pudong, sh_id, 'active', '女', 48, 4.9, 1)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen), (p_id, st_kangfu), (p_id, st_rijian);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '含基础医疗监测', 280, 'day'),
    (p_id, st_peizhen, '医院陪诊', '专业护士全程陪同', 200, 'per_visit'),
    (p_id, st_kangfu, '术后康复护理', '中风后遗症康复', 300, 'day'),
    (p_id, st_rijian, '日间照料', '8小时日间照护', 180, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now()),
    (p_id, 'health_cert', 'approved', now()), (p_id, 'background_check', 'approved', now());

  -- 安康护理站 (浦东)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "avg_rating", "review_count")
  VALUES ('agency', '安康护理站', 'ankang-huli-pudong', '021-50808888', 'ankang_care_center', '安康护理站是经上海市卫健委批准设立的专业社区护理机构，拥有20余名持证护工和护士。提供从日常照护到专业医疗护理的全方位服务。', true, 31.211, 121.548, '上海市浦东新区花木街道', d_pudong, sh_id, 'active', 4.5, 1)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen), (p_id, st_rijian);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '24小时住家护理', 250, 'day'),
    (p_id, st_peizhen, '医院陪诊', '陪同就医、取药', 180, 'per_visit'),
    (p_id, st_rijian, '日间照料', '8小时日托，含午餐和活动', 150, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now());

  -- 赵阿姨 (徐汇)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '赵阿姨', 'zhao-ayi-xuhui', '13612347890', 'zhao_care_xh', '6年居家养老服务经验，性格开朗，擅长与老人沟通。主要服务生活半自理老人，提供日间照护、做饭、打扫、陪伴聊天、陪同散步等。', 6, true, 31.168, 121.430, '上海市徐汇区田林街道', d_xuhui, sh_id, 'active', '女', 50, 4.4, 0)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '半天居家照护', '4-8小时日间照护，做饭打扫陪伴', 120, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now());

  -- 颐养天年护理中心 (虹口)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "avg_rating", "review_count")
  VALUES ('agency', '颐养天年护理中心', 'yiyang-tiannian-hongkou', '021-36301666', 'yiyang_hongkou', '虹口区口碑领先的养老服务机构，提供居家护理和日间照料双重服务。团队均持证上岗，特别擅长中风后遗症康复护理。', true, 31.262, 121.484, '上海市虹口区四川北路街道', d_hongkou, sh_id, 'active', 4.3, 0)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_rijian), (p_id, st_kangfu);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '持证护工24小时住家', 230, 'day'),
    (p_id, st_rijian, '日间照料', '8小时日托，含午餐', 130, 'day'),
    (p_id, st_kangfu, '术后康复护理', '中风后遗症专项康复', 260, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'nurse_cert', 'approved', now());

  -- 孙姐 (杨浦)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '孙姐', 'sun-jie-yangpu', '13512345678', 'sun_care_yp', '7年养老护理经验，曾在杨浦区中心医院做护工3年。擅长心脑血管疾病老人护理、血压血糖监测。为人朴实勤快，主要服务杨浦区和虹口区。', 7, true, 31.269, 121.528, '上海市杨浦区五角场街道', d_yangpu, sh_id, 'active', '女', 45, 4.7, 0)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '含慢病监测', 240, 'day'),
    (p_id, st_peizhen, '医院陪诊', '陪同就医取药', 150, 'per_visit');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now()), (p_id, 'health_cert', 'approved', now());

  -- 刘阿姨 (普陀)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '刘阿姨', 'liu-ayi-putuo', '13212348901', 'liu_care_pt', '9年居家养老服务经验，特别擅长照顾独居老人。不仅是护工，更像是老人的家庭陪伴。会做一手好菜，特别会煲汤。', 9, true, 31.252, 121.400, '上海市普陀区长寿路街道', d_putuo, sh_id, 'active', '女', 51, 4.5, 1)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_xinli);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '24小时住家护理，会做饭煲汤', 200, 'day'),
    (p_id, st_xinli, '心理陪伴', '情感陪伴、聊天交流', 100, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now());

  -- 陈护工 (黄浦)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "years_experience", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "gender", "age", "avg_rating", "review_count")
  VALUES ('individual', '陈护工', 'chen-hugong-huangpu', '13112346789', 'chen_care_hp', '5年黄浦区居家护理经验，擅长术后短期护理和陪诊。熟悉瑞金医院、长征医院等三甲医院的就诊流程，能高效完成陪诊和代取药。', 5, true, 31.230, 121.470, '上海市黄浦区老西门街道', d_huangpu, sh_id, 'active', '男', 42, 4.2, 0)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '术后短期护理', 220, 'day'),
    (p_id, st_peizhen, '医院陪诊', '熟悉三甲就诊流程', 150, 'per_visit');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'id_card', 'approved', now()), (p_id, 'nurse_cert', 'approved', now());

  -- 乐享颐年 (闵行)
  INSERT INTO "service_provider" ("provider_type", "name", "slug", "phone", "wechat_id", "bio", "verified", "latitude", "longitude", "address_text", "district_id", "city_id", "status", "avg_rating", "review_count")
  VALUES ('agency', '乐享颐年养老服务公司', 'lexiang-yinian-minhang', '021-64901234', 'lexiang_care', '闵行区大型综合养老服务机构，旗下50余名专业护工，覆盖居家护理、日间照料、康复理疗等全方位服务。与多家三甲医院建立合作转诊通道。', true, 31.113, 121.382, '上海市闵行区莘庄镇', d_minhang, sh_id, 'active', 4.6, 1)
  RETURNING id INTO p_id;
  INSERT INTO "provider_service_type" ("provider_id", "service_type_id") VALUES (p_id, st_hugong), (p_id, st_peizhen), (p_id, st_rijian), (p_id, st_kangfu);
  INSERT INTO "service_listing" ("provider_id", "service_type_id", "title", "description", "price", "price_unit") VALUES
    (p_id, st_hugong, '全天居家照护', '专业团队轮班', 280, 'day'),
    (p_id, st_peizhen, '陪诊服务', '专人全程陪同', 200, 'per_visit'),
    (p_id, st_rijian, '日间照料', '含康复理疗', 180, 'day'),
    (p_id, st_kangfu, '术后康复', '综合康复方案', 350, 'day');
  INSERT INTO "verification" ("provider_id", "verify_type", "verify_status", "verified_at") VALUES
    (p_id, 'nurse_cert', 'approved', now());
END $$;

-- Test user + sample reviews
INSERT INTO "user" ("nickname", "phone") VALUES ('张先生', '139****6789'), ('李女士', '138****8901'), ('赵先生', '137****3456');

DO $$
DECLARE
  u1 INT; u2 INT; u3 INT;
  p1 INT; p2 INT; p3 INT; p4 INT; p5 INT; p6 INT; p8 INT; p10 INT;
BEGIN
  SELECT id INTO u1 FROM "user" WHERE nickname = '张先生';
  SELECT id INTO u2 FROM "user" WHERE nickname = '李女士';
  SELECT id INTO u3 FROM "user" WHERE nickname = '赵先生';
  SELECT id INTO p1 FROM "service_provider" WHERE slug = 'wang-ayi-changning';
  SELECT id INTO p2 FROM "service_provider" WHERE slug = 'li-shushu-jingan';
  SELECT id INTO p3 FROM "service_provider" WHERE slug = 'zhang-ayi-pudong';
  SELECT id INTO p4 FROM "service_provider" WHERE slug = 'ankang-huli-pudong';
  SELECT id INTO p5 FROM "service_provider" WHERE slug = 'liu-ayi-putuo';
  SELECT id INTO p6 FROM "service_provider" WHERE slug = 'sun-jie-yangpu';
  SELECT id INTO p8 FROM "service_provider" WHERE slug = 'lexiang-yinian-minhang';

  INSERT INTO "review" ("provider_id", "user_id", "rating", "content", "tags", "is_verified_booking")
  VALUES
    (p1, u1, 5, '王阿姨照顾我爸三年了，非常细心负责。我爸是髋关节手术后需要康复护理，王阿姨每天按时帮他做康复训练，现在恢复得很好。强烈推荐！', ARRAY['细心负责', '专业', '耐心'], true),
    (p1, u2, 5, '找到王阿姨是我们的幸运。我妈有轻度认知障碍，有时候会闹脾气，王阿姨特别有办法安抚她。', ARRAY['态度好', '有经验'], true),
    (p1, u3, 4, '专业能力没得说。唯一小遗憾是有时候会请假，临时找人替班不太方便。但总的来说瑕不掩瑜。', ARRAY['专业', '可靠'], true),
    (p2, u1, 4, '李叔叔力气大，帮我爸翻身、从床上移到轮椅都很稳当。对于行动不便的老人来说是很好的选择。', ARRAY['可靠', '有经验'], false),
    (p3, u2, 5, '张阿姨是华山的护士出身，非常专业。帮我爸测血糖、打胰岛素都很熟练，比我这个儿子还细心。', ARRAY['专业', '细心负责'], true),
    (p4, u3, 5, '安康护理站的服务很正规，有统一管理的，换护工也方便。护工素质都挺好，家里老人也很满意。', ARRAY['专业', '可靠'], true),
    (p5, u1, 5, '刘阿姨不仅把家里老人照顾好，做的饭也好吃。我妈总说她煲的汤比饭店还香。', ARRAY['态度好', '有爱心'], true),
    (p8, u2, 3, '乐享颐年机构整体还行，但价格偏贵。好处是正规，出了问题有公司兜底，这点比个人护工强。', ARRAY['专业'], true);
END $$;

-- Verify success
SELECT 'City' as item, COUNT(*) as count FROM "city"
UNION ALL SELECT 'Districts', COUNT(*) FROM "district"
UNION ALL SELECT 'ServiceTypes', COUNT(*) FROM "service_type"
UNION ALL SELECT 'Providers', COUNT(*) FROM "service_provider"
UNION ALL SELECT 'Listings', COUNT(*) FROM "service_listing"
UNION ALL SELECT 'Reviews', COUNT(*) FROM "review"
UNION ALL SELECT 'Verifications', COUNT(*) FROM "verification";
