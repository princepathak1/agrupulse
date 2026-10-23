export interface ComparisonRow {
  dimension: string;
  typicalCropApp: string;
  agruPulseMCP: string;
  significance: string;
}

export const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: 'Core Purpose',
    typicalCropApp: 'Passive advisory: tells farmer what disease or fungus is visible on a leaf.',
    agruPulseMCP: 'Active financial & logistics engine: converts harvest decay metrics into optimal Mandi dispatch routes.',
    significance: 'Transforms diagnosis into direct cash-flow protection.',
  },
  {
    dimension: 'Market Price Integration',
    typicalCropApp: 'Isolated or static tables requiring manual lookup and phone calls.',
    agruPulseMCP: 'Autonomous MCP tool integration with live Agmarknet / e-NAM feeds across 8+ terminal APMCs.',
    significance: 'Eliminates asymmetric middleman pricing.',
  },
  {
    dimension: 'Spoilage & Transit Modeling',
    typicalCropApp: 'Zero logistics awareness; assumes produce stays in the farm.',
    agruPulseMCP: 'Dynamic non-linear transit decay modeling: computes arrival spoilage vs highway transit hours.',
    significance: 'Prevents produce rotting in transit before sale.',
  },
  {
    dimension: 'Decision Autonomy',
    typicalCropApp: 'Manual recommendation: user must read advice and figure out what to do.',
    agruPulseMCP: 'Multi-agent arbitration: auto-ranks Mandis by net return and issues dispatch payloads via MCP.',
    significance: 'End-to-end execution without operator bottlenecks.',
  },
  {
    dimension: 'Mid-Transit Dynamic Rerouting',
    typicalCropApp: 'Not supported; one-time static interaction.',
    agruPulseMCP: 'Real-time telemetry recalculation: if spoilage accelerates mid-transit, shipment is rerouted on the fly.',
    significance: 'Salvages distressed cargo at nearest viable wholesale yard.',
  },
  {
    dimension: 'Security & Enterprise Trust',
    typicalCropApp: 'Unsecured client apps with basic API keys.',
    agruPulseMCP: 'Secured via Cequence AI Gateway proxy + Descope OAuth for agent dispatch auditing.',
    significance: 'Enterprise-grade protection against rogue agent tool execution.',
  },
];
