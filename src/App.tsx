import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentStep, AgentStatus, TaskRecord, OutputRow } from "./types";
import { initialSteps, recentTasks, sampleOutput } from "./data";
import {
  SparklesIcon,
  GitHubIcon,
  PlayIcon,
  ClockIcon,
  CheckIcon,
  SearchIcon,
  PencilIcon,
  BrainIcon,
  FlagIcon,
  TableIcon,
  ExternalLinkIcon,
} from "./icons";

const STEP_ICONS = [BrainIcon, SearchIcon, PencilIcon, FlagIcon];
const STEP_DELAY = 2000;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState<AgentStep[]>(initialSteps);
  const [status, setStatus] = useState<AgentStatus>("Ready");
  const [output, setOutput] = useState<OutputRow[] | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>(recentTasks);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runAgent = useCallback(() => {
    if (!prompt.trim() || isRunning) return;

    clearTimers();
    setIsRunning(true);
    setStatus("Thinking...");
    setOutput(null);
    setShowOutput(false);
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" })));

    const newTask: TaskRecord = {
      id: `t${Date.now()}`,
      prompt: prompt.trim(),
      timestamp: "Just now",
      status: "running",
    };
    setTasks((prev) => [newTask, ...prev].slice(0, 8));

    initialSteps.forEach((_, i) => {
      const activate = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "active" } : idx < i ? { ...s, status: "done" } : s
          )
        );
      }, i * STEP_DELAY);
      timeoutsRef.current.push(activate);
    });

    const finish = setTimeout(() => {
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" })));
      setStatus("Done");
      setOutput(sampleOutput);
      setShowOutput(true);
      setIsRunning(false);
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? { ...t, status: "completed" } : t))
      );
    }, initialSteps.length * STEP_DELAY + 300);
    timeoutsRef.current.push(finish);
  }, [prompt, isRunning, clearTimers]);

  const handlePromptSelect = (taskPrompt: string) => {
    if (isRunning) return;
    setPrompt(taskPrompt);
  };

  const statusColor =
    status === "Ready" ? "text-neutral-500" : status === "Done" ? "text-green-400" : "text-accent-light";
  const statusDot =
    status === "Ready" ? "bg-neutral-500" : status === "Done" ? "bg-green-400" : "bg-accent";

  return (
    <div className="min-h-screen bg-base-900 flex flex-col">
      {/* ===== Header ===== */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-base-700 bg-base-850/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent-glow">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-[15px] text-white tracking-tight">My AI Agent</span>
            <span className="text-[11px] text-neutral-500 font-medium">Automates your computer work</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-base-750 hover:bg-base-700 border border-base-650 hover:border-base-600 text-neutral-300 hover:text-white text-[13px] font-medium transition-all duration-200 hover:shadow-md"
          >
            <GitHubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* ===== Left Sidebar ===== */}
        <aside className="w-full lg:w-[30%] lg:min-w-[340px] lg:max-w-[420px] border-b lg:border-b-0 lg:border-r border-base-700 bg-base-850 flex flex-col overflow-y-auto">
          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">
                Task
              </label>
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Research top 5 AI startups in 2025 and create comparison table"
                  rows={5}
                  disabled={isRunning}
                  className="w-full bg-base-800 border border-base-650 rounded-xl px-4 py-3 text-[14px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-200 disabled:opacity-50 leading-relaxed"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-neutral-600 font-mono pointer-events-none">
                  {prompt.length}/500
                </div>
              </div>
            </div>

            <button
              onClick={runAgent}
              disabled={!prompt.trim() || isRunning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold text-[14px] flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-accent-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none animate-pulse-glow"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Run Agent
                </>
              )}
            </button>

            {/* Recent Tasks */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Recent Tasks
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handlePromptSelect(task.prompt)}
                    disabled={isRunning}
                    className="group text-left p-3 rounded-lg bg-base-800 hover:bg-base-750 border border-base-650 hover:border-base-600 transition-all duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          task.status === "running" ? "bg-accent animate-pulse" : "bg-green-500/60"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] text-neutral-300 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {task.prompt}
                        </p>
                        <span className="text-[10px] text-neutral-600 mt-1 block">
                          {task.timestamp}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ===== Main Area ===== */}
        <main className="flex-1 overflow-y-auto bg-base-900">
          <div className="p-5 lg:p-8 max-w-5xl mx-auto flex flex-col gap-6">
            {/* Agent Status */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-base-800 border border-base-700 animate-fade-in">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${statusDot} ${status !== "Ready" && status !== "Done" ? "animate-pulse" : ""}`} />
                {status === "Thinking..." && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent animate-ping opacity-60" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Agent Status
                </span>
                <span className={`text-[15px] font-semibold ${statusColor}`}>
                  {status}
                </span>
              </div>
              {isRunning && (
                <div className="ml-auto flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce-dot"
                      style={{ animationDelay: `${i * 0.16}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live Steps Timeline */}
            <div className="rounded-2xl bg-base-800 border border-base-700 overflow-hidden animate-fade-in">
              <div className="px-5 py-3.5 border-b border-base-700 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
                  <BrainIcon className="w-3 h-3 text-accent-light" />
                </div>
                <span className="text-[13px] font-semibold text-neutral-200">
                  Live Steps
                </span>
                {isRunning && (
                  <span className="ml-auto text-[11px] text-accent-light font-mono animate-pulse">
                    processing...
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex flex-col gap-0">
                  {steps.map((step, i) => {
                    const Icon = STEP_ICONS[i] || BrainIcon;
                    const isLast = i === steps.length - 1;
                    return (
                      <div key={step.id} className="flex gap-4 animate-slide-in" style={{ animationDelay: `${i * 0.08}s` }}>
                        {/* Timeline track */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              step.status === "done"
                                ? "bg-green-500/15 border-green-500/40 text-green-400"
                                : step.status === "active"
                                ? "bg-accent/15 border-accent text-accent-light animate-pulse-glow"
                                : "bg-base-750 border-base-650 text-neutral-600"
                            }`}
                          >
                            {step.status === "done" ? (
                              <CheckIcon className="w-4 h-4" />
                            ) : step.status === "active" ? (
                              <div className="w-3.5 h-3.5 border-2 border-accent-light/30 border-t-accent-light rounded-full animate-spin-slow" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 flex-1 min-h-[28px] mt-1 rounded-full transition-colors duration-500 ${
                                step.status === "done" ? "bg-green-500/30" : "bg-base-650"
                              }`}
                            />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="pt-1.5 pb-5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[14px] font-medium transition-colors duration-300 ${
                                step.status === "done"
                                  ? "text-neutral-300"
                                  : step.status === "active"
                                  ? "text-white"
                                  : "text-neutral-600"
                              }`}
                            >
                              {step.label}
                            </span>
                            {step.status === "active" && (
                              <span className="text-[10px] font-mono text-accent-light/70 bg-accent/10 px-2 py-0.5 rounded-full">
                                in progress
                              </span>
                            )}
                          </div>
                          {step.status === "active" && (
                            <div className="mt-2 h-1 w-32 rounded-full bg-base-650 overflow-hidden">
                              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent to-accent-light animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Output Area */}
            <div className="rounded-2xl bg-base-800 border border-base-700 overflow-hidden animate-fade-in min-h-[280px]">
              <div className="px-5 py-3.5 border-b border-base-700 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-green-500/15 flex items-center justify-center">
                  <TableIcon className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-[13px] font-semibold text-neutral-200">
                  Output
                </span>
                {showOutput && (
                  <span className="ml-auto text-[11px] text-green-400/80 font-mono">
                    5 results
                  </span>
                )}
              </div>

              <div className="p-5">
                {!showOutput ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-base-750 border border-base-650 flex items-center justify-center mb-4">
                      <TableIcon className="w-6 h-6 text-neutral-600" />
                    </div>
                    <p className="text-[14px] text-neutral-500 font-medium">
                      {isRunning ? "Agent is working on your task..." : "No output yet"}
                    </p>
                    <p className="text-[12px] text-neutral-600 mt-1">
                      {isRunning ? "Results will appear here when the agent finishes." : "Run a task to see results here."}
                    </p>
                  </div>
                ) : (
                  <div className="animate-fade-in-up">
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto rounded-lg border border-base-650">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-base-750/50 border-b border-base-650">
                            <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-4 py-3">
                              Company
                            </th>
                            <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-4 py-3">
                              Funding
                            </th>
                            <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-4 py-3">
                              Product
                            </th>
                            <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-4 py-3">
                              Website
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {output!.map((row, i) => (
                            <tr
                              key={i}
                              className="border-b border-base-700 last:border-0 hover:bg-base-750/40 transition-colors duration-150"
                            >
                              <td className="px-4 py-3 text-[13.5px] text-white font-medium">
                                {row.company}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-neutral-300 font-mono">
                                {row.funding}
                              </td>
                              <td className="px-4 py-3 text-[13px] text-neutral-400">
                                {row.product}
                              </td>
                              <td className="px-4 py-3 text-[13px]">
                                <span className="inline-flex items-center gap-1 text-accent-light hover:text-accent underline-offset-2 hover:underline cursor-pointer">
                                  {row.website}
                                  <ExternalLinkIcon className="w-3 h-3" />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="flex flex-col gap-3 md:hidden">
                      {output!.map((row, i) => (
                        <div key={i} className="p-4 rounded-xl bg-base-750/50 border border-base-650">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[14px] font-semibold text-white">{row.company}</span>
                            <span className="text-[11px] text-accent-light font-mono">{row.funding}</span>
                          </div>
                          <p className="text-[12.5px] text-neutral-400 mb-2">{row.product}</p>
                          <span className="text-[12px] text-accent-light inline-flex items-center gap-1">
                            {row.website}
                            <ExternalLinkIcon className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 py-4 text-[11px] text-neutral-600">
              <SparklesIcon className="w-3 h-3" />
              <span>My AI Agent — V1 · Simulated responses for demonstration</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
