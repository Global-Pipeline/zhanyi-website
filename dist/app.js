const STATIC_SITE = Object.freeze(window.__ZHANYI_STATIC__ || {});
const STATIC_ROOT_URL = new URL(STATIC_SITE.root || './', location.href);
const STATIC_BASE_PATH = STATIC_ROOT_URL.pathname.replace(/\/+$/, '') === '/'
  ? ''
  : STATIC_ROOT_URL.pathname.replace(/\/+$/, '');

function stripStaticBase(pathname) {
  const value = pathname || '/';
  if (!STATIC_BASE_PATH) return value;
  if (value === STATIC_BASE_PATH) return '/';
  return value.startsWith(STATIC_BASE_PATH + '/') ? value.slice(STATIC_BASE_PATH.length) || '/' : value;
}

function staticFileUrl(path) {
  return new URL(String(path || '').replace(/^\/+/, ''), STATIC_ROOT_URL).href;
}

const ASSET_ROOT = staticFileUrl('assets').replace(/\/+$/, '');
const COMPANY = Object.freeze({
  en: 'Dongguan Zhanyi Hardware Products Co., Ltd.',
  zh: '东莞市展益五金制品有限公司',
  phone: '+86 132 3832 3259',
  phoneHref: '+8613238323259',
  whatsapp: '8613238323259',
});
const DEFAULT_MAP = Object.freeze({ lat: 22.99442, lng: 113.926813 });
const FORMSPREE_FORM_ID = 'xbgrpbkd';
const L = (en, zh) => ({ en, zh });
const A = (path) => {
  const value = String(path || '').trim();
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('/assets/')) return staticFileUrl(value.slice(1));
  return ASSET_ROOT + '/' + value.replace(/^\/+/, '');
};

const fallbackCategories = [
  { id: 'stamping', label: L('Metal Stamping', '五金冲压') },
  { id: 'sheet-metal', label: L('Sheet Metal', '精密钣金') },
  { id: 'enclosures', label: L('Enclosures', '机箱机柜') },
  { id: 'terminals', label: L('Terminals & Contacts', '端子与接触件') },
  { id: 'new-energy', label: L('New Energy Parts', '新能源配件') },
];

const fallbackHero = [
  {
    image: A('generated/hero-stamping.webp'),
    kicker: L('Precision Metal Manufacturing', '精密金属制造'),
    title: L('From Drawing to Dependable Delivery', '从图纸，到可靠交付'),
    description: L(
      'Zhanyi helps engineering and sourcing teams move demanding metal designs into production through disciplined review, practical manufacturing and clear project ownership.',
      '展益以严谨评审、务实制造和清晰负责的项目沟通，帮助工程与采购团队让复杂金属设计稳妥走向生产。'
    ),
  },
  {
    image: A('generated/tooling-workshop.webp'),
    kicker: L('Stamping & Sheet Metal', '冲压与钣金'),
    title: L('Built to Fit. Prepared to Repeat.', '为精准装配而制造，为稳定量产而准备'),
    description: L(
      'From precision stampings to complete enclosures, every process decision begins with how the part must fit, function and be inspected.',
      '从精密冲压件到完整机箱，每一个工艺决定都回到零件如何配合、如何工作，以及如何被清晰验收。'
    ),
  },
  {
    image: A('generated/global-review.webp'),
    kicker: L('New Energy & Electrical', '新能源与电气'),
    title: L('Critical Metal Components, Handled with Clarity.', '关键金属部件，更需要清晰而可靠的制造'),
    description: L(
      'For busbars, terminals, covers, trays, brackets and enclosures, we align material, geometry, assembly, inspection and delivery before production begins.',
      '铜排、端子、盖板、托盘、支架与箱体，从材料和结构评审开始，把连接、装配、检验与交付边界逐项说清。'
    ),
  },
];

const fallbackCapabilities = [
  {
    id: 'stamping',
    title: L('Precision Metal Stamping', '精密五金冲压'),
    description: L('Custom formed parts, brackets, clips and structural components produced from customer drawings.', '依据客户图纸生产定制成型件、支架、弹片与结构件。'),
    image: A('generated/hero-stamping.webp'),
    features: L(['Single-operation stamping', 'Compound forming', 'Custom fixtures'], ['单工序冲压', '复合成型', '定制工装']),
  },
  {
    id: 'progressive-die',
    title: L('Progressive Die Stamping', '连续模冲压'),
    description: L('Tooling-led production planning for repeat components and stable manufacturing cycles.', '以模具为核心规划重复零件生产与稳定制造节拍。'),
    image: A('generated/tooling-workshop.webp'),
    features: L(['Tooling review', 'Sample validation', 'Repeat production'], ['模具评审', '样品验证', '重复量产']),
  },
  {
    id: 'sheet-metal',
    title: L('Sheet Metal Fabrication', '精密钣金加工'),
    description: L('Cutting, punching, bending and forming for enclosures, panels and custom structures.', '面向机箱、面板与定制结构件的切割、冲孔、折弯和成型。'),
    image: A('products/ventilated-equipment-chassis.jpg'),
    features: L(['Laser cutting', 'CNC punching', 'Precision bending'], ['激光切割', '数控冲孔', '精密折弯']),
  },
  {
    id: 'tooling',
    title: L('Tooling & Die Making', '五金模具制造'),
    description: L('Tooling development aligned with part geometry, material behavior and production objectives.', '结合零件结构、材料特性与生产目标进行模具开发。'),
    image: A('generated/tooling-workshop.webp'),
    features: L(['DFM feedback', 'Tool development', 'Trial and adjustment'], ['DFM反馈', '模具开发', '试模调试']),
  },
  {
    id: 'finishing',
    title: L('Surface Finishing', '表面处理协同'),
    description: L('Finishing is reviewed as part of function and assembly, with coating, plating and anodizing aligned to the drawing.', '把表面处理纳入功能与装配评审，并依据图纸衔接喷涂、电镀和氧化要求。'),
    image: A('products/zinc-plated-offset-bracket.jpg'),
    features: L(['Finish matching', 'Appearance review', 'Packaging planning'], ['表面匹配', '外观确认', '包装规划']),
  },
  {
    id: 'assembly',
    title: L('Assembly & Inspection', '组装与检验'),
    description: L('Part assembly, project-specific checks and delivery preparation for finished components.', '为成品零件提供部件组装、项目检验与交付准备。'),
    image: A('generated/global-review.webp'),
    features: L(['Sub-assembly', 'Dimensional checks', 'Shipment preparation'], ['部件组装', '尺寸检验', '出货准备']),
  },
];

const product = (slug, category, titleEn, titleZh, image, processEn, processZh, materialsEn, materialsZh, finishEn, finishZh) => ({
  slug,
  category,
  title: L(titleEn, titleZh),
  image: A(image),
  process: L(processEn, processZh),
  materials: L(materialsEn, materialsZh),
  finish: L(finishEn, finishZh),
  description: L(
    'Manufactured from the approved drawing, with material, finish and acceptance aligned to the application.',
    '依据确认图纸制造，并让材料、表面处理与验收方式服务于实际应用。'
  ),
});

const fallbackProducts = [
  product('precision-stamped-bracket', 'stamping', 'Precision Stamped Bracket', '精密冲压支架', 'products/formed-steel-mounting-bracket.jpg', 'Stamping / Forming / Assembly', '冲压 / 成型 / 组装', 'Steel, stainless steel, aluminum', '钢材、不锈钢、铝材', 'Drawing-specified finish', '按图纸要求处理'),
  product('formed-metal-housing', 'stamping', 'Formed Metal Housing', '冲压成型外壳', 'products/multi-angle-stamped-support.jpg', 'Stamping / Forming', '冲压 / 成型', 'Steel, aluminum', '钢材、铝材', 'Plating or coating options', '可选电镀或涂层'),
  product('custom-sheet-metal-component', 'sheet-metal', 'Custom Sheet Metal Component', '定制钣金结构件', 'products/ventilated-equipment-chassis.jpg', 'Cutting / Bending / Joining', '切割 / 折弯 / 连接', 'Steel, stainless steel, aluminum', '钢材、不锈钢、铝材', 'Powder coating or plating', '喷粉或电镀'),
  product('stamped-mounting-plate', 'new-energy', 'Stamped Mounting Plate', '新能源冲压安装板', 'products/battery-terminal-cover-plates.jpg', 'Stamping / Piercing / Forming', '冲压 / 冲孔 / 成型', 'Steel, aluminum', '钢材、铝材', 'Project-specific finish', '按项目要求处理'),
  product('precision-hardware-component', 'stamping', 'Precision Hardware Component', '精密五金冲压件', 'products/zinc-plated-offset-bracket.jpg', 'Stamping / Secondary forming', '冲压 / 二次成型', 'Steel, stainless steel', '钢材、不锈钢', 'Natural or plated', '本色或电镀'),
  product('formed-stamping-part', 'stamping', 'Formed Stamping Part', '五金成型冲压件', 'products/u-channel-support-bracket.jpg', 'Stamping / Bending', '冲压 / 折弯', 'Steel, stainless steel', '钢材、不锈钢', 'Drawing-specified finish', '按图纸要求处理'),
  product('metal-terminal-contact', 'terminals', 'Metal Terminal Contact', '精密端子接触件', 'products/formed-electrical-contact-terminal.jpg', 'Precision stamping / Forming', '精密冲压 / 成型', 'Copper alloy, stainless steel', '铜合金、不锈钢', 'Plating options by drawing', '按图纸选择电镀'),
  product('sheet-metal-enclosure', 'enclosures', 'Sheet Metal Enclosure', '钣金机箱外壳', 'products/powder-coated-instrument-enclosure.jpg', 'Cutting / Bending / Welding', '切割 / 折弯 / 焊接', 'Steel, stainless steel, aluminum', '钢材、不锈钢、铝材', 'Powder coating options', '可选喷粉处理'),
  product('control-cabinet-shell', 'enclosures', 'Control Cabinet Shell', '控制机柜壳体', 'products/stainless-equipment-cabinet.jpg', 'Fabrication / Joining / Assembly', '钣金 / 连接 / 组装', 'Steel, stainless steel', '钢材、不锈钢', 'Powder coating options', '可选喷粉处理'),
  product('custom-equipment-housing', 'enclosures', 'Custom Equipment Housing', '定制设备机箱', 'products/galvanized-electrical-junction-box.jpg', 'Cutting / Bending / Assembly', '切割 / 折弯 / 组装', 'Steel, aluminum', '钢材、铝材', 'Project-specific finish', '按项目要求处理'),
  product('metal-chassis-frame', 'sheet-metal', 'Metal Chassis Frame', '钣金机架结构', 'products/rackmount-equipment-chassis.jpg', 'Cutting / Bending / Joining', '切割 / 折弯 / 连接', 'Steel, aluminum', '钢材、铝材', 'Natural or coated', '本色或涂层'),
  product('stamped-shell-component', 'new-energy', 'Stamped Shell Component', '新能源冲压壳体', 'products/perforated-battery-protection-tray.jpg', 'Stamping / Deep forming', '冲压 / 拉伸成型', 'Steel, aluminum', '钢材、铝材', 'Project-specific finish', '按项目要求处理'),
];

const fallbackIndustries = [
  { id: 'new-energy', title: L('New Energy & Storage', '新能源与储能'), description: L('Connection geometry, insulation interfaces, ventilation and structural support must work together in battery and storage equipment.', '电池与储能设备中的连接几何、绝缘界面、通风和结构承托需要协同考虑。'), image: A('products/insulated-flexible-copper-busbar.png') },
  { id: 'automotive', title: L('Automotive Components', '汽车零部件'), description: L('Stamped brackets and formed components developed around fit, retention and repeatable assembly.', '围绕配合、固定和重复装配开发冲压支架与成形零件。'), image: A('products/formed-steel-mounting-bracket.jpg') },
  { id: 'electronics', title: L('Consumer Electronics', '消费电子'), description: L('Compact terminals, contacts and structures depend on precise relationships between holes, bends and mating features.', '紧凑端子、触点与结构件依赖孔位、折弯和配合特征之间的精准关系。'), image: A('products/formed-electrical-contact-terminal.jpg') },
  { id: 'industrial', title: L('Industrial Equipment', '工业设备'), description: L('Panels, enclosures, guards and brackets planned around layouts, assembly access and maintenance.', '面板、机箱、护罩和支架围绕设备布局、装配空间与维护需求规划。'), image: A('products/ventilated-equipment-chassis.jpg') },
  { id: 'electrical', title: L('Electrical & Power', '电气与电源'), description: L('Housings, contacts and formed parts that balance connection, protection and service access.', '兼顾连接、防护与维护空间的壳体、触点和成形零件。'), image: A('products/power-control-chassis.jpg') },
  { id: 'communications', title: L('Communications', '通信设备'), description: L('Chassis, cabinets and structures shaped by modular layouts, airflow and serviceability.', '围绕模块化布局、空气流动和维护便利性开发机箱、机柜与结构件。'), image: A('products/rackmount-equipment-chassis.jpg') },
];

const fallbackInsights = [
  {
    slug: 'designing-stamped-parts',
    date: '2026-08-18',
    category: L('Engineering', '工程技术'),
    title: L('What to review before releasing a stamped part drawing', '冲压件图纸发出前应重点检查什么'),
    excerpt: L('Material, bend direction, burr orientation and inspection references all influence manufacturability.', '材料、折弯方向、毛刺方向与检验基准都会影响零件的可制造性。'),
    body: L('Define material grade, thickness, critical dimensions, datum structure, surface requirements and expected quantity. Early clarification helps align tooling, sampling and inspection decisions.', '建议明确材料牌号、厚度、关键尺寸、基准体系、表面要求与预计数量。越早澄清这些信息，越有利于统一模具、打样与检验方案。'),
    image: A('generated/hero-stamping.webp'),
  },
  {
    slug: 'sheet-metal-finish-selection',
    date: '2026-08-18',
    category: L('Materials', '材料与工艺'),
    title: L('Selecting a practical finish for sheet metal enclosures', '如何为钣金机箱选择合适的表面处理'),
    excerpt: L('Appearance, corrosion resistance, grounding and assembly conditions should be considered together.', '外观、防腐、接地与装配条件需要综合考虑。'),
    body: L('The finish should follow the working environment and functional requirements. Masking, thread protection and color references should be defined on the drawing.', '表面处理应结合使用环境与功能要求确定，图纸中还应明确遮蔽区域、螺纹保护与颜色参考。'),
    image: A('products/powder-coated-instrument-enclosure.jpg'),
  },
  {
    slug: 'from-sample-to-production',
    date: '2026-08-18',
    category: L('Project Flow', '项目流程'),
    title: L('Moving from sample approval to repeat production', '从样品确认走向重复量产'),
    excerpt: L('Approved references, controlled changes and consistent inspection points create a clearer handover.', '确认样、受控变更与一致的检验点能让量产交接更清晰。'),
    body: L('Sample approval should record the accepted drawing revision, material, finish and inspection findings. Clear change control keeps repeat orders aligned.', '样品确认应记录图纸版本、材料、表面处理与检验结果。清晰的变更控制可让重复订单始终依据同一套要求。'),
    image: A('generated/global-review.webp'),
  },
  {
    slug: 'rfq-information-checklist',
    date: '2026-08-18',
    category: L('Sourcing', '采购协作'),
    title: L('A useful RFQ checklist for custom metal components', '定制五金件询价需要准备哪些信息'),
    excerpt: L('Drawings, quantity, material, finish and delivery expectations form the basis of a useful quotation.', '图纸、数量、材料、表面处理与交期预期是有效报价的基础。'),
    body: L('Provide 2D drawings and, where available, 3D files. Include quantity, material, finish, application notes and required delivery date.', '建议提供2D图纸，并在条件允许时附上3D文件，同时说明数量、材料、表面处理、应用与交期。'),
    image: A('products/formed-electrical-contact-terminal.jpg'),
  },
];

