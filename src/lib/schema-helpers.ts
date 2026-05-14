interface QAPair {
  question: string;
  answer: string;
}

export function buildHomepageFaq(districtCount: number, providerCount: number): QAPair[] {
  return [
    {
      question: '请一个居家护工要多少钱？',
      answer: `居家护工的收费标准大致为：半天照护（4-8小时）70-180元/天，全天照护（24小时住家）150-350元/天。具体价格因城市、护工资历、经验、服务内容而异。平台已收录${providerCount}位服务者，可按价格排序筛选。`,
    },
    {
      question: '如何判断一个护工是否靠谱？',
      answer: '建议重点考察：①是否有养老护理员资格证书；②是否有健康证；③过往评价如何（本平台所有评价来自真实服务后用户）；④面试时老人的感觉是否舒服。我们平台上的护工都经过资质审核，认证标识代表已通过身份证、资格证、健康证核验。',
    },
    {
      question: '护工和保姆有什么区别？',
      answer: '护工具备专业的养老护理知识和技能，能处理老人的健康监测、康复训练、服药管理等医疗相关事务，持有养老护理员职业资格证书。保姆主要负责家务和日常起居，不具备医疗护理能力。家中老人有慢性病或术后康复需求，应优先选择专业护工。',
    },
    {
      question: '如何在本地找到靠谱的护工？',
      answer: `通过本平台可按城市、区域、服务类型筛选附近的护工。平台覆盖全国31个省市${districtCount > 0 ? `、${districtCount}个区域` : ''}，所有服务者经过资质核验，附带真实用户评价。建议先确定服务类型（居家护理/陪诊/日间照料/术后康复），再筛选所在区域，比较评分和价格后联系。`,
    },
    {
      question: '护工一般提供哪些服务？',
      answer: '居家护工主要提供：生活照料（饮食、洗漱、如厕、穿衣）、健康监测（血压血糖测量、用药提醒）、康复训练（术后康复操、关节活动）、心理慰藉（陪伴聊天、情绪疏导）、陪诊就医（挂号、取药、检查陪同）。部分护工还会做饭、打扫卫生。具体服务内容可与护工协商确定。',
    },
    {
      question: '居家养老和养老院哪个更好？',
      answer: '居家养老让老人在熟悉的环境中生活，保持原有的社交关系和生活习惯，费用相对灵活（按需选择服务时长）。养老院提供24小时专业照护和社交活动，适合失能程度较高或家中无人照料的老人。本平台同时收录居家护工和养老机构，可根据老人身体状况和家庭条件对比选择。',
    },
  ];
}

export function buildDistrictFaq(districtName: string, providers: Array<{ name: string }>): QAPair[] {
  const sampleNames = providers.slice(0, 5).map(p => p.name).join('、');
  return [
    {
      question: `${districtName}有哪些靠谱的护工？`,
      answer: `${districtName}${providers.length > 0 ? `有${sampleNames}等${providers.length}位经过资质认证的护工和护理机构。可根据老人的具体需求（服务类型、价格预算、经验年限）筛选合适的服务者。` : '暂无收录服务者，数据正在扩展中。建议浏览相邻区域或全市范围内的服务者。'}`,
    },
    {
      question: `${districtName}请护工一般多少钱？`,
      answer: `${districtName}居家护工的价格大致为半天照护（4-8小时）70-100元/天，全天照护（24小时住家）150-300元/天。具体费用取决于护工资历、经验年限、服务内容和时长。建议查看各服务者的详细价格信息，或直接联系确认最新报价。`,
    },
    {
      question: `如何判断${districtName}的护工是否靠谱？`,
      answer: '建议查看护工的资质证书（养老护理员资格证、健康证）、过往用户评价和评分、服务年限和经验描述。本平台所有服务者均经过资质核验，认证标识表示已通过身份和证书审核。面试时注意观察护工与老人的互动是否自然、态度是否耐心。',
    },
  ];
}

export function buildServiceTypeFaq(cityName: string, serviceTypeName: string): QAPair[] {
  return [
    {
      question: `${serviceTypeName}一般怎么收费？`,
      answer: `${cityName}${serviceTypeName}的价格因服务内容、时长和护工资历而异。建议查看平台上各服务者的具体价格信息，或直接联系确认。一般来说，按小时计费约30-80元/小时，按天计费约150-350元/天，具体取决于服务复杂度和护工经验。`,
    },
    {
      question: `${serviceTypeName}需要护工有什么资质？`,
      answer: `从事${serviceTypeName}的护工应持有养老护理员职业资格证书（国家职业技能等级证书）、健康证。本平台优先推荐持有上述证书且通过背景调查的护工。选择时可查看服务者的"资质认证"栏目确认其证书类型。`,
    },
    {
      question: `${cityName}${serviceTypeName}如何选择？`,
      answer: `在${cityName}选择${serviceTypeName}服务者时，建议：①明确服务需求（时长、频次、是否需要特殊护理技能）；②查看服务者评价和评分；③对比价格；④面试时确认沟通顺畅度和服务态度；⑤优先选择平台认证服务者。`,
    },
  ];
}

