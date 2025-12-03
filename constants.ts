
import { Project, NavItem, ContactInfo } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', label_zh: '关于', href: '#about' },
  { id: 'works', label: 'Works', label_zh: '作品', href: '#works' },
  { id: 'playground', label: 'Playground', label_zh: '实验', href: '#playground' },
];

export const CONTACT_INFO: ContactInfo = {
  tagline: "Let's build something.",
  tagline_zh: "一起来构建些什么。",
  email: "hello@yuhang.design",
  resumeUrl: "#" // Default empty link
};

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'FinTech Dashboard',
    title_zh: '金融科技数据看板',
    category: 'Product Design',
    category_zh: '产品设计',
    description: 'A comprehensive financial analytics platform helping users track assets across multiple exchanges with real-time visualization.',
    description_zh: '全方位的金融分析平台，帮助用户通过实时可视化图表跨多个交易所追踪资产。',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    year: '2023',
    role: 'Lead Designer',
    role_zh: '主设计师',
    client: 'FinCorp Global',
    stack: ['Figma', 'React', 'D3.js'],
    fullDescription: 'The FinTech Dashboard was designed to solve the fragmentation of asset tracking. Users previously had to log into 5+ different accounts. We consolidated APIs into a single, unified view. The design challenge was presenting high-density data without overwhelming the user.',
    fullDescription_zh: '该金融科技看板旨在解决资产追踪碎片化的问题。用户以前必须登录 5 个以上的不同账户。我们将 API 整合到一个统一的视图中。设计挑战在于如何在不让用户感到不知所措的情况下展示高密度数据。',
    gallery: [
        'https://picsum.photos/800/600?random=10',
        'https://picsum.photos/800/600?random=11',
        'https://picsum.photos/800/600?random=12'
    ]
  },
  {
    id: '2',
    title: 'Lumina Smart Home',
    title_zh: 'Lumina 智能家居',
    category: 'Mobile App',
    category_zh: '移动应用',
    description: 'Control your entire home environment with a gesture-based interface designed for accessibility and speed.',
    description_zh: '通过专为无障碍和效率设计的手势交互界面，掌控整个家庭环境。',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    year: '2023',
    role: 'UI/UX Designer',
    role_zh: 'UI/UX 设计师',
    client: 'Lumina IoT',
    stack: ['iOS', 'SwiftUI', 'Protopie'],
    fullDescription: 'Lumina focuses on interaction patterns. Instead of traditional buttons, we utilized radial dials and swipe gestures to control lighting intensity and temperature. The dark mode-first approach ensures comfortable usage at night.',
    fullDescription_zh: 'Lumina 专注于交互模式。我们没有使用传统的按钮，而是利用径向拨盘和滑动特定手势来控制灯光强度和温度。夜间模式优先的方法确保了夜间使用的舒适性。',
    gallery: [
        'https://picsum.photos/800/600?random=20',
        'https://picsum.photos/800/600?random=21'
    ]
  },
  {
    id: '3',
    title: 'Mono E-commerce',
    title_zh: 'Mono 极简电商',
    category: 'Web Design',
    category_zh: '网页设计',
    description: 'A minimalist e-commerce experience for a high-end furniture brand, focusing on imagery and typography.',
    description_zh: '为高端家具品牌打造的极简电商体验，专注于图像展示与排版美学。',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    year: '2022',
    role: 'Art Director',
    role_zh: '艺术总监',
    client: 'Mono Furniture',
    stack: ['WebGL', 'Shopify', 'Blender'],
    fullDescription: 'For Mono, the product is the hero. We stripped away all non-essential UI elements. The navigation is hidden until requested, and the checkout process is reduced to a single page overlay.',
    fullDescription_zh: '对于 Mono 来说，产品即是主角。我们去除了所有非必要的 UI 元素。导航栏在需要之前是隐藏的，结账流程被简化为单页覆盖层。',
    gallery: [
        'https://picsum.photos/800/600?random=30',
        'https://picsum.photos/800/600?random=31',
        'https://picsum.photos/800/600?random=32'
    ]
  },
  {
    id: '4',
    title: 'HealthFlow',
    title_zh: 'HealthFlow 医疗流程',
    category: 'UX Research',
    category_zh: '用户体验研究',
    description: 'Redesigning the patient intake process for digital health clinics to reduce friction and improve data accuracy.',
    description_zh: '重新设计数字健康诊所的患者接收流程，以减少摩擦并提高数据准确性。',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    year: '2022',
    role: 'UX Researcher',
    role_zh: 'UX 研究员',
    client: 'MediTech',
    stack: ['UserTesting', 'Figma', 'Maze'],
    fullDescription: 'Based on interviews with 50+ patients, we identified that form fatigue was the primary drop-off cause. We implemented a conversational UI approach that increased completion rates by 40%.',
    fullDescription_zh: '基于对 50 多位患者的采访，我们发现表单疲劳是主要流失原因。我们实施了对话式 UI 方法，将完成率提高了 40%。',
    gallery: [
        'https://picsum.photos/800/600?random=40'
    ]
  }
];

export const EXPERIMENTAL_PROJECTS: Project[] = [
  {
    id: 'e1',
    title: '3D Typography',
    title_zh: '3D 字体实验',
    category: 'Visual Exploration',
    category_zh: '视觉探索',
    description: 'Experiments with Spline and Three.js',
    description_zh: '使用 Spline 和 Three.js 的实验',
    imageUrl: 'https://picsum.photos/600/600?random=5',
    year: '2024'
  },
  {
    id: 'e2',
    title: 'Glassmorphism Icons',
    title_zh: '毛玻璃图标集',
    category: 'Iconography',
    category_zh: '图标设计',
    description: 'A set of 50+ icons focusing on refraction',
    description_zh: '专注于光线折射效果的 50+ 图标集',
    imageUrl: 'https://picsum.photos/600/600?random=6',
    year: '2023'
  },
  {
    id: 'e3',
    title: 'Generative Patterns',
    title_zh: '生成式图案',
    category: 'Creative Coding',
    category_zh: '创意编程',
    description: 'Algorithmic patterns generated with p5.js',
    description_zh: '使用 p5.js 生成的算法图案',
    imageUrl: 'https://picsum.photos/600/600?random=7',
    year: '2023'
  }
];