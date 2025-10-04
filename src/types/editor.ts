export interface GroupData {
  identifier: string
  colourSchema: {
    default: string
    active: string
  }
}

export interface NodeData {
  identifier: string
  width: string
  height: string
}

export interface ExportData {
  size: { x: number; y: number };
  shapes: Record<string, { nodes: unknown[]; colourSchema: { default: string; active: string } }>;
  ellipses: Record<string, { nodes: unknown[]; colourSchema: { default: string; active: string } }>;
}