export function buildProviderFaq(provider: {
  name: string;
  addressText: string | null;
  district?: { name: string } | null;
  verifications: Array<{ verifyType: string }>;
  listings: Array<{ title: string; price: number | null; priceUnit: string | null }>;
}): QAPair[] {
  function priceDisplay(price: number, unit: string | null): string {
    switch (unit) {
      case 'hour': return `${price}元/小时`;
      case 'day': return `${price}元/天`;
      case 'month': return `${price}元/月`;
      case 'per_visit': return `${price}元/次`;
      default: return `${price}元`;
    }
  }
  function verifyLabel(type: string): string {
    const m: Record<string, string> = {
      id_card: '身份证认证',
      nurse_cert: '养老护理员资格证',
      health_cert: '健康证',
      background_check: '背景调查通过',
    };
    return m[type] ?? type;
  }

  return [
    {
      question: `${provider.name}的服务区域是哪里？`,
      answer: `${provider.name}主要在${provider.addressText || '本地'}提供服务${provider.district ? `，覆盖${provider.district.name}及周边区域` : ''}。建议直接联系确认是否覆盖您所在的具体位置。`,
    },
    {
      question: `${provider.name}有哪些资质证书？`,
      answer: provider.verifications.length > 0
        ? `持有${provider.verifications.map(v => verifyLabel(v.verifyType)).join('、')}。以上资质信息由服务者提供并经平台审核。`
        : '资质信息请联系服务者确认。平台建议优先选择持有养老护理员资格证和健康证的护工。',
    },
    {
      question: `${provider.name}的收费标准是怎样的？`,
      answer: provider.listings.map(l =>
        `${l.title}${l.price ? `：${priceDisplay(l.price, l.priceUnit)}` : '：价格面议'}`
      ).join('；') + '。以上为参考价格，实际费用可能因服务时长、内容复杂度等因素调整，建议直接联系确认最新价格和档期。',
    },
  ];
}

export function buildCityFaq(cityName: string, providerCount: number, districtCount: number): QAPair[] {
  return [
    {
      question: `${cityName}有哪些区域可以找到护工？`,
      answer: `${cityName}${districtCount > 0 ? `共有${districtCount}个区域收录了养老护工服务资源` : '各区养老服务资源正在扩展中'}。您可按区域筛选附近的护工，查看各区的持证服务者和护理机构。建议优先选择离家近的区域，方便护工通勤和紧急情况响应。`,
    },
    {
      question: `${cityName}请护工一般多少钱一个月？`,
      answer: `${cityName}居家护工的月费参考：基础照护（做饭、打扫、陪伴）约5500-6500元/月，半自理老人照护约6500-7500元/月，完全不能自理老人照护约7500-9000元/月，专业康复护理约8000-10500元/月。具体价格因护工资质、经验、服务内容和老人身体状况而异。建议查看平台上各服务者的具体报价，或直接联系确认最新价格。`,
    },
    {
      question: `${cityName}护工可以帮忙做哪些事？`,
      answer: `${cityName}的护工主要提供：①生活照料（饮食、洗漱、如厕、穿衣、翻身拍背）；②健康监测（血压血糖测量、用药提醒、健康记录）；③康复训练（术后康复操、关节活动、步行训练）；④心理慰藉（陪伴聊天、情绪疏导、认知训练）；⑤陪诊就医（医院挂号、检查陪同、取药）。部分护工还提供做饭、打扫卫生等家政服务。具体服务内容可与护工协商确定。`,
    },
    {
      question: `${cityName}找护工有哪些渠道？`,
      answer: `在${cityName}找护工可以通过以下渠道：①本平台直接浏览筛选（${providerCount > 0 ? `当前收录${providerCount}位经过资质核验的护工` : '数据正在扩展中'}）；②熟人推荐；③社区养老服务站或日间照料中心；④医院护理部推荐。通过平台找护工的优势在于资质透明、评价真实、可直接对比价格和服务内容。`,
    },
    {
      question: `${cityName}的护工和养老院怎么选择？`,
      answer: `在${cityName}做选择时建议考虑：居家护工适合老人尚有部分自理能力、希望留在熟悉环境的情况，费用灵活可按需选择服务时长；养老院适合失能程度较高、需要24小时专业照护的老人。${cityName}各区均有不同类型的养老服务资源，可对比后再做决定。`,
    },
  ];
}

export function buildSubSlugFaq(districtName: string, serviceTypeName: string): QAPair[] {
  return [
    {
      question: `${districtName}${serviceTypeName}服务包括哪些内容？`,
      answer: `${districtName}的${serviceTypeName}服务具体内容因服务者而异，一般包括与${serviceTypeName}相关的专业护理和生活照料。建议查看各服务者的服务项目列表了解详情，或直接联系确认是否能满足您的具体需求。`,
    },
    {
      question: `${districtName}${serviceTypeName}怎么收费？`,
      answer: `${districtName}${serviceTypeName}的收费因服务者资质、经验、服务时长和内容复杂度而不同。建议浏览平台上的服务者列表，对比价格和评价后做出选择。部分服务者支持价格面议，可根据实际情况协商。`,
    },
    {
      question: `如何选择${districtName}的${serviceTypeName}服务者？`,
      answer: `建议重点考察：①服务者是否持有相关资质证书（养老护理员资格证、健康证）；②过往用户的真实评价和评分；③服务经验与您的需求是否匹配；④沟通是否顺畅、态度是否专业耐心。平台上所有服务者均经过资质核验，认证标识代表已通过审核。`,
    },
  ];
}