const qualitySteps = [
  { title: L('Requirement Review', '需求评审'), description: L('The approved drawing, material, finish and acceptance basis are aligned before production begins.', '生产开始前，对齐确认图纸、材料、表面处理与验收依据。') },
  { title: L('Incoming Verification', '来料确认'), description: L('Material identity and project-specific conditions are checked before release.', '生产放行前确认材料信息与项目特定要求。') },
  { title: L('First Article Check', '首件检验'), description: L('Critical geometry, fit and appearance are reviewed before volume production.', '批量生产前复核关键结构、配合与外观。') },
  { title: L('Process Control', '过程控制'), description: L('Checkpoints are placed where forming, fabrication or assembly variation matters.', '在成形、钣金和装配变化真正影响结果的位置设置检查节点。') },
  { title: L('Final Verification', '出货确认'), description: L('Finished parts, quantity and agreed records are reviewed before packing.', '包装前复核成品、数量与项目约定资料。') },
];

const initialStaticPath = stripStaticBase(location.pathname);
const state = {
  lang: initialStaticPath === '/zh' || initialStaticPath.startsWith('/zh/') ? 'zh' : 'en',
  content: {},
  products: fallbackProducts,
  categories: fallbackCategories,
  settings: {},
  filter: 'all',
  search: '',
  attachments: Object.create(null),
  heroIndex: 0,
  heroTimer: null,
  heroPaused: false,
  lightboxImages: [],
  lightboxIndex: 0,
  revealObserver: null,
};

function tx(en, zh) {
  return state.lang === 'zh' ? zh : en;
}

function localize(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value.trim() || fallback;
  if (Array.isArray(value)) {
    const result = value.map((item) => localize(item)).filter(Boolean).join(', ');
    return result || fallback;
  }
  if (typeof value === 'object') {
    const candidates = [value[state.lang], value.en, value.zh, value.label, value.title];
    for (const candidate of candidates) {
      const result = localize(candidate, '');
      if (result) return result;
    }
  }
  return fallback;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll(String.fromCharCode(96), '&#096;');
}

