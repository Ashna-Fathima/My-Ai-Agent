import type { AgentStep, TaskRecord, OutputRow } from "./types";

export const initialSteps: AgentStep[] = [
  { id: 1, label: "Thinking...", status: "pending" },
  { id: 2, label: "Searching...", status: "pending" },
  { id: 3, label: "Writing...", status: "pending" },
  { id: 4, label: "Done", status: "pending" },
];

export const recentTasks: TaskRecord[] = [
  {
    id: "t1",
    prompt: "Research top 5 AI startups in 2025 and create comparison table",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "t2",
    prompt: "Find the cheapest flights from NYC to Tokyo in December",
    timestamp: "5 hours ago",
    status: "completed",
  },
  {
    id: "t3",
    prompt: "Summarize the latest AI research papers on RAG systems",
    timestamp: "Yesterday",
    status: "completed",
  },
  {
    id: "t4",
    prompt: "Compare AWS vs GCP pricing for small startups",
    timestamp: "2 days ago",
    status: "completed",
  },
  {
    id: "t5",
    prompt: "Generate a weekly meal plan with grocery list",
    timestamp: "3 days ago",
    status: "completed",
  },
];

export const sampleOutput: OutputRow[] = [
  {
    company: "Perplexity AI",
    funding: "$500M / Series B",
    product: "AI-powered answer engine",
    website: "perplexity.ai",
  },
  {
    company: "Mistral AI",
    funding: "$645M / Series B",
    product: "Open-weight LLMs",
    website: "mistral.ai",
  },
  {
    company: "Anthropic",
    funding: "$4B / Series E",
    product: "Claude AI assistant",
    website: "anthropic.com",
  },
  {
    company: "Cohere",
    funding: "$270M / Series D",
    product: "Enterprise NLP platform",
    website: "cohere.com",
  },
  {
    company: "Adept AI",
    funding: "$350M / Series B",
    product: "AI agent for computer tasks",
    website: "adept.ai",
  },
];
