'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Server,
  Eye,
  Cpu,
  Database,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  description: string;
  protocol: string;
  inputs: string[];
  outputs: string[];
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'client',
    name: 'Mobile / Web Client',
    subtitle: 'Field Evaluator & Driver PWA',
    icon: Smartphone,
    color: 'from-blue-600 to-indigo-600',
    badge: 'Edge Capture',
    description:
      'Field evaluator, farmer, or freight driver photographs the produce batch at farm gate or loading terminal. Captures RGB image, GPS coordinates, commodity type, and batch weight in kilograms.',
    protocol: 'HTTPS / WebRTC / PWA',
    inputs: ['Camera Shutter', 'Batch Weight (kg)', 'GPS Origin Hub'],
    outputs: ['Multipart Form Payload', 'Crop Metadata'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI Gateway',
    subtitle: 'High-Throughput Ingestion',
    icon: Server,
    color: 'from-emerald-600 to-teal-700',
    badge: 'API Gateway',
    description:
      'Async high-performance HTTP gateway running Pydantic validation, payload sanitization, and routing to the onnx-runtime inference engine and FastMCP orchestrator server.',
    protocol: 'REST / OpenAPI 3.1',
    inputs: ['Multipart Form Payload', 'JWT Session Token'],
    outputs: ['Normalized Tensor (640x640)', 'Async Task Context'],
  },
  {
    id: 'yolo',
    name: 'YOLOv8-Nano (ONNX)',
    subtitle: 'Quantized Edge Vision Model',
    icon: Eye,
    color: 'from-amber-500 to-orange-600',
    badge: 'Edge AI (INT8)',
    description:
      'ONNX-quantized YOLOv8 computer vision model running sub-15ms inference. Segments epidermal browning, fungal lesion patches, and computes a structured decay index (0–100) and shelf-life window (hours).',
    protocol: 'ONNX Runtime / C++ Backend',
    inputs: ['Normalized Tensor (1x3x640x640)'],
    outputs: ['Decay Index (0-100)', 'Shelf-Life Window (hours)', 'Bounding Boxes'],
  },
  {
    id: 'mcp_orchestrator',
    name: 'Orchestrator Agent (FastMCP)',
    subtitle: 'Model Context Protocol Server',
    icon: Cpu,
    color: 'from-emerald-700 to-green-900',
    badge: 'FastMCP Standard',
    description:
      'The core autonomous agent residing on a Model Context Protocol server. Dynamically queries registered price tools, executes non-linear distance vs. decay trade-offs, and arbitrates the highest net return Mandi.',
    protocol: 'MCP Standard (JSON-RPC over stdio / SSE)',
    inputs: ['Decay Index Payload', 'Live Market Feeds', 'Freight Cost Matrix'],
    outputs: ['Arbitration Ranking', 'Optimal Destination Mandi', 'Dispatch Payload'],
  },
  {
    id: 'mandi_tools',
    name: 'Agmarknet & e-NAM Tools',
    subtitle: 'Live Market Pricing Feeds',
    icon: Database,
    color: 'from-cyan-600 to-blue-700',
    badge: 'MCP Tools',
    description:
      'Registered FastMCP tools that query live commodity arrivals, variety classifications, and modal prices across 2,400+ Indian APMCs (Azadpur, Vashi, Koyambedu, Yeshwanthpur, etc.).',
    protocol: 'Government Public API / Webhooks',
    inputs: ['Commodity Identifier', 'State Array', 'Query Date'],
    outputs: ['Modal Price / Quintal', 'Daily Arrival Tonnage', 'Market Trends'],
  },
  {
    id: 'cequence_gateway',
    name: 'Cequence AI Gateway Proxy',
    subtitle: 'API Security & Auditing Layer',
    icon: ShieldCheck,
    color: 'from-purple-600 to-violet-800',
    badge: 'Security Proxy',
    description:
      'Mediation layer ensuring AI agent tool calls cannot be hijacked or poisoned. Inspects transaction logs, enforces mTLS, validates dispatch payloads, and logs cryptographic audit trails for trade dispatches.',
    protocol: 'mTLS / Zero-Trust API Proxy',
    inputs: ['Agent Dispatch Order Payload', 'Buyer Target APMC ID'],
    outputs: ['Verified Order Signature', 'Audit Trace Log'],
  },
  {
    id: 'buyer_dispatch',
    name: 'Buyer Notification & Dispatch',
    subtitle: 'Downstream Wholesale Settlement',
    icon: MessageSquare,
    color: 'from-green-600 to-emerald-700',
    badge: 'Planned Feature',
    description:
      'Automated dispatch alert sent to target Mandi commission agents and wholesale buyers via WhatsApp Business API / Twilio SMS, coupled with Descope OAuth for driver handover verification.',
    protocol: 'WhatsApp API / Twilio SMS',
    inputs: ['Verified Dispatch Order', 'Buyer Phone Number'],
    outputs: ['Consignment Bill of Lading', 'Estimated Arrival Time'],
  },
];

export function ArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[3]); // Default to FastMCP Orchestrator

  return (
    <section id="architecture" className="py-20 md:py-28 bg-[var(--background)] border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <Lock className="w-3.5 h-3.5" />
            <span>Interactive Protocol Map</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            Autonomous Multi-Agent Architecture
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Click any node below to inspect data payloads, communication protocols, and security mediation checkpoints.
          </p>
        </div>

        {/* Diagram Flow Container */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-md">
          {/* Node Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ARCH_NODES.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--muted-bg)]/40 hover:bg-[var(--card)] hover:border-neutral-400'
                  }`}
                  aria-label={`Inspect ${node.name}`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted)]">
                        {node.badge}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[var(--foreground)] leading-snug">
                      {node.name}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5">
                      {node.subtitle}
                    </div>
                  </div>

                  {/* Flow Arrow indicator */}
                  <div className="mt-4 pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--muted)]">
                    <span className="font-mono text-[10px]">Step {index + 1} of 7</span>
                    {isSelected && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        Active <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Animated Edge Flow Representation */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2 text-[10px] font-mono text-[var(--muted)]">
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-[var(--muted-bg)]">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                Capture Image
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-[var(--muted-bg)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                FastAPI Validation
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-[var(--muted-bg)]">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                YOLOv8 Decay Index
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                FastMCP Tool Arbitration
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-[var(--muted-bg)]">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Cequence AI Proxy
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-[var(--muted-bg)]">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Dispatch Order
              </span>
            </div>
          </div>

          {/* Node Inspector Drawer */}
          {selectedNode && (
            <div className="mt-6 p-6 rounded-2xl bg-[var(--muted-bg)]/80 border border-[var(--border)] transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedNode.color} text-white flex items-center justify-center shadow-xs`}>
                    <selectedNode.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--foreground)]">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs text-[var(--muted)]">{selectedNode.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)]">
                    Protocol: {selectedNode.protocol}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Function &amp; Responsibilities
                  </h4>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div>
                    <h5 className="text-[11px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                      Inputs
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedNode.inputs.map((inp, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)]"
                        >
                          {inp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
                      Outputs
                    </h5>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedNode.outputs.map((out, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)]"
                        >
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