function slugify(value, fallback = 'item') {
  const slug = String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function resolveImage(value, fallback = A('products/formed-steel-mounting-bracket.jpg')) {
  const input = String(value || '').trim();
  if (!input) return fallback;
  if (/^(https?:|data:|blob:)/i.test(input)) return input;
  if (input.startsWith('/')) return staticFileUrl(input.slice(1));
  if (input.startsWith('uploads/') || input.startsWith('themes/')) return staticFileUrl(input);
  return A(input);
}

function icon(name, size = 20) {
  const paths = {
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-left': '<path d="m11 18-6-6 6-6"/><path d="M5 12h14"/>',
    'arrow-up': '<path d="m18 15-6-6-6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16v4H4v-4"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 16H6L5 6"/><path d="M10 11v6M14 11v6"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="M11 8v6M8 11h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5-5l2.1 2.1-2.4 2.4-2.1-2.1a4 4 0 0 0 5 5L21 17.4 17.4 21z"/>',
    gauge: '<path d="M20 13a8 8 0 1 0-16 0"/><path d="m12 13 4-4"/><path d="M4 18h16"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8"/><path d="M5.5 15A7 7 0 0 0 17.8 17.8L20 16"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    'map-pin': '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    box: '<path d="m21 16-9 5-9-5V8l9-5 9 5z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    factory: '<path d="M3 22V10l6 3V9l6 3V4h6v18z"/><path d="M3 22h18M7 18h2M13 18h2M18 8h3"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5z"/>',
  };
  return '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths['arrow-right']) + '</svg>';
}

function routeInfo() {
  let path = stripStaticBase(location.pathname || '/');
  const lang = path === '/zh' || path.startsWith('/zh/') ? 'zh' : 'en';
  if (lang === 'zh') path = path.slice(3) || '/';
  else if (path === '/en' || path.startsWith('/en/')) path = path.slice(3) || '/';
  path = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return { lang, path };
}

function routeUrl(path, lang = state.lang) {
  const normalized = path === '/' ? '/' : '/' + String(path || '').replace(/^\/+/, '');
  const localized = lang === 'zh' ? (normalized === '/' ? '/zh' : '/zh' + normalized) : normalized;
  return (STATIC_BASE_PATH + localized) || '/';
}

function companyName() {
  const configured = state.lang === 'zh' ? state.settings.companyName : state.settings.companyNameEn;
  return configured || (state.lang === 'zh' ? COMPANY.zh : COMPANY.en);
}

function whatsappUrl(message = '') {
  return 'https://wa.me/' + COMPANY.whatsapp + '?text=' + encodeURIComponent(message || tx('Hello, I have a metal part I would like Zhanyi to review.', '您好，我有一个金属零件项目，希望请展益协助评审。'));
}

function contentList(key, fallback) {
  const content = state.content || {};
  const values = [content[key], content.home?.[key], content.pages?.home?.[key], content.pages?.[key]];
  const match = values.find((value) => (Array.isArray(value) && value.length) || (value && Array.isArray(value.items) && value.items.length));
  if (Array.isArray(match)) return match;
  if (match && Array.isArray(match.items)) return match.items;
  return fallback;
}

function normalizeCategory(item, index) {
  if (typeof item === 'string') return { id: slugify(item, 'category-' + index), label: item };
  const label = item.label || item.name || item.title || 'Category ' + (index + 1);
  return { id: slugify(item.id || item.slug || localize(label), 'category-' + index), label };
}

function normalizeProduct(item, index) {
  const gallery = Array.isArray(item.images) ? item.images : Array.isArray(item.gallery) ? item.gallery : [item.image || item.imageUrl || item.thumbnail].filter(Boolean);
  const title = item.title || item.name || L('Custom Metal Component', '定制五金零部件');
  const category = item.categoryId || item.categorySlug || (typeof item.category === 'string' ? item.category : item.category?.id || item.category?.slug || item.category?.name);
  return {
    slug: slugify(item.slug || item.id || localize(title), 'product-' + (index + 1)),
    category: slugify(category || 'stamping', 'stamping'),
    title,
    description: item.description || item.summary || L('Manufactured from the approved drawing, with material, finish and acceptance aligned to the application.', '依据确认图纸制造，并让材料、表面处理与验收方式服务于实际应用。'),
    image: resolveImage(gallery[0] || item.image),
    images: gallery.map((image) => resolveImage(typeof image === 'string' ? image : image.url || image.src)).filter(Boolean),
    process: item.process || item.processes || L('Custom manufacturing', '定制加工'),
    materials: item.materials || item.material || L('Per drawing requirements', '按图纸要求'),
    finish: item.finish || item.surfaceFinish || L('Per drawing requirements', '按图纸要求'),
    applications: item.applications || item.application || L('Project-specific applications', '按项目应用要求'),
  };
}

function normalizeCapability(item, index) {
  const base = fallbackCapabilities[index % fallbackCapabilities.length];
  return { id: slugify(item.id || item.slug || localize(item.title), base.id), title: item.title || item.name || base.title, description: item.description || item.summary || base.description, image: resolveImage(item.image || item.imageUrl, base.image), features: item.features || item.services || item.highlights || base.features };
}

function normalizeIndustry(item, index) {
  const base = fallbackIndustries[index % fallbackIndustries.length];
  return { id: slugify(item.id || item.slug || localize(item.title), base.id), title: item.title || item.name || base.title, description: item.description || item.summary || base.description, image: resolveImage(item.image || item.imageUrl, base.image), productCategories: item.productCategories || [] };
}

function normalizeInsight(item, index) {
  const base = fallbackInsights[index % fallbackInsights.length];
  return { slug: slugify(item.slug || item.id || localize(item.title), base.slug), date: item.date || item.publishedAt || base.date, category: item.category || base.category, title: item.title || base.title, excerpt: item.excerpt || item.summary || base.excerpt, body: item.body || item.content || base.body, sections: Array.isArray(item.sections) ? item.sections : [], image: resolveImage(item.image || item.imageUrl, base.image) };
}

function heroSlides() {
  return contentList('heroSlides', fallbackHero).map((item, index) => {
    const base = fallbackHero[index % fallbackHero.length];
    return { image: resolveImage(item.image || item.imageUrl || item.background, base.image), kicker: item.kicker || item.eyebrow || base.kicker, title: item.title || base.title, description: item.description || item.subtitle || base.description };
  });
}

const capabilities = () => contentList('capabilities', fallbackCapabilities).map(normalizeCapability);
const industries = () => contentList('industries', fallbackIndustries).map(normalizeIndustry);
const insights = () => contentList('insights', fallbackInsights).map(normalizeInsight);

function categoryLabel(id) {
  return localize(state.categories.find((item) => item.id === id)?.label, tx('Custom Metal Parts', '定制五金件'));
}

function brandMarkup() {
  return `
    <img class="brand-mark brand-mark-image" src="${A('brand/zhanyi-mark.svg')}" alt="" aria-hidden="true">
    <span class="brand-copy">
      <strong>${escapeHtml(state.settings.brandName || 'ZHANYI PRECISION')}</strong>
      <small>${escapeHtml(companyName())}</small>
    </span>
  `;
}

function navItems() {
  return [
    { path: '/', label: tx('Home', '首页') },
    { path: '/capabilities', label: tx('Capabilities', '制造能力'), mega: 'capabilities' },
    { path: '/products', label: tx('Products', '产品中心'), mega: 'products' },
    { path: '/industries', label: tx('Industries', '应用行业') },
    { path: '/quality', label: tx('Quality', '质量管理') },
    { path: '/about', label: tx('About', '关于展益') },
    { path: '/insights', label: tx('Insights', '技术洞察') },
    { path: '/contact', label: tx('Contact', '联系我们') },
  ];
}

function isActive(path) {
  const current = routeInfo().path;
  return path === '/' ? current === '/' : current === path || current.startsWith(path + '/');
}

function renderMega(type) {
  const capabilityMode = type === 'capabilities';
  const links = capabilityMode
    ? capabilities().slice(0, 6).map((item) => ({ label: localize(item.title), href: routeUrl('/capabilities') + '#' + item.id }))
    : state.categories.slice(0, 6).map((item) => ({ label: localize(item.label), href: routeUrl('/products') + '?category=' + encodeURIComponent(item.id) }));
  return `
    <div class="mega-menu">
      <div class="container mega-inner">
        <div class="mega-intro">
          <strong>${capabilityMode ? tx('Manufacturing capabilities', '制造能力') : tx('Custom metal products', '定制五金产品')}</strong>
          <p>${capabilityMode
            ? tx('See how engineering review, process planning, production and inspection connect around the final part.', '了解工程评审、工艺规划、生产与检验如何围绕最终零件衔接。')
            : tx('Representative part families for a drawing-led manufacturing discussion.', '用于来图制造沟通的代表性产品系列。')}</p>
          <a class="text-link" data-route href="${routeUrl(capabilityMode ? '/capabilities' : '/products')}">
            ${capabilityMode ? tx('View all capabilities', '查看全部能力') : tx('Explore product catalogue', '浏览产品目录')}${icon('arrow-right', 17)}
          </a>
        </div>
        <div class="mega-links">
          ${links.map((item) => `<a data-route href="${escapeAttr(item.href)}"><span>${escapeHtml(item.label)}</span>${icon('arrow-right', 15)}</a>`).join('')}
        </div>
        <a class="mega-feature" data-route href="${routeUrl('/contact')}">
          <img src="${capabilityMode ? A('generated/tooling-workshop.webp') : A('products/formed-steel-mounting-bracket.jpg')}" alt="">
          <span>${tx('Send your drawing for review', '发送图纸，开始评审')} ${icon('arrow-right', 17)}</span>
        </a>
      </div>
    </div>
  `;
}

function renderHeader() {
  const items = navItems();
  return `
    <div class="utility-bar">
      <div class="container utility-inner">
        <span class="utility-message">${icon('factory', 14)}${tx('Engineering clarity for custom metal projects', '让定制五金项目更清晰、更可控')}</span>
        <div class="utility-links">
          <a class="utility-link" href="tel:${COMPANY.phoneHref}">${icon('phone', 14)}${COMPANY.phone}</a>
          <a class="utility-link" href="${whatsappUrl()}" target="_blank" rel="noopener">${icon('message', 14)}WhatsApp</a>
        </div>
      </div>
    </div>
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <a class="brand" data-route href="${routeUrl('/')}" aria-label="${escapeAttr(companyName())}">${brandMarkup()}</a>
        <nav class="desktop-nav" aria-label="${tx('Primary navigation', '主导航')}">
          <ul class="nav-list">
            ${items.map((item) => `
              <li class="nav-item">
                <a class="nav-link ${isActive(item.path) ? 'active' : ''}" data-route href="${routeUrl(item.path)}">
                  <span>${item.label}</span>
                  ${item.mega ? icon('chevron-down', 14).replace('<svg ', '<svg class="nav-caret" ') : ''}
                </a>
                ${item.mega ? renderMega(item.mega) : ''}
              </li>
            `).join('')}
          </ul>
        </nav>
        <div class="header-actions">
          <button class="language-toggle" type="button" data-action="toggle-language" aria-label="${tx('Switch to Chinese', '切换到英文')}" title="${tx('中文', 'English')}">${tx('中文', 'EN')}</button>
          <button class="button button-primary header-quote" type="button" data-action="open-rfq">${icon('send', 17)}${tx('Start an RFQ', '发起询价')}</button>
          <button class="icon-button menu-toggle" type="button" data-action="toggle-menu" aria-expanded="false" aria-controls="mobile-drawer" aria-label="${tx('Open menu', '打开菜单')}" title="${tx('Open menu', '打开菜单')}">${icon('menu', 21)}</button>
        </div>
      </div>
    </header>
    <aside class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
      <ul class="mobile-nav">
        ${items.map((item, itemIndex) => {
          const sub = item.mega === 'capabilities'
            ? capabilities().slice(0, 6).map((entry) => ({ label: localize(entry.title), href: routeUrl('/capabilities') + '#' + entry.id }))
            : item.mega === 'products'
              ? state.categories.slice(0, 6).map((entry) => ({ label: localize(entry.label), href: routeUrl('/products') + '?category=' + encodeURIComponent(entry.id) }))
              : [];
          const subnavId = `mobile-subnav-${itemIndex}`;
          return `
            <li>
              <div class="mobile-nav-row">
                <a data-route href="${routeUrl(item.path)}">${item.label}</a>
                ${sub.length ? `<button class="mobile-sub-toggle" type="button" data-action="toggle-subnav" aria-expanded="false" aria-controls="${subnavId}" aria-label="${tx('Show submenu', '展开子菜单')}" title="${tx('Show submenu', '展开子菜单')}">${icon('chevron-down', 18)}</button>` : ''}
              </div>
              ${sub.length ? `<div class="mobile-subnav" id="${subnavId}" aria-hidden="true">${sub.map((entry) => `<a data-route href="${escapeAttr(entry.href)}">${escapeHtml(entry.label)}</a>`).join('')}</div>` : ''}
            </li>
          `;
        }).join('')}
        <li class="mobile-drawer-actions">
          <a class="button button-outline" href="tel:${COMPANY.phoneHref}">${icon('phone', 17)}${tx('Call', '电话')}</a>
          <button class="button button-primary" type="button" data-action="open-rfq">${icon('send', 17)}${tx('Start RFQ', '发起询价')}</button>
        </li>
      </ul>
    </aside>
  `;
}

function renderBreadcrumbs(items) {
  return '<nav class="breadcrumbs" aria-label="' + tx('Breadcrumb', '面包屑导航') + '">' + items.map((item, index) => {
    if (index === items.length - 1) return '<span aria-current="page">' + escapeHtml(item.label) + '</span>';
    return '<a data-route href="' + routeUrl(item.path) + '">' + escapeHtml(item.label) + '</a><span>/</span>';
  }).join('') + '</nav>';
}

function renderPageHero(title, description, image, crumbs) {
  return `
    <section class="page-hero">
      <img src="${resolveImage(image)}" alt="">
      <div class="container page-hero-inner">
        ${renderBreadcrumbs(crumbs)}
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
    </section>
  `;
}

function sectionHeading(eyebrow, title, description, link) {
  return `
    <div class="section-heading reveal">
      <div><span class="eyebrow">${escapeHtml(eyebrow)}</span><h2>${escapeHtml(title)}</h2></div>
      <div>
        <p>${escapeHtml(description)}</p>
        ${link ? `<a class="text-link" data-route href="${routeUrl(link.path)}">${escapeHtml(link.label)}${icon('arrow-right', 17)}</a>` : ''}
      </div>
    </div>
  `;
}

function renderHero() {
  const slides = heroSlides();
  state.heroIndex = Math.min(state.heroIndex, slides.length - 1);
  return `
    <section class="hero" aria-label="${tx('Manufacturing introduction', '制造能力介绍')}">
      ${slides.map((slide, index) => `
        <article class="hero-slide ${index === state.heroIndex ? 'active' : ''}" data-hero-slide="${index}" aria-hidden="${index === state.heroIndex ? 'false' : 'true'}">
          <img src="${escapeAttr(slide.image)}" alt="">
          <span class="hero-shade"></span><span class="hero-gridline"></span>
          <div class="container hero-content">
            <div class="hero-copy">
              <span class="hero-kicker">${escapeHtml(localize(slide.kicker))}</span>
              <h1>${escapeHtml(localize(slide.title))}</h1>
              <p>${escapeHtml(localize(slide.description))}</p>
              <div class="hero-actions">
                <button class="button button-primary" type="button" data-action="open-rfq">${tx('Send Your Drawings', '发送图纸')}${icon('arrow-right', 18)}</button>
                <a class="button button-ghost-light" data-route href="${routeUrl('/capabilities')}">${tx('See How We Work', '了解我们如何制造')}</a>
              </div>
            </div>
          </div>
        </article>
      `).join('')}
      <div class="hero-controls">
        <button class="hero-arrow" type="button" data-action="hero-prev" aria-label="${tx('Previous slide', '上一张')}" title="${tx('Previous slide', '上一张')}">${icon('arrow-left', 20)}</button>
        <div class="hero-dots" role="tablist">
          ${slides.map((_, index) => `<button class="hero-dot ${index === state.heroIndex ? 'active' : ''}" type="button" data-action="hero-dot" data-index="${index}" aria-label="${tx('Slide', '轮播图')} ${index + 1}"></button>`).join('')}
        </div>
        <span class="hero-index"><b data-hero-current>${String(state.heroIndex + 1).padStart(2, '0')}</b> / ${String(slides.length).padStart(2, '0')}</span>
        <button class="hero-arrow" type="button" data-action="hero-next" aria-label="${tx('Next slide', '下一张')}" title="${tx('Next slide', '下一张')}">${icon('arrow-right', 20)}</button>
      </div>
      <div class="hero-process">
        <div class="container hero-process-inner">
          ${[tx('Understand the Part', '理解零件'), tx('Plan the Route', '规划路径'), tx('Control Production', '控制生产'), tx('Verify & Deliver', '确认交付')]
            .map((label, index) => `<div class="hero-process-item"><span>0${index + 1}</span><strong>${label}</strong></div>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderValueStrip() {
  const values = [
    ['layers', tx('Drawing-led decisions', '由图纸驱动决策'), tx('Clear before production', '投产之前先说清')],
    ['wrench', tx('Process matched to the part', '工艺匹配零件'), tx('A practical path to scale', '为量产选择务实路径')],
    ['shield', tx('Quality built into the workflow', '质量融入流程'), tx('Checkpoints you can follow', '每个节点都有依据')],
    ['message', tx('Direct project ownership', '直接项目负责'), tx('Answers without distance', '沟通不绕弯')],
  ];
  return `
    <section class="value-strip"><div class="container value-strip-inner">
      ${values.map((item) => `<div class="value-item"><span class="value-icon">${icon(item[0], 20)}</span><span><strong>${item[1]}</strong><small>${item[2]}</small></span></div>`).join('')}
    </div></section>
  `;
}

function renderCapabilityCards(items = capabilities()) {
  return `
    <div class="capability-grid reveal">
      ${items.map((item, index) => `
        <a class="capability-card" data-route href="${routeUrl('/capabilities')}#${escapeAttr(item.id)}">
          <img src="${escapeAttr(item.image)}" alt="${escapeAttr(localize(item.title))}" loading="lazy">
          <div class="capability-card-content">
            <span class="capability-number">${String(index + 1).padStart(2, '0')}</span>
            <h3>${escapeHtml(localize(item.title))}</h3>
            <p>${escapeHtml(localize(item.description))}</p>
            <span class="text-link">${tx('View capability', '查看能力')}${icon('arrow-right', 17)}</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

function renderFilters() {
  const filters = [{ id: 'all', label: tx('All Products', '全部产品') }, ...state.categories.map((item) => ({ id: item.id, label: localize(item.label) }))];
  return '<div class="filter-list" role="group" aria-label="' + tx('Filter products', '筛选产品') + '">' + filters.map((item) =>
    '<button class="filter-button ' + (state.filter === item.id ? 'active' : '') + '" type="button" data-action="filter-products" data-filter="' + escapeAttr(item.id) + '">' + escapeHtml(item.label) + '</button>'
  ).join('') + '</div>';
}

function filteredProducts() {
  const query = state.search.trim().toLowerCase();
  return state.products.filter((item) => {
    const categoryMatch = state.filter === 'all' || item.category === state.filter;
    const searchable = [localize(item.title), categoryLabel(item.category), localize(item.process), localize(item.materials)].join(' ').toLowerCase();
    return categoryMatch && (!query || searchable.includes(query));
  });
}

function renderProductCard(item) {
  return `
    <article class="product-card">
      <a data-route href="${routeUrl('/products/' + encodeURIComponent(item.slug))}">
        <div class="product-media"><img src="${escapeAttr(item.image)}" alt="${escapeAttr(localize(item.title))}" loading="lazy"></div>
        <div class="product-card-copy"><span class="product-category">${escapeHtml(categoryLabel(item.category))}</span><h3>${escapeHtml(localize(item.title))}</h3></div>
      </a>
      <button class="product-view" type="button" data-action="lightbox-product" data-product="${escapeAttr(item.slug)}" aria-label="${tx('Preview', '预览')} ${escapeAttr(localize(item.title))}" title="${tx('Preview image', '预览图片')}">${icon('eye', 19)}</button>
    </article>
  `;
}

function renderProductGrid(items, limit = 0) {
  const visible = limit ? items.slice(0, limit) : items;
  return visible.length ? visible.map(renderProductCard).join('') : '<div class="product-empty">' + tx('No products match the current filter.', '当前筛选条件下没有匹配产品。') + '</div>';
}

function productCountLabel(count) {
  return `${count} ${tx(count === 1 ? 'item' : 'items', '项产品')}`;
}

function renderProcessSection() {
  const data = sectionData('workflow');
  const fallbackSteps = [
    [tx('Start with what you have', '从已有资料开始'), tx('Drawings, samples, application, quantity and target timing all help us begin.', '图纸、样件、用途、数量和目标时间都可以成为起点。')],
    [tx('Surface manufacturing risks early', '提前看见制造风险'), tx('Questions that affect forming, assembly, appearance, inspection or cost are raised early.', '尽早提出可能影响成形、装配、外观、检验或成本的问题。')],
    [tx('Align the route and commercial scope', '让方案与报价基于同一前提'), tx('Process, quotation scope, open points and timing are aligned against shared information.', '工艺、报价边界、开放问题与节奏基于同一套资料确认。')],
    [tx('Use the sample to confirm the result', '用样件确认真实结果'), tx('Critical geometry, fit and appearance are reviewed before moving forward.', '进入下一阶段前，以样件确认关键结构、配合与外观。')],
    [tx('Produce to the confirmed basis', '按确认要求组织生产'), tx('Approved drawings, samples and checkpoints guide production.', '让确认图纸、样件与检查节点贯穿生产。')],
    [tx('Treat delivery as part of the project', '把交付细节也纳入项目'), tx('Final review, packing, labeling and delivery details close the loop.', '终检、包装、标签与交付安排共同完成项目闭环。')],
  ];
  const configuredSteps = Array.isArray(data.steps)
    ? data.steps.map((step) => [localize(step.title), localize(step.description)]).filter((step) => step[0] && step[1])
    : [];
  const steps = configuredSteps.length ? configuredSteps : fallbackSteps;
  return `
    <section class="section section-dark"><div class="container process-layout">
      <div class="process-sticky reveal">
        <span class="eyebrow">${escapeHtml(localize(data.eyebrow, tx('From RFQ to delivery', '从询价到交付')))}</span>
        <h2>${escapeHtml(localize(data.title, tx('A clearer path from first review to final delivery.', '从首次评审到最终交付，每一步都更清楚。')))}</h2>
        <p>${escapeHtml(localize(data.intro, tx('You should always know what has been confirmed, what remains open and what happens next.', '您应该始终知道哪些事项已经确认、哪些问题仍待决定，以及下一步会发生什么。')))}</p>
        <button class="button button-light" type="button" data-action="open-rfq">${tx('Start with your drawing', '从图纸开始')}${icon('arrow-right', 18)}</button>
      </div>
      <div class="process-list reveal">
        ${steps.map((step, index) => `<article class="process-step"><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${step[0]}</h3><p>${step[1]}</p></div></article>`).join('')}
      </div>
    </div></section>
  `;
}

function renderIndustryGrid(items = industries()) {
  return `
    <div class="industry-grid reveal">
      ${items.map((item) => `
        <a class="industry-card" data-route href="${routeUrl('/industries')}#${escapeAttr(item.id)}">
          <img src="${escapeAttr(item.image)}" alt="" loading="lazy">
          <div class="industry-card-content"><h3>${escapeHtml(localize(item.title))}</h3><p>${escapeHtml(localize(item.description))}</p></div>
        </a>
      `).join('')}
    </div>
  `;
}

function renderInsightCards(items = insights().slice(0, 3), pageClass = '') {
  return `
    <div class="${pageClass || 'insight-grid'}">
      ${items.map((item) => `
        <a class="insight-card reveal" data-route href="${routeUrl('/insights/' + encodeURIComponent(item.slug))}">
          <div class="insight-media"><img src="${escapeAttr(item.image)}" alt="" loading="lazy"></div>
          <div class="insight-copy">
            <div class="insight-meta"><span></span>${escapeHtml(localize(item.category))} / ${escapeHtml(item.date)}</div>
            <h3>${escapeHtml(localize(item.title))}</h3><p>${escapeHtml(localize(item.excerpt))}</p>
            <span class="text-link">${tx('Read insight', '阅读全文')}${icon('arrow-right', 17)}</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

function renderCta() {
  return `
    <section class="cta-band"><div class="container cta-inner">
      <div class="cta-copy reveal">
        <span class="eyebrow">${tx('A clearer next step', '让下一步更清楚')}</span>
        <h2>${tx('A drawing is enough to start a better manufacturing conversation.', '一张图纸，就可以开始一次专业对话。')}</h2>
        <p>${tx('Send what you have. We will review the part, identify the questions that matter and make the next step clear.', '把已有资料发给我们。我们会认真看懂零件、找出真正需要确认的问题，并把下一步说明清楚。')}</p>
      </div>
      <div class="cta-actions reveal">
        <button class="button button-primary" type="button" data-action="open-rfq">${icon('upload', 18)}${tx('Send Your Drawings', '发送图纸')}</button>
        <a class="button button-ghost-light" href="tel:${COMPANY.phoneHref}">${icon('phone', 18)}${COMPANY.phone}</a>
      </div>
    </div></section>
  `;
}

function renderHome() {
  return `
    ${renderHero()}${renderValueStrip()}
    <section class="section"><div class="container intro-grid">
      <div class="intro-copy reveal">
        <span class="eyebrow">${tx('Dongguan · Custom Metal Manufacturing', '东莞 · 定制金属制造')}</span>
        <h2>${tx('The best manufacturing relationships begin with clarity.', '可靠的制造合作，始于把事情说清楚。')}</h2>
        <p>${tx(
          'Dongguan Zhanyi Hardware Products Co., Ltd. works with engineering and sourcing teams on custom stampings, sheet metal enclosures, terminals, power structures and new-energy components. We begin with the drawing, raise important questions early and keep each decision visible as the project moves toward production.',
          '东莞市展益五金制品有限公司面向工程与采购团队制造定制冲压件、钣金机箱、端子触点、电源结构件和新能源部件。我们从图纸开始，尽早提出重要问题，并让项目走向生产时的每个关键决定保持清晰。'
        )}</p>
        <div class="intro-links">
          <a class="text-link" data-route href="${routeUrl('/about')}">${tx('Meet Zhanyi', '认识展益')}${icon('arrow-right', 17)}</a>
          <a class="text-link" data-route href="${routeUrl('/quality')}">${tx('How we protect quality', '了解质量如何建立')}${icon('arrow-right', 17)}</a>
        </div>
      </div>
      <div class="intro-media reveal">
        <img class="intro-media-main" src="${A('generated/hero-stamping.webp')}" alt="${tx('Metal stamping production environment', '五金冲压生产场景')}" loading="lazy">
        <img class="intro-media-detail" src="${A('products/formed-steel-mounting-bracket.jpg')}" alt="${tx('Custom metal products', '定制五金产品')}" loading="lazy">
        <div class="intro-stamp"><strong>${tx('Drawing-led', '由图纸驱动')}</strong><small>${tx('Built for delivery', '为可靠交付')}</small></div>
      </div>
    </div></section>
    <section class="section section-dark"><div class="container">
      ${sectionHeading(tx('Core capabilities', '核心能力'), tx('One workflow. Fewer unknowns between drawing and delivery.', '一套连贯流程，减少图纸到交付之间的不确定。'), tx('Process, tooling, finish and inspection are considered as connected decisions, each serving the final part and assembly.', '工艺、模具、表面处理与检验不是孤立环节，每个决定都服务于最终零件与装配。'), { path: '/capabilities', label: tx('See how we work', '了解我们如何制造') })}
      ${renderCapabilityCards()}
    </div></section>
    <section class="section"><div class="container">
      ${sectionHeading(tx('Product catalogue', '产品目录'), tx('Representative parts. Your drawing defines the final product.', '展示代表性产品，最终零件由您的图纸定义。'), tx('Explore the range we can discuss across stamping, sheet metal, enclosures, terminals, power and new-energy hardware.', '浏览冲压、钣金、机箱、端子、电源与新能源五金等可沟通产品范围。'), { path: '/products', label: tx('Explore the product range', '查看产品范围') })}
      <div class="product-toolbar reveal">${renderFilters()}<span class="product-count" data-product-count>${productCountLabel(filteredProducts().length)}</span></div>
      <div class="product-grid reveal" data-product-grid data-limit="8">${renderProductGrid(filteredProducts(), 8)}</div>
    </div></section>
    ${renderProcessSection()}
    <section class="section section-paper"><div class="container">
      ${sectionHeading(tx('Industries', '行业应用'), tx('The application should shape the part, and the way it is made.', '先理解零件要完成什么，再决定应当如何制造。'), tx('Connection, support, protection, thermal management and service access lead to different manufacturing decisions.', '连接、承托、防护、散热与维护方式，会导向不同的制造决策。'), { path: '/industries', label: tx('Explore applications', '了解行业应用') })}
      ${renderIndustryGrid()}
    </div></section>
    <section class="quality-band">
      <div class="quality-media"><img src="${A('generated/quality-lab.webp')}" alt="${tx('Precision inspection environment', '精密检验场景')}" loading="lazy"></div>
      <div class="quality-copy">
        <span class="eyebrow">${tx('Quality from the start', '质量从源头开始')}</span><h2>${tx('Quality is decided long before final inspection.', '质量，早在终检之前就已决定。')}</h2>
        <p>${tx('The approved drawing, material identity, first article and process checkpoints create the basis for final acceptance. Inspection confirms the work; clarity controls it.', '确认图纸、材料识别、首件与过程节点共同建立最终验收依据。检验负责确认结果，清晰的标准负责控制过程。')}</p>
        <div class="quality-points">
          ${[tx('One confirmed revision', '一个确认版本'), tx('First article before volume', '量产前首件确认'), tx('Checks where variation matters', '在关键变化处检查'), tx('Clear release basis', '清晰放行依据')].map((item) => `<span class="quality-point">${icon('check', 17)}${item}</span>`).join('')}
        </div>
        <a class="button button-light" data-route href="${routeUrl('/quality')}">${tx('See how quality is built', '了解质量如何建立')}${icon('arrow-right', 18)}</a>
      </div>
    </section>
    <section class="section"><div class="container">
      ${sectionHeading(tx('Engineering insights', '工程与采购洞察'), tx('Better questions lead to better parts.', '问题问得更好，零件才做得更好。'), tx('Practical notes for preparing clearer drawings, stronger RFQs and smoother production handoffs.', '帮助工程与采购团队把图纸、询价和量产交接准备得更清楚。'), { path: '/insights', label: tx('Read the insights', '阅读技术洞察') })}
      ${renderInsightCards()}
    </div></section>
    ${renderCta()}
  `;
}

function sectionData(key) {
  const value = state.content && state.content[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function localizedArray(value) {
  if (Array.isArray(value)) return value.map((item) => localize(item)).filter(Boolean);
  if (value && typeof value === 'object') {
    const candidate = value[state.lang] ?? value.en ?? value.zh;
    if (Array.isArray(candidate)) return candidate.map((item) => localize(item)).filter(Boolean);
  }
  const text = localize(value);
  return text ? [text] : [];
}

function renderCapabilitiesPage() {
  const data = sectionData('capabilities');
  const items = capabilities();
  return `
    ${renderPageHero(
      localize(data.title, tx('Manufacturing Capabilities', '制造能力')),
      localize(data.intro, tx('A connected workflow from drawing review to finished metal components.', '从图纸评审到五金成品的连贯制造流程。')),
      A('generated/tooling-workshop.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/capabilities', label: tx('Capabilities', '制造能力') }]
    )}
    <section class="section"><div class="container">
      ${sectionHeading(
        localize(data.eyebrow, tx('Capabilities', '制造能力')),
        tx('Every capability serves the same goal: a part ready for its real assembly.', '每一项能力，都服务于零件最终的装配与使用。'),
        tx('Material behavior, geometry, tooling, finishing and inspection are reviewed as connected decisions rather than isolated processes.', '材料特性、零件结构、模具、表面处理和检验被放在同一个项目逻辑中判断，而不是彼此割裂。')
      )}
      <div class="capability-detail-grid reveal">
        ${items.map((item, index) => `
          <article class="capability-detail" id="${escapeAttr(item.id)}">
            <img src="${escapeAttr(item.image)}" alt="${escapeAttr(localize(item.title))}" loading="lazy">
            <div class="capability-detail-copy">
              <span>${String(index + 1).padStart(2, '0')} / ${tx('CAPABILITY', '制造能力')}</span>
              <h2>${escapeHtml(localize(item.title))}</h2>
              <p>${escapeHtml(localize(item.description))}</p>
              <ul class="service-list">
                ${localizedArray(item.features).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
              </ul>
            </div>
          </article>
        `).join('')}
      </div>
    </div></section>
    ${renderProcessSection()}
    ${renderCta()}
  `;
}

function renderProductsPage() {
  const visible = filteredProducts();
  return `
    ${renderPageHero(
      tx('Representative Products. Your Drawing Defines the Final Part.', '展示代表性产品，最终零件由您的图纸定义。'),
      tx('Explore stamped parts, terminals, brackets, enclosures, power structures and energy components as a starting point for a drawing-led manufacturing discussion.', '浏览冲压件、端子、支架、机箱、电源结构件和新能源部件，以此作为来图制造沟通的起点。'),
      A('generated/hero-stamping.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/products', label: tx('Products', '产品中心') }]
    )}
    <section class="section"><div class="container">
      <div class="product-page-heading reveal">
        <div><span class="eyebrow">${tx('Product library', '产品图库')}</span><h2>${tx('See what the right manufacturing conversation can begin with.', '从一件相似产品，开始更具体的制造沟通。')}</h2></div>
        <label class="product-search">
          <span class="skip-link">${tx('Search products', '搜索产品')}</span>
          <input type="search" data-product-search value="${escapeAttr(state.search)}" placeholder="${tx('Search product, material or process', '搜索产品、材料或工艺')}">
          ${icon('search', 19)}
        </label>
      </div>
      <div class="product-toolbar reveal">${renderFilters()}<span class="product-count" data-product-count>${productCountLabel(visible.length)}</span></div>
      <div class="product-grid reveal" data-product-grid>${renderProductGrid(visible)}</div>
    </div></section>
    ${renderCta()}
  `;
}

function renderProductDetail(slug) {
  const productItem = state.products.find((item) => item.slug === slug);
  if (!productItem) return renderNotFound();
  const images = productItem.images.length ? productItem.images : [productItem.image];
  const related = state.products.filter((item) => item.slug !== productItem.slug && item.category === productItem.category).slice(0, 4);
  const blocks = [
    [tx('01', '01'), tx('Clarify what matters', '先把关键点说清楚'), tx('Geometry, material, quantity, finish, assembly context and critical features are aligned before planning.', '在规划前对齐结构、材料、数量、表面处理、装配关系和关键特征。')],
    [tx('02', '02'), tx('Choose a practical route', '选择务实的制造路径'), tx('The process is selected around geometry, repeatability, project stage and the result the part must deliver.', '围绕零件结构、重复性、项目阶段与最终用途选择制造路径。')],
    [tx('03', '03'), tx('Define how acceptance works', '明确如何验收'), tx('Inspection points and acceptance references are tied to the approved drawing and agreed project scope.', '让检验节点和验收依据回到确认图纸与双方约定的项目边界。')],
  ];
  return `
    <section class="section section-compact"><div class="container">
      ${renderBreadcrumbs([
        { path: '/', label: tx('Home', '首页') },
        { path: '/products', label: tx('Products', '产品中心') },
        { path: '/products/' + productItem.slug, label: localize(productItem.title) },
      ])}
      <div class="product-detail-layout">
        <div class="product-gallery reveal">
          <div class="gallery-main">
            <img data-gallery-main src="${escapeAttr(images[0])}" alt="${escapeAttr(localize(productItem.title))}">
            <button class="icon-button gallery-zoom" type="button" data-action="zoom-product" data-product="${escapeAttr(productItem.slug)}" title="${tx('Open image viewer', '打开图片查看器')}">${icon('zoom', 20)}</button>
          </div>
          <div class="gallery-thumbs">
            ${images.map((image, index) => `<button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-action="gallery-thumb" data-index="${index}" data-image="${escapeAttr(image)}" aria-label="${tx('View product image', '查看产品图片')} ${index + 1}"><img src="${escapeAttr(image)}" alt=""></button>`).join('')}
          </div>
        </div>
        <div class="product-detail-copy reveal">
          <span class="eyebrow">${escapeHtml(categoryLabel(productItem.category))}</span>
          <h1>${escapeHtml(localize(productItem.title))}</h1>
          <p class="lead">${escapeHtml(localize(productItem.description))}</p>
          <dl class="spec-list">
            <div class="spec-row"><dt>${tx('Process', '工艺')}</dt><dd>${escapeHtml(localize(productItem.process, tx('Defined for the project', '按项目确定')))}</dd></div>
            <div class="spec-row"><dt>${tx('Materials', '材料')}</dt><dd>${escapeHtml(localize(productItem.materials, tx('Per drawing requirements', '按图纸要求')))}</dd></div>
            <div class="spec-row"><dt>${tx('Finish', '表面处理')}</dt><dd>${escapeHtml(localize(productItem.finish, tx('Per drawing requirements', '按图纸要求')))}</dd></div>
            <div class="spec-row"><dt>${tx('Applications', '应用')}</dt><dd>${escapeHtml(localize(productItem.applications, tx('Project-specific applications', '按项目应用要求')))}</dd></div>
          </dl>
          <div class="detail-actions">
            <button class="button button-primary" type="button" data-action="open-rfq" data-product="${escapeAttr(localize(productItem.title))}">${icon('send', 18)}${tx('Discuss This Part', '沟通这个零件')}</button>
            <a class="button button-outline" href="tel:${COMPANY.phoneHref}">${icon('phone', 18)}${tx('Speak with us', '直接沟通')}</a>
          </div>
          <p class="detail-note">${tx('This image represents a part family, not a fixed catalogue specification. Your approved drawing defines the final material, geometry, finish and acceptance basis.', '图片用于展示代表性零件类型，并非固定目录规格。最终材料、结构、表面处理与验收依据由确认图纸定义。')}</p>
        </div>
      </div>
    </div></section>
    <section class="section section-paper"><div class="container">
      <div class="detail-content-grid reveal">
        ${blocks.map((block) => `<article class="detail-content-block"><span>${block[0]}</span><h3>${block[1]}</h3><p>${block[2]}</p></article>`).join('')}
      </div>
    </div></section>
    ${related.length ? `<section class="section"><div class="container">${sectionHeading(tx('Related products', '相关产品'), tx('Other ways this capability takes shape.', '同类能力，还可以呈现为这些产品。'), tx('Use these representative parts to make your drawing-led manufacturing discussion more specific.', '以这些代表性零件为参考，让来图制造沟通更具体。'))}<div class="product-grid reveal">${renderProductGrid(related)}</div></div></section>` : ''}
    ${renderCta()}
  `;
}

function renderIndustriesPage() {
  const data = sectionData('industries');
  const items = industries();
  return `
    ${renderPageHero(
      localize(data.title, tx('Industries', '应用行业')),
      localize(data.intro, tx('Metal parts planned around the practical role they play in products and equipment.', '围绕金属零件在产品和设备中的实际作用规划制造。')),
      A('generated/global-review.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/industries', label: tx('Industries', '应用行业') }]
    )}
    <section class="section"><div class="container">
      ${sectionHeading(localize(data.eyebrow, tx('Industries', '应用行业')), tx('Understand the job before choosing the process.', '先理解零件的职责，再选择制造方式。'), tx('Connection, support, protection, thermal management and service access each lead to different decisions in geometry, material, finish and inspection.', '连接、承托、防护、散热与维护方式，会分别影响结构、材料、表面处理与检验决策。'))}
      <div class="industry-page-grid reveal">
        ${items.map((item, index) => `
          <article class="industry-page-item" id="${escapeAttr(item.id)}">
            <img src="${escapeAttr(item.image)}" alt="${escapeAttr(localize(item.title))}" loading="lazy">
            <div class="industry-page-copy"><span>${String(index + 1).padStart(2, '0')} / ${tx('INDUSTRY', '应用行业')}</span><h2>${escapeHtml(localize(item.title))}</h2><p>${escapeHtml(localize(item.description))}</p></div>
          </article>
        `).join('')}
      </div>
    </div></section>
    ${renderCta()}
  `;
}

function renderQualityPage() {
  const data = sectionData('quality');
  const principles = Array.isArray(data.principles) && data.principles.length ? data.principles : qualitySteps;
  const documentation = data.documentation || {};
  const checks = localizedArray(documentation.items);
  return `
    ${renderPageHero(
      localize(data.title, tx('Quality Management', '质量管理')),
      localize(data.summary, tx('Quality planning starts with the approved drawing and confirmed project requirements.', '质量策划从确认图纸和项目要求开始。')),
      A('generated/quality-lab.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/quality', label: tx('Quality', '质量管理') }]
    )}
    <section class="section"><div class="container">
      ${sectionHeading(localize(data.eyebrow, tx('Quality management', '质量管理')), tx('Clear acceptance begins with a shared definition of good.', '先共同定义什么是合格，验收才会清晰。'), tx('Material, critical features, appearance, assembly relationships and records are checked against one confirmed project basis.', '材料、关键特征、外观、装配关系和资料，都回到同一个确认项目基准。'))}
      <div class="quality-flow reveal">
        ${principles.slice(0, 5).map((item, index) => `<article class="quality-flow-step"><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(localize(item.title))}</h3><p>${escapeHtml(localize(item.description))}</p></article>`).join('')}
      </div>
    </div></section>
    <section class="section section-paper"><div class="container quality-evidence">
      <img class="reveal" src="${A('generated/quality-lab.webp')}" alt="${tx('Precision inspection environment', '精密检验场景')}" loading="lazy">
      <div class="quality-evidence-copy reveal">
        <span class="eyebrow">${tx('Evidence for acceptance', '验收依据')}</span>
        <h2>${escapeHtml(localize(documentation.title, tx('Clear records support clear acceptance.', '清晰资料支撑清晰验收。')))}</h2>
        <p>${escapeHtml(localize(documentation.description, tx('Inspection records and approval information are planned according to actual project requirements.', '检验记录和确认资料根据实际项目要求进行规划。')))}</p>
        <div class="quality-checks">
          ${(checks.length ? checks : [tx('Drawing revision records', '图纸版本记录'), tx('First-article approval', '首件确认资料'), tx('Project-agreed inspection records', '项目约定检验记录'), tx('Packing and labeling requirements', '包装与标签要求')]).map((item) => `<div class="quality-check">${icon('check', 19)}<span>${escapeHtml(item)}</span></div>`).join('')}
        </div>
      </div>
    </div></section>
    ${renderProcessSection()}
    ${renderCta()}
  `;
}

function renderAboutPage() {
  const data = sectionData('about');
  const strengths = Array.isArray(data.strengths) ? data.strengths : [];
  const icons = ['layers', 'compass', 'wrench', 'globe'];
  return `
    ${renderPageHero(
      localize(data.title, tx('About Zhanyi', '关于展益')),
      localize(data.positioning, tx('A clear, practical interface between customer product teams and manufacturing execution.', '成为客户产品团队与制造现场之间清晰、务实的协作接口。')),
      A('generated/global-review.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/about', label: tx('About', '关于展益') }]
    )}
    <section class="section"><div class="container about-grid">
      <div class="about-copy reveal">
        <span class="eyebrow">${escapeHtml(localize(data.eyebrow, tx('About us', '关于我们')))}</span>
        <h2>${tx('Good parts begin with a working relationship built on clarity.', '好的零件，始于一段把事情说清楚的合作关系。')}</h2>
        <p>${escapeHtml(localize(data.overview, tx('Dongguan Zhanyi focuses on custom metal stamping, sheet metal fabrication, tooling and hardware components.', '东莞市展益五金制品有限公司专注于定制五金冲压、钣金、模具与五金零部件。')))}</p>
        <p>${escapeHtml(localize(data.positioning))}</p>
        <button class="button button-primary" type="button" data-action="open-rfq">${icon('send', 18)}${tx('Start with your drawing', '从图纸开始')}</button>
      </div>
      <div class="about-media-grid reveal">
        <img src="${A('generated/hero-stamping.webp')}" alt="${tx('Precision stamping environment', '精密冲压场景')}" loading="lazy">
        <img src="${A('generated/tooling-workshop.webp')}" alt="${tx('Tooling review', '模具评审')}" loading="lazy">
        <img src="${A('generated/quality-lab.webp')}" alt="${tx('Inspection environment', '检验场景')}" loading="lazy">
      </div>
    </div></section>
    <section class="section section-paper"><div class="container">
      ${sectionHeading(tx('How we work', '我们的工作方式'), tx('Trust is built in the way the work is handled.', '信任，建立在每一次具体的处理方式里。'), tx('We keep drawings, open questions, manufacturing decisions and acceptance criteria visible so collaboration stays practical and accountable.', '让图纸、开放问题、制造决策与验收依据始终清晰可见，使合作保持务实，也让责任有迹可循。'))}
      <div class="principle-grid reveal">
        ${strengths.map((item, index) => `<article class="principle">${icon(icons[index % icons.length], 28)}<h3>${escapeHtml(localize(item.title))}</h3><p>${escapeHtml(localize(item.description))}</p></article>`).join('')}
      </div>
    </div></section>
    ${renderCta()}
  `;
}

function renderInsightsPage() {
  const data = sectionData('insights');
  const items = insights();
  const routeSlug = routeInfo().path.startsWith('/insights/') ? routeInfo().path.split('/').filter(Boolean)[1] : '';
  const activeSlug = routeSlug || decodeURIComponent(location.hash.replace(/^#/, ''));
  const active = items.find((item) => item.slug === activeSlug);
  const breadcrumbs = [{ path: '/', label: tx('Home', '首页') }, { path: '/insights', label: tx('Insights', '工程洞察') }];
  if (active) breadcrumbs.push({ path: '/insights/' + active.slug, label: localize(active.title) });
  return `
    ${renderPageHero(
      localize(data.title, tx('Engineering Insights', '工程洞察')),
      localize(data.intro, tx('Practical guidance for drawing preparation, process selection, finishing and RFQ information.', '围绕图纸准备、工艺选择、表面处理和询价资料提供实用内容。')),
      A('generated/tooling-workshop.webp'),
      breadcrumbs
    )}
    <section class="section"><div class="container">
      ${sectionHeading(localize(data.eyebrow, tx('Insights', '技术洞察')), tx('Better decisions start before the first part is made.', '更好的决定，发生在第一件零件制造之前。'), tx('Each article turns a common sourcing or engineering question into practical information you can use in the next RFQ or design review.', '每篇内容都把常见的采购或工程问题，转化为下一次询价和设计评审中可以直接使用的信息。'))}
      ${active ? `<article class="article-expanded reveal" id="${escapeAttr(active.slug)}"><span class="eyebrow">${escapeHtml(localize(active.category))}</span><h2>${escapeHtml(localize(active.title))}</h2><p>${escapeHtml(localize(active.excerpt))}</p>${active.sections.length ? active.sections.map((section) => `<h3>${escapeHtml(localize(section.heading))}</h3><p>${escapeHtml(localize(section.body))}</p>`).join('') : `<p>${escapeHtml(localize(active.body))}</p>`}</article><div class="section-compact"></div>` : ''}
      ${renderInsightCards(items, 'insights-page-grid')}
    </div></section>
    ${renderCta()}
  `;
}

function renderRfqForm(formId, options = {}) {
  const selectedProduct = options.productName || '';
  const formspreeFormId = String(state.settings.formspreeFormId || FORMSPREE_FORM_ID).trim();
  return `
    <form class="rfq-form" id="${escapeAttr(formId)}" data-rfq-form action="https://formspree.io/f/${escapeAttr(formspreeFormId)}" method="POST">
      <input type="hidden" name="_subject" value="New manufacturing inquiry from the Zhanyi website">
      <input class="honeypot" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form-grid">
        <div class="form-field"><label for="${formId}-name">${tx('Name', '姓名')} <span>*</span></label><input id="${formId}-name" name="name" type="text" autocomplete="name" required maxlength="120" data-fs-field><span class="field-error" data-fs-error="name"></span></div>
        <div class="form-field"><label for="${formId}-company">${tx('Company', '公司')} <span>*</span></label><input id="${formId}-company" name="company" type="text" autocomplete="organization" required maxlength="180" data-fs-field><span class="field-error" data-fs-error="company"></span></div>
        <div class="form-field"><label for="${formId}-email">${tx('Business email', '工作邮箱')} <span>*</span></label><input id="${formId}-email" name="email" type="email" autocomplete="email" required maxlength="240" data-fs-field><span class="field-error" data-fs-error="email"></span></div>
        <div class="form-field"><label for="${formId}-phone">${tx('Phone / WhatsApp', '电话 / WhatsApp')}</label><input id="${formId}-phone" name="phone" type="tel" autocomplete="tel" maxlength="80"></div>
        <div class="form-field"><label for="${formId}-country">${tx('Country or region', '国家或地区')}</label><input id="${formId}-country" name="country" type="text" autocomplete="country-name" maxlength="100"></div>
        <div class="form-field"><label for="${formId}-category">${tx('Product category', '产品类别')}</label><select id="${formId}-category" name="productCategory"><option value="">${tx('Select a category', '选择产品类别')}</option>${state.categories.map((item) => `<option value="${escapeAttr(localize(item.label))}">${escapeHtml(localize(item.label))}</option>`).join('')}</select></div>
        <div class="form-field"><label for="${formId}-quantity">${tx('Expected quantity', '预计数量')}</label><input id="${formId}-quantity" name="quantity" type="text" maxlength="100" placeholder="${tx('Prototype, first batch, annual volume...', '样件、首批数量、年用量等')}"></div>
        <div class="form-field"><label for="${formId}-product">${tx('Part or project name', '零件或项目名称')}</label><input id="${formId}-product" name="productName" type="text" maxlength="180" value="${escapeAttr(selectedProduct)}"></div>
        <div class="form-field full"><label for="${formId}-message">${tx('What should we understand?', '希望我们重点了解什么？')} <span>*</span></label><textarea id="${formId}-message" name="message" required maxlength="12000" placeholder="${tx('Tell us what the part must do, material or finish requirements, assembly context and target timing.', '请说明零件用途、材料或表面要求、装配关系与目标时间。')}" data-fs-field></textarea><span class="field-error" data-fs-error="message"></span></div>
        <div class="form-field full">
          <span class="form-label">${tx('Drawings and attachments', '图纸与附件')}</span>
          <label class="file-drop" for="${formId}-files" data-file-drop>
            ${icon('upload', 24)}<strong>${tx('Add drawings or reference files', '添加图纸或参考资料')}</strong>
            <small>PDF, DWG, DXF, STEP, STP, IGES, IGS, ZIP, JPG, PNG, WEBP · ${tx('12 files / 30 MB total', '最多12个 / 总计30 MB')}</small>
            <input id="${formId}-files" type="file" data-file-input multiple accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.zip,.jpg,.jpeg,.png,.webp">
          </label>
          <p class="static-form-note">${tx('Selected file names will be included in the inquiry. Because this static site does not store files, send the actual drawings by replying to our email or continuing on WhatsApp after submission.', '所选文件名会随询盘提交。由于静态网站不存储文件，提交后请通过回复邮件或 WhatsApp 继续发送实际图纸。')}</p>
          <div class="file-list" data-file-list></div>
        </div>
        <label class="checkbox-row form-field full"><input type="checkbox" name="nda" value="yes"><span>${tx('An NDA is required before detailed drawing review.', '详细图纸评审前需要签署保密协议。')}</span></label>
      </div>
      <div class="form-actions static-form-actions">
        <button class="button button-primary" type="submit" data-fs-submit-btn>${icon('send', 18)}${tx('Send for Review', '提交评审')}</button>
        <button class="button button-outline" type="button" data-action="copy-rfq" data-form="${escapeAttr(formId)}">${icon('file', 18)}${tx('Copy inquiry details', '复制询价内容')}</button>
        <span class="muted">${tx('Service target: initial review within 24 hours after complete information is received.', '服务目标：收到完整资料后24小时内完成首次评审。')}</span>
      </div>
      <p class="form-status" data-form-status role="status"></p>
    </form>
  `;
}

function renderMapSection() {
  const lat = Number(state.settings.mapLatitude) || DEFAULT_MAP.lat;
  const lng = Number(state.settings.mapLongitude) || DEFAULT_MAP.lng;
  const zoom = Math.min(18, Math.max(3, Number(state.settings.mapZoom) || 12));
  const provider = ['leaflet', 'baidu', 'baidu-embed'].includes(String(state.settings.mapProvider || '').toLowerCase())
    ? String(state.settings.mapProvider).toLowerCase()
    : 'baidu-embed';
  const mapStatus = ['exact', 'city_level', 'region_level'].includes(String(state.settings.mapStatus || '').toLowerCase())
    ? String(state.settings.mapStatus).toLowerCase()
    : 'city_level';
  const address = state.lang === 'zh'
    ? (state.settings.address || '中国广东省东莞市（具体地址请在项目联系时确认）')
    : (state.settings.addressEn || 'Dongguan, Guangdong, China (full address shared during project contact)');
  const markerUrl = `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(companyName())}&content=${encodeURIComponent(address)}&output=html&src=zhanyi-static-site`;
  const precisionLabel = mapStatus === 'exact'
    ? tx('Verified location', '已核实位置')
    : mapStatus === 'region_level'
      ? tx('Registered address area', '登记地址区域')
      : tx('City-level location', '城市级定位');
  return `
    <section class="map-section">
      <div class="map-copy">
        <span class="eyebrow">${tx('Dongguan, China', '中国 · 东莞')}</span>
        <h2>${tx('Based in Dongguan. Ready for projects beyond borders.', '扎根东莞，面向更广阔的合作。')}</h2>
        <p>${escapeHtml(address)}</p>
        <a class="button button-light" href="${escapeAttr(markerUrl)}" target="_blank" rel="noopener">${icon('map-pin', 18)}${tx('Plan a route with Baidu Maps', '使用百度地图规划路线')}</a>
      </div>
      <div class="map-canvas map-is-loading" role="region" aria-label="${escapeAttr(tx('Interactive location map', '交互式位置地图'))}" data-map data-provider="${provider}" data-lat="${lat}" data-lng="${lng}" data-zoom="${zoom}" data-map-status="${mapStatus}" data-address="${escapeAttr(address)}">
        <div class="map-surface" data-map-surface></div>
        <div class="map-fallback">
          <div class="map-label">
            <strong>${escapeHtml(companyName())}</strong>
            <small>${escapeHtml(address)}</small>
            <span class="map-load-state" data-map-state>${tx('Loading interactive map...', '正在加载交互地图...')}</span>
            <button class="map-retry" type="button" data-action="retry-map" hidden>${icon('refresh', 15)}${tx('Retry map', '重新加载')}</button>
          </div>
        </div>
        <div class="map-location-badge">${icon('map-pin', 14)}<span>${precisionLabel}</span></div>
      </div>
    </section>
  `;
}

function renderContactPage() {
  const data = sectionData('contact');
  const phone = state.settings.phone || COMPANY.phone;
  const phoneHref = String(phone).replace(/[^+\d]/g, '');
  const address = state.lang === 'zh' ? state.settings.address : state.settings.addressEn;
  return `
    ${renderPageHero(
      localize(data.title, tx('Share Your Project Requirement', '提交您的项目需求')),
      localize(data.description, tx('Send drawings, quantity, material, finish and target timing where possible.', '请尽量提供图纸、数量、材料、表面处理和目标时间。')),
      A('generated/global-review.webp'),
      [{ path: '/', label: tx('Home', '首页') }, { path: '/contact', label: tx('Contact', '联系我们') }]
    )}
    <section class="section"><div class="container contact-layout">
      <aside class="contact-sidebar reveal">
        <span class="eyebrow">${escapeHtml(localize(data.eyebrow, tx('Project inquiry', '项目咨询')))}</span>
        <h2>${tx('Begin with what you know. We will help clarify the rest.', '先从已有资料开始，剩下的我们一起厘清。')}</h2>
        <p>${escapeHtml(localize(data.description))}</p>
        <div class="contact-methods">
          <a class="contact-method" href="tel:${escapeAttr(phoneHref)}">${icon('phone', 23)}<span><small>${tx('Phone', '联系电话')}</small><strong>${escapeHtml(phone)}</strong></span></a>
          <a class="contact-method" href="${escapeAttr(whatsappUrl())}" target="_blank" rel="noopener">${icon('message', 23)}<span><small>WhatsApp</small><strong>${escapeHtml(phone)}</strong></span></a>
          <div class="contact-method">${icon('map-pin', 23)}<span><small>${tx('Location', '所在地区')}</small><strong>${escapeHtml(address || tx('Dongguan, Guangdong, China', '中国广东省东莞市'))}</strong></span></div>
          <div class="contact-method">${icon('gauge', 23)}<span><small>${tx('Service target', '服务目标')}</small><strong>${tx('Initial review within 24 hours after complete information is received', '收到完整资料后24小时内完成首次评审')}</strong></span></div>
        </div>
      </aside>
      <div class="rfq-panel reveal">
        <div class="rfq-panel-heading"><h2>${tx('Request an engineering review', '申请工程评审')}</h2><p>${tx('Tell us what the part must do and share the information you already have. We will review the project basis and respond with the questions or next step that matter.', '告诉我们零件要完成什么，并提交您已有的资料。我们会评审项目基础，并带着真正需要确认的问题或下一步回复。')}</p></div>
        ${renderRfqForm('contact-rfq')}
      </div>
    </div></section>
    ${renderMapSection()}
  `;
}

function renderNotFound() {
  return `
    ${renderPageHero('404', tx('The page you requested could not be found.', '未找到您访问的页面。'), A('generated/hero-stamping.webp'), [{ path: '/', label: tx('Home', '首页') }, { path: location.pathname, label: '404' }])}
    <section class="section"><div class="container"><h2 class="display-title">${tx('Return to the project starting point.', '返回项目起点。')}</h2><p class="muted">${tx('Use the product catalogue or send us a drawing for review.', '您可以浏览产品目录，或发送图纸进行评审。')}</p><div class="detail-actions"><a class="button button-dark" data-route href="${routeUrl('/')}">${tx('Back to home', '返回首页')}</a><a class="button button-outline" data-route href="${routeUrl('/products')}">${tx('Browse products', '浏览产品')}</a></div></div></section>
  `;
}

function renderFooter() {
  const phone = state.settings.phone || COMPANY.phone;
  const phoneHref = String(phone).replace(/[^+\d]/g, '');
  const disclaimer = localize(state.content.common?.disclaimer, tx('Capability visuals are illustrative, and product images represent part families. Final specifications follow the approved drawing.', '能力场景图为示意视觉，产品图片用于展示代表性零件类型，最终规格以确认图纸为准。'));
  return `
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand">
          <a class="brand" data-route href="${routeUrl('/')}">${brandMarkup()}</a>
          <p>${escapeHtml(disclaimer)}</p>
          <a class="footer-phone" href="tel:${escapeAttr(phoneHref)}">${icon('phone', 19)}${escapeHtml(phone)}</a>
        </div>
        <div class="footer-column">
          <h2>${tx('Company', '公司')}</h2>
          <div class="footer-links">
            <a data-route href="${routeUrl('/about')}">${tx('About Zhanyi', '关于展益')}</a>
            <a data-route href="${routeUrl('/quality')}">${tx('Quality Management', '质量管理')}</a>
            <a data-route href="${routeUrl('/industries')}">${tx('Industries', '应用行业')}</a>
            <a data-route href="${routeUrl('/insights')}">${tx('Engineering Insights', '工程与采购洞察')}</a>
          </div>
        </div>
        <div class="footer-column">
          <h2>${tx('Capabilities', '制造能力')}</h2>
          <div class="footer-links">
            ${capabilities().slice(0, 5).map((item) => `<a data-route href="${routeUrl('/capabilities')}#${escapeAttr(item.id)}">${escapeHtml(localize(item.title))}</a>`).join('')}
          </div>
        </div>
        <div class="footer-column">
          <h2>${tx('Start with a drawing', '从一张图纸开始')}</h2>
          <div class="footer-contact-actions">
            <button class="button button-primary" type="button" data-action="open-rfq">${icon('send', 18)}${tx('Send Your Drawings', '发送图纸')}</button>
            <a class="button button-ghost-light" href="${escapeAttr(whatsappUrl())}" target="_blank" rel="noopener">${icon('message', 18)}WhatsApp</a>
            <a class="button button-ghost-light" data-route href="${routeUrl('/contact')}">${icon('map-pin', 18)}${tx('Contact page', '联系页面')}</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(companyName())} ${tx('All rights reserved.', '保留所有权利。')}</span>
        <div class="footer-bottom-links"><a data-route href="${routeUrl('/contact')}">${tx('Project contact', '项目联系')}</a><a href="${staticFileUrl('sitemap.xml')}" target="_blank">Sitemap</a></div>
      </div>
    </footer>
  `;
}

function renderDialogs() {
  return `
    <dialog class="rfq-dialog" id="rfq-dialog">
      <div class="dialog-header"><h2>${tx('Send Your Project for Review', '提交项目评审')}</h2><button class="icon-button dialog-close" type="button" data-action="close-rfq" title="${tx('Close', '关闭')}">${icon('x', 20)}</button></div>
      <div class="dialog-body">${renderRfqForm('modal-rfq')}</div>
    </dialog>
    <dialog class="lightbox-dialog" id="lightbox-dialog">
      <div class="lightbox-stage">
        <button class="icon-button dialog-close" type="button" data-action="close-lightbox" title="${tx('Close', '关闭')}">${icon('x', 21)}</button>
        <button class="icon-button lightbox-nav lightbox-prev" type="button" data-action="lightbox-prev" title="${tx('Previous image', '上一张')}">${icon('arrow-left', 22)}</button>
        <img data-lightbox-image alt="">
        <button class="icon-button lightbox-nav lightbox-next" type="button" data-action="lightbox-next" title="${tx('Next image', '下一张')}">${icon('arrow-right', 22)}</button>
      </div>
    </dialog>
    <div class="toast-region" data-toast-region aria-live="polite" aria-atomic="false"></div>
  `;
}

function renderMobileContactBar() {
  const phone = state.settings.phone || COMPANY.phone;
  const phoneHref = String(phone).replace(/[^+\d]/g, '');
  return `
    <div class="mobile-contact-bar">
      <a href="tel:${escapeAttr(phoneHref)}">${icon('phone', 18)}${tx('Call', '电话')}</a>
      <a href="${escapeAttr(whatsappUrl())}" target="_blank" rel="noopener">${icon('message', 18)}WhatsApp</a>
      <button type="button" data-action="open-rfq">${icon('send', 18)}${tx('Start RFQ', '发起询价')}</button>
    </div>
    <button class="icon-button back-to-top" type="button" data-action="back-to-top" title="${tx('Back to top', '返回顶部')}">${icon('arrow-up', 20)}</button>
  `;
}

function renderRouteBody() {
  const { path } = routeInfo();
  const aliases = {
    '/chanpinzhongxin.html': '/products',
    '/lianxiwomen.html': '/contact',
    '/gongsijianjie.html': '/about',
    '/shebeizhanshi.html': '/capabilities',
    '/xinwenzixun.html': '/insights',
  };
  const activePath = aliases[path] || path;
  if (activePath === '/') return renderHome();
  if (activePath === '/capabilities' || activePath.startsWith('/capabilities/')) return renderCapabilitiesPage();
  if (activePath === '/products') return renderProductsPage();
  if (activePath.startsWith('/products/')) return renderProductDetail(decodeURIComponent(activePath.slice('/products/'.length)));
  if (activePath === '/industries') return renderIndustriesPage();
  if (activePath === '/quality') return renderQualityPage();
  if (activePath === '/about') return renderAboutPage();
  if (activePath === '/insights' || activePath.startsWith('/insights/')) return renderInsightsPage();
  if (activePath === '/contact') return renderContactPage();
  return renderNotFound();
}

function renderShell(body) {
  return `${renderHeader()}<main id="main-content">${body}</main>${renderFooter()}${renderDialogs()}${renderMobileContactBar()}`;
}

function pageKey(path) {
  if (path === '/') return 'home';
  return path.split('/').filter(Boolean)[0] || 'home';
}

function updateMetadata() {
  const { path } = routeInfo();
  const key = pageKey(path);
  const seo = state.content.seo || {};
  const page = seo.pages?.[key] || {};
  let title = localize(page.title, localize(seo.defaultTitle, `${companyName()} | ${tx('Custom Metal Manufacturing', '定制五金制造')}`));
  let description = localize(page.description, localize(seo.defaultDescription, tx('Custom metal parts manufactured from approved drawings, with visible decisions from engineering review to delivery.', '依据确认图纸制造定制金属零件，让从工程评审到交付的关键决定始终清晰可见。')));
  const imageByPage = {
    quality: A('generated/quality-lab.webp'),
    about: A('generated/global-review.webp'),
    insights: A('generated/tooling-workshop.webp'),
  };
  let socialImage = imageByPage[key] || A('generated/hero-stamping.webp');
  if (path.startsWith('/products/')) {
    const productItem = productForSlug(decodeURIComponent(path.slice('/products/'.length)));
    if (productItem) {
      title = `${localize(productItem.title)} | ${companyName()}`;
      description = localize(productItem.description, description);
      socialImage = productItem.image || socialImage;
    }
  } else if (path.startsWith('/insights/')) {
    const insight = insights().find((item) => item.slug === decodeURIComponent(path.slice('/insights/'.length)));
    if (insight) {
      title = `${localize(insight.title)} | ${companyName()}`;
      description = localize(insight.excerpt, description);
      socialImage = insight.image || socialImage;
    }
  }
  document.title = title;
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.textContent = tx('Skip to content', '跳到主要内容');
  const setMeta = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
  };
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', socialImage);
  setMeta('meta[property="og:url"]', location.origin + routeUrl(path, state.lang));
  setMeta('meta[property="og:locale"]', state.lang === 'zh' ? 'zh_CN' : 'en_US');
  setMeta('meta[property="og:locale:alternate"]', state.lang === 'zh' ? 'en_US' : 'zh_CN');
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = location.origin + routeUrl(path, state.lang);
  const setAlternate = (hreflang, href) => {
    let alternate = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!alternate) {
      alternate = document.createElement('link');
      alternate.rel = 'alternate';
      alternate.hreflang = hreflang;
      document.head.appendChild(alternate);
    }
    alternate.href = href;
  };
  const englishUrl = location.origin + routeUrl(path, 'en');
  const chineseUrl = location.origin + routeUrl(path, 'zh');
  setAlternate('en', englishUrl);
  setAlternate('zh-CN', chineseUrl);
  setAlternate('x-default', englishUrl);
}

function syncRouteState() {
  const route = routeInfo();
  state.lang = route.lang;
  if (route.path === '/products') {
    const params = new URLSearchParams(location.search);
    const requestedCategory = params.get('category') || 'all';
    state.filter = requestedCategory === 'all' || state.categories.some((item) => item.id === requestedCategory) ? requestedCategory : 'all';
    state.search = params.get('q') || '';
  }
}

function scrollToRouteTarget() {
  const route = routeInfo();
  let targetId = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!targetId && route.path.startsWith('/capabilities/')) targetId = route.path.slice('/capabilities/'.length);
  if (!targetId) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  requestAnimationFrame(() => {
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}

function renderApp(options = {}) {
  clearInterval(state.heroTimer);
  state.heroTimer = null;
  state.revealObserver?.disconnect();
  state.revealObserver = null;
  destroyActiveMap();
  syncRouteState();
  const root = document.getElementById('app');
  try {
    root.innerHTML = renderShell(renderRouteBody());
    updateMetadata();
    initializeReveals();
    initializeHero();
    initializeMap();
    initializeRfqForms();
    updateScrollUi();
    if (options.scroll !== false) scrollToRouteTarget();
  } catch (error) {
    console.error(error);
    root.innerHTML = `<main class="app-error"><div><strong>${tx('The page could not be rendered.', '页面暂时无法显示。')}</strong><p>${escapeHtml(error.message || '')}</p><button class="button button-dark" type="button" onclick="location.reload()">${tx('Reload', '重新加载')}</button></div></main>`;
  }
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) throw new Error(payload.message || payload.error || `Request failed: ${response.status}`);
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

async function loadApplicationData() {
  bindGlobalEvents();
  const results = await Promise.allSettled([
    fetchJson(staticFileUrl('data/site-content.json')),
    fetchJson(staticFileUrl('data/products.json')),
    fetchJson(staticFileUrl('data/settings.json')),
  ]);
  const failures = [];
  if (results[0].status === 'fulfilled') state.content = results[0].value.content || results[0].value.data || results[0].value || {};
  else failures.push(tx('content', '内容'));
  if (results[1].status === 'fulfilled') {
    const payload = results[1].value;
    const rawCategories = payload.categories || payload.data?.categories || [];
    const rawProducts = payload.products || payload.items || payload.data?.products || [];
    if (rawCategories.length) state.categories = rawCategories.map(normalizeCategory);
    if (rawProducts.length) state.products = rawProducts.map(normalizeProduct);
  } else failures.push(tx('products', '产品'));
  if (results[2].status === 'fulfilled') state.settings = results[2].value.settings || results[2].value.data || results[2].value || {};
  else failures.push(tx('settings', '设置'));
  renderApp();
  if (failures.length) showToast(tx(`Some live data could not be loaded: ${failures.join(', ')}. Fallback content is active.`, `部分在线数据加载失败：${failures.join('、')}。当前已启用本地内容。`), 'error');
}

function initializeReveals() {
  const elements = [...document.querySelectorAll('.reveal')];
  if (!elements.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  state.revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
  elements.forEach((element) => state.revealObserver.observe(element));
}

function activateHero(index, restart = true) {
  const slides = [...document.querySelectorAll('[data-hero-slide]')];
  if (!slides.length) return;
  state.heroIndex = (Number(index) + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === state.heroIndex;
    slide.classList.toggle('active', active);
    slide.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  document.querySelectorAll('.hero-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === state.heroIndex));
  const current = document.querySelector('[data-hero-current]');
  if (current) current.textContent = String(state.heroIndex + 1).padStart(2, '0');
  if (restart) startHeroTimer();
}

function stopHeroTimer() {
  clearInterval(state.heroTimer);
  state.heroTimer = null;
}

function pauseHeroTimer() {
  state.heroPaused = true;
  stopHeroTimer();
}

function resumeHeroTimer() {
  state.heroPaused = false;
  startHeroTimer();
}

function startHeroTimer() {
  stopHeroTimer();
  const slides = document.querySelectorAll('[data-hero-slide]');
  if (slides.length < 2 || state.heroPaused || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  state.heroTimer = setInterval(() => activateHero(state.heroIndex + 1, false), 5200);
}

function initializeHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const controls = hero.querySelector('.hero-controls');
  state.heroPaused = false;
  activateHero(Math.min(state.heroIndex, Math.max(0, heroSlides().length - 1)), false);
  controls?.addEventListener('mouseenter', pauseHeroTimer);
  controls?.addEventListener('mouseleave', resumeHeroTimer);
  controls?.addEventListener('focusin', pauseHeroTimer);
  controls?.addEventListener('focusout', (event) => {
    if (!controls.contains(event.relatedTarget)) resumeHeroTimer();
  });
  startHeroTimer();
}

function updateScrollUi() {
  document.getElementById('site-header')?.classList.toggle('is-scrolled', window.scrollY > 18);
  document.querySelector('.back-to-top')?.classList.toggle('visible', window.scrollY > 520);
}

function navigateTo(target, options = {}) {
  const url = target instanceof URL ? target : new URL(target, location.href);
  if (url.origin !== location.origin) {
    location.href = url.href;
    return;
  }
  closeNavigationMenu();
  closeDialog('rfq-dialog');
  closeDialog('lightbox-dialog');
  const next = url.pathname + url.search + url.hash;
  if (options.replace) history.replaceState({}, '', next);
  else if (next !== location.pathname + location.search + location.hash) history.pushState({}, '', next);
  renderApp({ scroll: options.scroll !== false });
}

function updateNavigationMenuButton(button, open) {
  if (!button) return;
  const label = open ? tx('Close menu', '关闭菜单') : tx('Open menu', '打开菜单');
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  button.innerHTML = icon(open ? 'x' : 'menu', 21);
}

function setMobileSubnavState(item, open) {
  if (!item) return;
  const button = item.querySelector('[data-action="toggle-subnav"]');
  const panel = item.querySelector('.mobile-subnav');
  item.classList.toggle('sub-open', Boolean(open));
  if (!button) return;
  const label = open ? tx('Hide submenu', '收起子菜单') : tx('Show submenu', '展开子菜单');
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  panel?.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function closeNavigationMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const button = document.querySelector('[data-action="toggle-menu"]');
  drawer?.classList.remove('open');
  drawer?.setAttribute('aria-hidden', 'true');
  drawer?.querySelectorAll('.mobile-nav > li').forEach((item) => setMobileSubnavState(item, false));
  updateNavigationMenuButton(button, false);
  syncBodyScrollLock();
}

function toggleNavigationMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const button = document.querySelector('[data-action="toggle-menu"]');
  if (!drawer || !button) return;
  const open = !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (!open) drawer.querySelectorAll('.mobile-nav > li').forEach((item) => setMobileSubnavState(item, false));
  updateNavigationMenuButton(button, open);
  syncBodyScrollLock();
}

function syncBodyScrollLock() {
  const menuOpen = document.getElementById('mobile-drawer')?.classList.contains('open');
  const dialogOpen = [...document.querySelectorAll('dialog')].some((dialog) => dialog.open);
  document.body.classList.toggle('no-scroll', Boolean(menuOpen || dialogOpen));
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog?.open) return;
  dialog.close();
  syncBodyScrollLock();
}

function openRfq(productName = '') {
  closeNavigationMenu();
  const dialog = document.getElementById('rfq-dialog');
  if (!dialog) return;
  const productInput = dialog.querySelector('[name="productName"]');
  if (productInput && productName) productInput.value = productName;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  syncBodyScrollLock();
  requestAnimationFrame(() => dialog.querySelector('[name="name"]')?.focus());
}

function productForSlug(slug) {
  return state.products.find((item) => item.slug === slug);
}

function updateLightbox() {
  const dialog = document.getElementById('lightbox-dialog');
  const image = dialog?.querySelector('[data-lightbox-image]');
  if (!dialog || !image || !state.lightboxImages.length) return;
  state.lightboxIndex = (state.lightboxIndex + state.lightboxImages.length) % state.lightboxImages.length;
  image.src = state.lightboxImages[state.lightboxIndex];
  image.alt = state.lightboxAlt || tx('Product image', '产品图片');
  dialog.querySelectorAll('.lightbox-nav').forEach((button) => { button.hidden = state.lightboxImages.length < 2; });
}

function openLightbox(images, index = 0, alt = '') {
  const validImages = (Array.isArray(images) ? images : [images]).filter(Boolean);
  if (!validImages.length) return;
  state.lightboxImages = validImages;
  state.lightboxIndex = Number(index) || 0;
  state.lightboxAlt = alt;
  const dialog = document.getElementById('lightbox-dialog');
  if (!dialog) return;
  updateLightbox();
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  syncBodyScrollLock();
}

function updateProductUrl() {
  if (routeInfo().path !== '/products') return;
  const url = new URL(location.href);
  if (state.filter && state.filter !== 'all') url.searchParams.set('category', state.filter);
  else url.searchParams.delete('category');
  if (state.search) url.searchParams.set('q', state.search);
  else url.searchParams.delete('q');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
}

function refreshProductResults() {
  const products = filteredProducts();
  document.querySelectorAll('[data-product-grid]').forEach((grid) => {
    const limit = Number(grid.dataset.limit || 0);
    grid.innerHTML = renderProductGrid(products, limit);
  });
  document.querySelectorAll('[data-product-count]').forEach((count) => { count.textContent = productCountLabel(products.length); });
  document.querySelectorAll('[data-action="filter-products"]').forEach((button) => button.classList.toggle('active', button.dataset.filter === state.filter));
}

const FILE_EXTENSIONS = new Set(['pdf', 'dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'zip', 'jpg', 'jpeg', 'png', 'webp']);
const FILE_MAX_SIZE = 12 * 1024 * 1024;
const FILE_TOTAL_SIZE = 30 * 1024 * 1024;

function fileExtension(name) {
  return String(name || '').split('.').pop().toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formFiles(form) {
  return state.attachments[form.id] || (state.attachments[form.id] = []);
}

function renderFileList(form) {
  const list = form.querySelector('[data-file-list]');
  if (!list) return;
  list.innerHTML = formFiles(form).map((file, index) => `
    <div class="file-item">
      <span class="file-preview">${escapeHtml(fileExtension(file.name).toUpperCase())}</span>
      <span class="file-copy"><strong>${escapeHtml(file.name)}</strong><small>${formatBytes(file.size)}</small></span>
      <button class="file-remove" type="button" data-action="remove-file" data-form="${escapeAttr(form.id)}" data-index="${index}" title="${tx('Remove file', '移除文件')}">${icon('trash', 17)}</button>
    </div>
  `).join('');
}

function addFiles(form, incoming) {
  const files = formFiles(form);
  const candidates = [...incoming];
  let rejected = '';
  for (const file of candidates) {
    const extension = fileExtension(file.name);
    if (!FILE_EXTENSIONS.has(extension)) {
      rejected = tx(`Unsupported file type: ${extension || 'unknown'}`, `不支持的文件类型：${extension || '未知'}`);
      continue;
    }
    if (file.size > FILE_MAX_SIZE) {
      rejected = tx(`${file.name} exceeds 12 MB.`, `${file.name} 超过12 MB。`);
      continue;
    }
    if (files.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) continue;
    if (files.length >= 12) {
      rejected = tx('A maximum of 12 files can be selected.', '最多可选择12个文件。');
      break;
    }
    const total = files.reduce((sum, item) => sum + item.size, 0);
    if (total + file.size > FILE_TOTAL_SIZE) {
      rejected = tx('Total attachment size cannot exceed 30 MB.', '附件总大小不能超过30 MB。');
      break;
    }
    files.push(file);
  }
  renderFileList(form);
  if (rejected) showToast(rejected, 'error');
}

function buildRfqMessage(form) {
  const values = new FormData(form);
  const files = formFiles(form);
  const fields = [
    [tx('Name', '姓名'), values.get('name')],
    [tx('Company', '公司'), values.get('company')],
    [tx('Business email', '工作邮箱'), values.get('email')],
    [tx('Phone / WhatsApp', '电话 / WhatsApp'), values.get('phone')],
    [tx('Country or region', '国家或地区'), values.get('country')],
    [tx('Product category', '产品类别'), values.get('productCategory')],
    [tx('Part or project name', '零件或项目名称'), values.get('productName')],
    [tx('Expected quantity', '预计数量'), values.get('quantity')],
    [tx('NDA required', '需要保密协议'), values.get('nda') === 'yes' ? tx('Yes', '是') : tx('No', '否')],
  ].filter(([, value]) => String(value || '').trim());
  const lines = [
    tx('ZHANYI PRECISION - Project Review Request', '展益精密 - 项目评审申请'),
    '',
    ...fields.map(([label, value]) => `${label}: ${String(value).trim()}`),
    '',
    `${tx('What the team should understand', '希望团队重点了解的内容')}:`,
    String(values.get('message') || '').trim(),
  ];
  if (files.length) {
    lines.push('', `${tx('Selected drawing files', '已选择的图纸文件')}:`, ...files.map((file) => `- ${file.name} (${formatBytes(file.size)})`));
    lines.push(tx('I will attach these files in WhatsApp.', '我将在 WhatsApp 中发送这些文件。'));
  }
  lines.push('', `${tx('Source page', '来源页面')}: ${location.href}`);
  return lines.join('\n');
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error(tx('Could not copy the inquiry.', '无法复制询价内容。'));
}

async function copyRfqMessage(form) {
  if (!form) return;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  try {
    await copyText(buildRfqMessage(form));
    const message = tx('Project details copied. Paste them into WhatsApp, email or your preferred messaging channel.', '项目资料已复制，可粘贴到 WhatsApp、邮件或您常用的沟通工具。');
    const status = form.querySelector('[data-form-status]');
    status.className = 'form-status success';
    status.textContent = message;
    showToast(message, 'success');
  } catch (error) {
    showToast(error.message || tx('Could not copy the inquiry.', '无法复制询价内容。'), 'error');
  }
}

function setRfqStatus(form, message = '', type = '') {
  const status = form.querySelector('[data-form-status]');
  if (!status) return;
  status.className = `form-status${type ? ` ${type}` : ''}`;
  status.textContent = message;
}

function setRfqSubmitting(form, submitting) {
  const submit = form.querySelector('[data-fs-submit-btn]');
  form.toggleAttribute('aria-busy', submitting);
  if (!submit) return;
  submit.disabled = submitting;
  submit.innerHTML = submitting
    ? `${icon('send', 18)}${tx('Sending for Review...', '正在提交评审...')}`
    : `${icon('send', 18)}${tx('Send for Review', '提交评审')}`;
}

function formspreeErrorMessage(error) {
  const formErrors = typeof error?.getFormErrors === 'function' ? error.getFormErrors() : [];
  if (formErrors.length) return formErrors.map((item) => item.message).filter(Boolean).join(' ');
  const fieldErrors = typeof error?.getAllFieldErrors === 'function' ? error.getAllFieldErrors() : [];
  if (fieldErrors.length) return tx('Please review the highlighted fields and submit again.', '请检查标出的字段后重新提交。');
  return tx('The inquiry could not be sent. Please try again or contact us through WhatsApp.', '询盘未能发送，请重试或通过 WhatsApp 联系我们。');
}

function initializeRfqForms() {
  const formspreeFormId = String(state.settings.formspreeFormId || FORMSPREE_FORM_ID).trim();
  if (!formspreeFormId || typeof window.formspree !== 'function') return;
  document.querySelectorAll('[data-rfq-form]').forEach((form) => {
    window.formspree('initForm', {
      formElement: form,
      formId: formspreeFormId,
      useDefaultStyles: false,
      data: {
        inquiryChannel: 'Zhanyi website',
        sourcePage: () => location.href,
        pageLanguage: () => state.lang === 'zh' ? 'Chinese' : 'English',
        drawingFiles: () => {
          const files = formFiles(form);
          return files.length ? files.map((file) => `${file.name} (${formatBytes(file.size)})`).join('\n') : undefined;
        },
      },
      onInit: () => { form.dataset.formspreeReady = 'true'; },
      onSubmit: () => { setRfqStatus(form); },
      onSuccess: () => {
        const message = localize(
          sectionData('contact').successMessage,
          tx('Thank you. Your inquiry is with us. We will review the information and contact you with any questions or the recommended next step.', '感谢提交，您的询盘已经送达。我们会认真查看资料，并带着需要确认的问题或建议的下一步与您联系。')
        );
        form.reset();
        state.attachments[form.id] = [];
        renderFileList(form);
        setRfqStatus(form, message, 'success');
        showToast(message, 'success');
      },
      onError: (_context, error) => {
        const message = formspreeErrorMessage(error);
        setRfqStatus(form, message, 'error');
        showToast(message, 'error');
      },
      onFailure: () => {
        const message = tx('A network error prevented submission. Please try again or contact us through WhatsApp.', '网络错误导致提交失败，请重试或通过 WhatsApp 联系我们。');
        setRfqStatus(form, message, 'error');
        showToast(message, 'error');
      },
      disable: () => { setRfqSubmitting(form, true); },
      enable: () => { setRfqSubmitting(form, false); },
      renderSuccess: () => {},
      renderFormError: () => {},
    });
  });
}

let baiduMapPromise = null;
let activeMap = null;
let mapLoadToken = 0;

function mapIsCurrent(canvas, token) {
  return token === mapLoadToken && document.body.contains(canvas);
}

function destroyActiveMap() {
  mapLoadToken += 1;
  if (!activeMap) return;
  clearTimeout(activeMap.timeout);
  try {
    if (activeMap.type === 'leaflet') activeMap.instance.remove();
    else if (activeMap.type === 'baidu') activeMap.instance.clearOverlays();
    else if (activeMap.type === 'baidu-embed') activeMap.instance.remove();
  } catch (_) {
    // The previous route may already have removed the map container.
  }
  activeMap = null;
}

function setMapState(canvas, mode, message = '') {
  canvas.classList.toggle('map-is-loading', mode === 'loading');
  canvas.classList.toggle('map-ready', mode === 'ready');
  canvas.classList.toggle('map-error', mode === 'error');
  const status = canvas.querySelector('[data-map-state]');
  const retry = canvas.querySelector('[data-action="retry-map"]');
  if (status && message) status.textContent = message;
  if (retry) retry.hidden = mode !== 'error';
}

function mapPrecisionText(status) {
  if (status === 'exact') return tx('Verified factory location', '已核实厂址');
  if (status === 'region_level') return tx('The marker shows the registered address area; confirm the entrance before visiting.', '标记显示登记地址区域，到访前请确认具体入口。');
  return tx('Dongguan city-level location; the full address is shared during project contact.', '当前显示东莞市级位置，具体地址将在项目联系时提供。');
}

function addLeafletResetControl(Leaflet, map, lat, lng, zoom) {
  const reset = Leaflet.control({ position: 'topright' });
  reset.onAdd = () => {
    const wrapper = Leaflet.DomUtil.create('div', 'leaflet-bar map-reset-control');
    const button = Leaflet.DomUtil.create('button', '', wrapper);
    button.type = 'button';
    button.title = tx('Reset map view', '复位地图视图');
    button.setAttribute('aria-label', button.title);
    button.innerHTML = icon('map-pin', 17);
    Leaflet.DomEvent.disableClickPropagation(wrapper);
    Leaflet.DomEvent.disableScrollPropagation(wrapper);
    button.addEventListener('click', () => map.setView([lat, lng], zoom, { animate: true }));
    return wrapper;
  };
  reset.addTo(map);
}

function initializeLeafletMap(canvas, token) {
  const Leaflet = window.L;
  const surface = canvas.querySelector('[data-map-surface]');
  if (!Leaflet || typeof Leaflet.map !== 'function' || !surface) {
    setMapState(canvas, 'error', tx('The interactive map could not start.', '交互地图无法启动。'));
    return;
  }

  const lat = Number(canvas.dataset.lat) || DEFAULT_MAP.lat;
  const lng = Number(canvas.dataset.lng) || DEFAULT_MAP.lng;
  const zoom = Math.min(18, Math.max(3, Number(canvas.dataset.zoom) || 12));
  const address = canvas.dataset.address || tx('Dongguan, Guangdong, China', '中国广东省东莞市');
  const status = canvas.dataset.mapStatus || 'city_level';
  const map = Leaflet.map(surface, {
    center: [lat, lng],
    zoom,
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true,
    touchZoom: true,
    attributionControl: true,
  });
  map.attributionControl.setPrefix(false);
  activeMap = { type: 'leaflet', instance: map, canvas, timeout: null, tileLayer: null };

  const markerIcon = Leaflet.divIcon({
    className: 'zhanyi-map-marker-shell',
    html: '<span class="zhanyi-map-marker"><span></span></span>',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -42],
    tooltipAnchor: [0, -40],
  });
  const marker = Leaflet.marker([lat, lng], { icon: markerIcon, keyboard: true, title: companyName() }).addTo(map);
  const popup = document.createElement('div');
  popup.className = 'zhanyi-map-popup';
  const popupTitle = document.createElement('strong');
  popupTitle.textContent = companyName();
  const popupAddress = document.createElement('span');
  popupAddress.textContent = address;
  const popupStatus = document.createElement('small');
  popupStatus.textContent = mapPrecisionText(status);
  popup.append(popupTitle, popupAddress, popupStatus);
  marker.bindPopup(popup, { maxWidth: 320, minWidth: 210 });
  marker.bindTooltip(companyName(), { permanent: true, direction: 'top', opacity: 1, className: 'zhanyi-map-tooltip' });
  addLeafletResetControl(Leaflet, map, lat, lng, zoom);

  const tileProviders = [
    {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, HERE, Garmin, FAO, NOAA, USGS',
      },
    },
    {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      },
    },
  ];

  const loadTiles = (providerIndex) => {
    if (!mapIsCurrent(canvas, token) || activeMap?.instance !== map) return;
    const provider = tileProviders[providerIndex];
    if (!provider) {
      setMapState(canvas, 'error', tx('The map tiles are temporarily unavailable.', '地图底图暂时无法加载。'));
      return;
    }
    if (activeMap.tileLayer) map.removeLayer(activeMap.tileLayer);
    let settled = false;
    let errors = 0;
    const layer = Leaflet.tileLayer(provider.url, provider.options);
    activeMap.tileLayer = layer;
    const advance = () => {
      if (settled || !mapIsCurrent(canvas, token)) return;
      settled = true;
      clearTimeout(activeMap?.timeout);
      if (map.hasLayer(layer)) map.removeLayer(layer);
      loadTiles(providerIndex + 1);
    };
    layer.once('tileload', () => {
      if (settled || !mapIsCurrent(canvas, token)) return;
      settled = true;
      clearTimeout(activeMap?.timeout);
      setMapState(canvas, 'ready');
      requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    });
    layer.on('tileerror', () => {
      errors += 1;
      if (errors >= 4) advance();
    });
    layer.addTo(map);
    activeMap.timeout = setTimeout(advance, 10000);
  };

  loadTiles(0);
  requestAnimationFrame(() => map.invalidateSize({ animate: false }));
}

function initializeBaiduEmbedMap(canvas, token) {
  const surface = canvas.querySelector('[data-map-surface]');
  if (!surface) {
    setMapState(canvas, 'error', tx('The interactive map could not start.', '交互地图无法启动。'));
    return;
  }
  const lat = Number(canvas.dataset.lat) || DEFAULT_MAP.lat;
  const lng = Number(canvas.dataset.lng) || DEFAULT_MAP.lng;
  const zoom = Math.min(18, Math.max(3, Number(canvas.dataset.zoom) || 12));
  const address = canvas.dataset.address || tx('Dongguan, Guangdong, China', '中国广东省东莞市');
  const mapUrl = new URL('https://api.map.baidu.com/marker');
  mapUrl.searchParams.set('location', `${lat},${lng}`);
  mapUrl.searchParams.set('title', companyName());
  mapUrl.searchParams.set('content', address);
  mapUrl.searchParams.set('output', 'html');
  mapUrl.searchParams.set('zoom', String(zoom));
  mapUrl.searchParams.set('src', 'zhanyi-static-site');

  const frame = document.createElement('iframe');
  frame.className = 'baidu-map-frame';
  frame.title = tx('Interactive Baidu location map', '百度交互式位置地图');
  frame.src = mapUrl.toString();
  frame.loading = 'eager';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'fullscreen';
  let settled = false;
  const fallback = () => {
    if (settled || !mapIsCurrent(canvas, token)) return;
    settled = true;
    clearTimeout(activeMap?.timeout);
    frame.remove();
    initializeLeafletMap(canvas, token);
  };
  frame.addEventListener('load', () => {
    if (settled || !mapIsCurrent(canvas, token)) return;
    settled = true;
    clearTimeout(activeMap?.timeout);
    setMapState(canvas, 'ready');
  });
  frame.addEventListener('error', fallback);
  surface.replaceChildren(frame);
  activeMap = {
    type: 'baidu-embed',
    instance: frame,
    canvas,
    timeout: setTimeout(fallback, 15000),
  };
}

function loadBaiduMap(ak) {
  if (window.BMap) return Promise.resolve(window.BMap);
  if (baiduMapPromise) return baiduMapPromise;
  baiduMapPromise = new Promise((resolve, reject) => {
    const callbackName = `__zhanyiMapReady${Date.now()}`;
    const script = document.createElement('script');
    let settled = false;
    const finish = (handler, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      delete window[callbackName];
      handler(value);
    };
    const timer = setTimeout(() => finish(reject, new Error('Map loading timed out.')), 12000);
    window[callbackName] = () => finish(resolve, window.BMap);
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${encodeURIComponent(ak)}&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => finish(reject, new Error('Map script failed to load.'));
    document.head.appendChild(script);
  });
  return baiduMapPromise;
}

function initializeBaiduMap(canvas, token, ak) {
  const surface = canvas.querySelector('[data-map-surface]');
  const lat = Number(canvas.dataset.lat) || DEFAULT_MAP.lat;
  const lng = Number(canvas.dataset.lng) || DEFAULT_MAP.lng;
  const zoom = Math.min(18, Math.max(3, Number(canvas.dataset.zoom) || 12));
  loadBaiduMap(ak).then((BMap) => {
    if (!BMap || !surface || !mapIsCurrent(canvas, token)) return;
    const map = new BMap.Map(surface, { enableMapClick: false });
    const point = new BMap.Point(lng, lat);
    map.centerAndZoom(point, zoom);
    map.enableDragging();
    map.enableScrollWheelZoom(true);
    map.enableDoubleClickZoom();
    map.enableContinuousZoom();
    if (typeof map.enablePinchToZoom === 'function') map.enablePinchToZoom();
    map.addControl(new BMap.NavigationControl({ anchor: window.BMAP_ANCHOR_TOP_LEFT }));
    if (BMap.ScaleControl) map.addControl(new BMap.ScaleControl({ anchor: window.BMAP_ANCHOR_BOTTOM_LEFT }));
    const marker = new BMap.Marker(point);
    map.addOverlay(marker);
    const label = new BMap.Label(companyName(), { offset: new BMap.Size(22, -12) });
    label.setStyle({ border: '0', padding: '7px 10px', boxShadow: '0 4px 14px rgba(17,20,23,.18)', fontSize: '12px' });
    marker.setLabel(label);
    const info = new BMap.InfoWindow(`<div class="baidu-map-popup"><strong>${escapeHtml(companyName())}</strong><span>${escapeHtml(canvas.dataset.address || '')}</span><small>${escapeHtml(mapPrecisionText(canvas.dataset.mapStatus || 'city_level'))}</small></div>`, { width: 280 });
    marker.addEventListener('click', () => map.openInfoWindow(info, point));
    activeMap = { type: 'baidu', instance: map, canvas, timeout: null };
    setMapState(canvas, 'ready');
  }).catch(() => {
    baiduMapPromise = null;
    if (mapIsCurrent(canvas, token)) initializeLeafletMap(canvas, token);
  });
}

function initializeMap() {
  const canvas = document.querySelector('[data-map]');
  if (!canvas) return;
  const token = ++mapLoadToken;
  setMapState(canvas, 'loading', tx('Loading interactive map...', '正在加载交互地图...'));
  const provider = String(canvas.dataset.provider || 'leaflet').toLowerCase();
  const ak = String(state.settings.baiduMapAk || '').trim();
  if (provider === 'baidu-embed') initializeBaiduEmbedMap(canvas, token);
  else if (provider === 'baidu' && ak) initializeBaiduMap(canvas, token, ak);
  else initializeLeafletMap(canvas, token);
}

function showToast(message, type = 'success') {
  const region = document.querySelector('[data-toast-region]');
  if (!region || !message) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `${icon(type === 'error' ? 'x' : 'check', 20)}<p>${escapeHtml(message)}</p><button type="button" data-action="close-toast" title="${tx('Close', '关闭')}">${icon('x', 16)}</button>`;
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 5200);
}

function handleAction(element) {
  const action = element.dataset.action;
  if (action === 'toggle-menu') toggleNavigationMenu();
  else if (action === 'toggle-subnav') {
    const item = element.closest('li');
    setMobileSubnavState(item, !item?.classList.contains('sub-open'));
  }
  else if (action === 'toggle-language') {
    const nextLanguage = state.lang === 'zh' ? 'en' : 'zh';
    const route = routeInfo();
    navigateTo(routeUrl(route.path, nextLanguage) + location.search + location.hash);
  } else if (action === 'hero-prev') activateHero(state.heroIndex - 1);
  else if (action === 'hero-next') activateHero(state.heroIndex + 1);
  else if (action === 'hero-dot') activateHero(Number(element.dataset.index || 0));
  else if (action === 'filter-products') {
    state.filter = element.dataset.filter || 'all';
    updateProductUrl();
    refreshProductResults();
  } else if (action === 'lightbox-product') {
    const product = productForSlug(element.dataset.product);
    if (product) openLightbox(product.images.length ? product.images : [product.image], 0, localize(product.title));
  } else if (action === 'zoom-product') {
    const product = productForSlug(element.dataset.product);
    const mainImage = document.querySelector('[data-gallery-main]')?.src;
    if (product) {
      const images = product.images.length ? product.images : [product.image];
      const activeIndex = Math.max(0, images.findIndex((image) => mainImage && mainImage.endsWith(image)));
      openLightbox(images, activeIndex, localize(product.title));
    }
  } else if (action === 'gallery-thumb') {
    const main = document.querySelector('[data-gallery-main]');
    if (main) main.src = element.dataset.image;
    element.parentElement?.querySelectorAll('.gallery-thumb').forEach((thumb) => thumb.classList.toggle('active', thumb === element));
  } else if (action === 'open-rfq') openRfq(element.dataset.product || '');
  else if (action === 'copy-rfq') copyRfqMessage(document.getElementById(element.dataset.form));
  else if (action === 'close-rfq') closeDialog('rfq-dialog');
  else if (action === 'close-lightbox') closeDialog('lightbox-dialog');
  else if (action === 'lightbox-prev') { state.lightboxIndex -= 1; updateLightbox(); }
  else if (action === 'lightbox-next') { state.lightboxIndex += 1; updateLightbox(); }
  else if (action === 'remove-file') {
    const form = document.getElementById(element.dataset.form);
    if (form) {
      formFiles(form).splice(Number(element.dataset.index), 1);
      renderFileList(form);
    }
  } else if (action === 'retry-map') {
    destroyActiveMap();
    initializeMap();
  } else if (action === 'back-to-top') window.scrollTo({ top: 0, behavior: 'smooth' });
  else if (action === 'close-toast') element.closest('.toast')?.remove();
}

let eventsBound = false;

function bindGlobalEvents() {
  if (eventsBound) return;
  eventsBound = true;
  document.addEventListener('click', (event) => {
    const actionElement = event.target.closest('[data-action]');
    if (actionElement) {
      event.preventDefault();
      handleAction(actionElement);
      return;
    }
    const routeLink = event.target.closest('a[data-route]');
    if (!routeLink || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || routeLink.target || routeLink.hasAttribute('download')) return;
    const url = new URL(routeLink.href, location.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    navigateTo(url);
  });
  document.addEventListener('input', (event) => {
    if (!event.target.matches('[data-product-search]')) return;
    state.search = event.target.value.trim();
    updateProductUrl();
    refreshProductResults();
  });
  document.addEventListener('change', (event) => {
    if (!event.target.matches('[data-file-input]')) return;
    const form = event.target.closest('[data-rfq-form]');
    if (form) addFiles(form, event.target.files || []);
    event.target.value = '';
  });
  document.addEventListener('submit', (event) => {
    if (!event.target.matches('[data-rfq-form]')) return;
    if (event.target.dataset.formspreeReady === 'true') return;
    setRfqSubmitting(event.target, true);
  });
  document.addEventListener('dragover', (event) => {
    const drop = event.target.closest('[data-file-drop]');
    if (!drop) return;
    event.preventDefault();
    drop.classList.add('dragover');
  });
  document.addEventListener('dragleave', (event) => event.target.closest('[data-file-drop]')?.classList.remove('dragover'));
  document.addEventListener('drop', (event) => {
    const drop = event.target.closest('[data-file-drop]');
    if (!drop) return;
    event.preventDefault();
    drop.classList.remove('dragover');
    const form = drop.closest('[data-rfq-form]');
    if (form) addFiles(form, event.dataTransfer?.files || []);
  });
  document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox-dialog');
    if (event.key === 'Escape') closeNavigationMenu();
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') { state.lightboxIndex -= 1; updateLightbox(); }
    if (event.key === 'ArrowRight') { state.lightboxIndex += 1; updateLightbox(); }
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof HTMLDialogElement) closeDialog(event.target.id);
  });
  document.addEventListener('close', syncBodyScrollLock, true);
  document.addEventListener('cancel', () => requestAnimationFrame(syncBodyScrollLock), true);
  window.addEventListener('popstate', () => renderApp());
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeNavigationMenu();
    if (activeMap?.type === 'leaflet') activeMap.instance.invalidateSize({ animate: false });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopHeroTimer();
    else startHeroTimer();
  });
}

loadApplicationData();
