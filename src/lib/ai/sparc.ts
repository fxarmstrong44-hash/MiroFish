import { routeAI, type AIMessage } from "./router";

export type SPARCPhase = "specification" | "pseudocode" | "architecture" | "refinement" | "completion";

export interface SPARCResult {
  phase: SPARCPhase;
  output: string;
  nextPhase: SPARCPhase | null;
}

const PHASE_PROMPTS: Record<SPARCPhase, string> = {
  specification: `You are in SPARC Specification phase. Break down the user's request into:
1. Clear problem statement
2. Input/output requirements
3. Constraints and edge cases
4. Success criteria
Format as a structured specification document.`,

  pseudocode: `You are in SPARC Pseudocode phase. Given the specification, write:
1. High-level algorithm steps
2. Data flow description
3. Key decision points
4. Error handling approach
Write clear pseudocode, not actual code.`,

  architecture: `You are in SPARC Architecture phase. Design:
1. System components and their responsibilities
2. Data models and relationships
3. API contracts between components
4. Technology choices with justification
Present as an architecture document.`,

  refinement: `You are in SPARC Refinement phase. Review and improve:
1. Identify gaps or weaknesses in the architecture
2. Optimize for performance and scalability
3. Add security considerations
4. Validate against original specification
Provide refined version with changes highlighted.`,

  completion: `You are in SPARC Completion phase. Produce:
1. Final implementation plan with file structure
2. Code for each component
3. Integration points
4. Testing strategy
Deliver production-ready output.`,
};

const PHASE_ORDER: SPARCPhase[] = ["specification", "pseudocode", "architecture", "refinement", "completion"];

export async function runSPARCPhase(
  phase: SPARCPhase,
  userRequest: string,
  previousOutputs: string[] = []
): Promise<SPARCResult> {
  const context = previousOutputs.length > 0
    ? `\n\nPREVIOUS PHASES OUTPUT:\n${previousOutputs.join("\n---\n")}`
    : "";

  const messages: AIMessage[] = [
    { role: "system", content: PHASE_PROMPTS[phase] },
    { role: "user", content: `${userRequest}${context}` },
  ];

  const result = await routeAI(messages, "reasoning", { temperature: 0.4, maxTokens: 4096 });

  const currentIndex = PHASE_ORDER.indexOf(phase);
  const nextPhase = currentIndex < PHASE_ORDER.length - 1 ? PHASE_ORDER[currentIndex + 1] : null;

  return { phase, output: result.content, nextPhase };
}

export async function runFullSPARC(userRequest: string): Promise<SPARCResult[]> {
  const results: SPARCResult[] = [];
  const outputs: string[] = [];

  for (const phase of PHASE_ORDER) {
    const result = await runSPARCPhase(phase, userRequest, outputs);
    results.push(result);
    outputs.push(`[${phase.toUpperCase()}]\n${result.output}`);
  }

  return results;
}
