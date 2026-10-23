export interface TechItem {
  name: string;
  category: 'ML & Edge AI' | 'Agent & Protocols' | 'Agricultural Data' | 'Backend & Web' | 'Security & Auth';
  description: string;
  badge: string;
  highlight?: boolean;
}

export const TECH_CATEGORIES = [
  'ML & Edge AI',
  'Agent & Protocols',
  'Agricultural Data',
  'Backend & Web',
  'Security & Auth',
] as const;

export const TECH_STACK: TechItem[] = [
  // ML & Edge AI
  {
    name: 'Google AI Studio (Gemini 3.8 Flash)',
    category: 'ML & Edge AI',
    description: 'Multimodal vision intelligence for autonomous produce pathology grading, defect localization, and shelf-life forecasting.',
    badge: 'Gemini Multimodal Vision',
    highlight: true,
  },
  {
    name: 'YOLOv8-Nano (ONNX)',
    category: 'ML & Edge AI',
    description: 'Quantized INT8 edge computer-vision classifier for epidermal decay detection & surface browning %.',
    badge: 'INT8 Quantized',
    highlight: true,
  },
  {
    name: 'OpenCV & NumPy',
    category: 'ML & Edge AI',
    description: 'Per-pixel damage segmentation, chromatic decay gradient indexing, and camera aspect normalization.',
    badge: 'Vision Pipeline',
  },
  {
    name: 'PyTorch Export Engine',
    category: 'ML & Edge AI',
    description: 'Trained on Kaggle Fruit/Vegetable Freshness & Ripeness datasets; optimized for sub-15ms edge inference.',
    badge: 'Model Architecture',
  },

  // Agent & Protocols
  {
    name: 'FastMCP (Python)',
    category: 'Agent & Protocols',
    description: 'Model Context Protocol standard server exposing real-time Mandi price querying and routing tools to agents.',
    badge: 'Core Protocol',
    highlight: true,
  },
  {
    name: 'Pluggable LLM Orchestrator',
    category: 'Agent & Protocols',
    description: 'Dynamic reasoning engine compatible with Claude 3.5 Sonnet, Groq Llama-3.1-70B, or local vLLM instances.',
    badge: 'Pluggable AI',
    highlight: true,
  },
  {
    name: 'Autonomous Arbitration Agent',
    category: 'Agent & Protocols',
    description: 'Calculates non-linear distance vs. decay trade-offs and issues dispatch orders automatically.',
    badge: 'Decision Engine',
  },

  // Agricultural Data
  {
    name: 'Agmarknet Public APIs',
    category: 'Agricultural Data',
    description: 'Direct ingestion of live commodity arrivals, variety classifications, and modal prices across 2,400+ APMCs.',
    badge: 'Price Telemetry',
  },
  {
    name: 'e-NAM Gateway (National Agriculture Market)',
    category: 'Agricultural Data',
    description: 'Inter-state wholesale trade settlement indices and electronic auction price spreads.',
    badge: 'Unified Market',
  },
  {
    name: 'Kaggle Freshness & Ripeness Dataset',
    category: 'Agricultural Data',
    description: 'Over 14,000 labelled field samples spanning multiple decay stages across 6 staple commodities.',
    badge: 'Training Data',
  },

  // Backend & Web
  {
    name: 'FastAPI Microservice',
    category: 'Backend & Web',
    description: 'High-throughput async gateway linking image payloads with the FastMCP orchestration layer.',
    badge: 'Async Core',
  },
  {
    name: 'Next.js (App Router) + TypeScript',
    category: 'Backend & Web',
    description: 'High-performance interactive dashboard featuring real-time telemetry rendering and responsive controls.',
    badge: 'Frontend',
  },
  {
    name: 'Tailwind CSS & Framer Motion',
    category: 'Backend & Web',
    description: 'Tactile design system with smooth micro-interactions, dark mode, and responsive layout primitives.',
    badge: 'Design System',
  },

  // Security & Auth
  {
    name: 'Cequence AI Gateway Proxy',
    category: 'Security & Auth',
    description: 'API mediation layer securing agent-to-buyer transaction dispatches, preventing tool-call tampering.',
    badge: 'AI Gateway',
    highlight: true,
  },
  {
    name: 'Descope OAuth & IAM',
    category: 'Security & Auth',
    description: 'Frictionless biometric and passkey authentication for commission agents and fleet dispatch drivers.',
    badge: 'Auth & KYC',
  },
];
