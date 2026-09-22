export type StepStatus = "pending" | "active" | "done";

export interface AgentStep {
  id: number;
  label: string;
  status: StepStatus;
}

export type AgentStatus = "Ready" | "Thinking..." | "Done";

export interface TaskRecord {
  id: string;
  prompt: string;
  timestamp: string;
  status: "completed" | "running";
}

export interface OutputRow {
  company: string;
  funding: string;
  product: string;
  website: string;
}
