import { UserTutorContext } from "./tutorContext";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TutorResponse {
  message: string;
  suggestions: string[];
  agentActions?: Array<{ action: string; payload: Record<string, unknown> }>;
}

// Extensible RAG hook for document retrieval
export async function retrieveSkillForgeDocs(query: string): Promise<string[]> {
  const lower = query.toLowerCase();
  if (lower.includes("dsa") || lower.includes("array") || lower.includes("roadmap")) {
    return [
      "SkillForge Knowledge: Master fundamentals first (Arrays, Pointers, Hash Maps), then proceed to Trees, Graphs, and System Design.",
    ];
  }
  return [];
}

export function buildSystemPrompt(context: UserTutorContext): string {
  const {
    userName,
    careerGoal,
    college,
    degree,
    skills,
    activeStageTitle,
    completedTopicsCount,
    totalTopicsCount,
    nextTopicToLearn,
    nextTopicDescription,
    upcomingTopics,
    dsaSolvedCount,
    dsaAttemptedCount,
    solvedDsaTitles,
    recommendedDsaProblems,
    pageContext,
  } = context;

  let pageSpecificPrompt = "";
  if (pageContext?.pageType === "topic" && pageContext.topicTitle) {
    pageSpecificPrompt = `
CURRENTLY VIEWING TOPIC PAGE:
- Title: ${pageContext.topicTitle}
- Description: ${pageContext.topicDescription || "N/A"}
`;
  } else if (pageContext?.pageType === "dsa" && pageContext.problemTitle) {
    pageSpecificPrompt = `
CURRENTLY SOLVING DSA PROBLEM:
- Problem: ${pageContext.problemTitle} (${pageContext.problemDifficulty || "Medium"})
- Description: ${pageContext.problemDescription || "N/A"}
- Student's Submitted Code:
\`\`\`
${pageContext.userCode || "// No code submitted yet"}
\`\`\`
`;
  }

  return `You are SkillForge AI — a powerful, general-purpose AI assistant and software engineering tutor by Code404.

CRITICAL INSTRUCTIONS ON ANSWERING QUESTIONS:
1. ANSWER THE USER'S QUESTION DIRECTLY: If the user asks ANY question (e.g., "What is a black hole?", "What is Python?", "Explain gravity", "How does photosynthesis work?", "What is standard deviation?"), you MUST answer their question thoroughly, accurately, and naturally.
2. DO NOT IGNORE THE USER'S QUERY: Never respond with just a summary of the student's profile or roadmap when they asked an unrelated general knowledge, science, math, coding, or conversational question.
3. USE SKILLFORGE CONTEXT ONLY WHEN RELEVANT: Use the student's profile context (career goal "${careerGoal}", active stage, next topic "${nextTopicToLearn || "Active Modules"}", DSA status) when the user asks about their roadmap, career path, DSA practice, next steps, or when advice naturally connects to their engineering track.

STUDENT PROFILE CONTEXT (Use when relevant):
- Student Name: ${userName}
- Target Career Track: ${careerGoal}
- Education: ${college || "Not set"} (${degree || "Not set"})
- Technical Skills: ${skills || "Building foundation"}
- Active Stage: ${activeStageTitle || "Stage 1: Core Fundamentals"}
- Progress: ${completedTopicsCount}/${totalTopicsCount} topics completed
- Next Topic: ${nextTopicToLearn || "All active topics complete!"} (${nextTopicDescription || "Core module"})
- Upcoming Queue: ${upcomingTopics.join(", ") || "Next Stage modules"}
- DSA Status: ${dsaSolvedCount} solved, ${dsaAttemptedCount} attempted
- Solved DSA: ${solvedDsaTitles.join(", ") || "None yet"}
- Recommended DSA: ${recommendedDsaProblems.join(", ") || "Arrays & Strings"}
${pageSpecificPrompt}

RESPONSE FORMAT & STYLE:
- Provide clear, direct, and well-structured answers using GitHub Markdown.
- Use LaTeX formatting for mathematical expressions where appropriate.
`;
}

export async function generateTutorResponse(
  messages: Message[],
  context: UserTutorContext
): Promise<TutorResponse> {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const systemPrompt = buildSystemPrompt(context);

  const relevantDocs = await retrieveSkillForgeDocs(lastMessage);
  const ragAddendum = relevantDocs.length > 0
    ? `\n\nRELEVANT SKILLFORGE KNOWLEDGE:\n${relevantDocs.join("\n")}`
    : "";

  const fullSystemInstruction = systemPrompt + ragAddendum;

  // 1. Try Gemini API if GEMINI_API_KEY is available
  if (process.env.GEMINI_API_KEY) {
    // Model fallback sequence
    const geminiModels = [
      process.env.GEMINI_MODEL,
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash",
    ].filter(Boolean) as string[];

    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    for (const model of geminiModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: fullSystemInstruction }],
              },
              contents: geminiContents,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return {
              message: text,
              suggestions: generateFollowUpSuggestions(lastMessage, context),
            };
          }
        } else {
          // Retry without system_instruction if rejected by model version
          const fallbackRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(10000),
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      { text: `[SYSTEM INSTRUCTIONS]\n${fullSystemInstruction}\n\n[USER QUESTION]\n${lastMessage}` },
                    ],
                  },
                ],
              }),
            }
          );

          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 0) {
              return {
                message: text,
                suggestions: generateFollowUpSuggestions(lastMessage, context),
              };
            }
          }
        }
      } catch (err) {
        console.error(`[tutorEngine] Gemini API error for model ${model}:`, err);
      }
    }
  }

  // 2. Try OpenAI API if OPENAI_API_KEY is available
  if (process.env.OPENAI_API_KEY) {
    const openaiModels = ["gpt-4o-mini", "gpt-3.5-turbo"];
    for (const model of openaiModels) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: fullSystemInstruction },
              ...messages,
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text && text.trim().length > 0) {
            return {
              message: text,
              suggestions: generateFollowUpSuggestions(lastMessage, context),
            };
          }
        }
      } catch (err) {
        console.error(`[tutorEngine] OpenAI API error for model ${model}:`, err);
      }
    }
  }

  // 3. Intelligent Local Fallback Engine (when API keys are unconfigured or network requests fail)
  return generateLocalFallbackResponse(lastMessage, context);
}

export function generateFollowUpSuggestions(
  query: string,
  context: UserTutorContext
): string[] {
  const lower = query.toLowerCase();

  // Science / Astronomy
  if (
    lower.includes("black hole") ||
    lower.includes("space") ||
    lower.includes("galaxy") ||
    lower.includes("universe") ||
    lower.includes("physics") ||
    lower.includes("science") ||
    lower.includes("quantum") ||
    lower.includes("gravity")
  ) {
    return [
      "How do black holes form?",
      "What happens at the event horizon?",
      "How is astrophysics related to computer simulations?",
      "Ask another science question",
    ];
  }

  // Programming Languages & Tech
  if (
    lower.includes("python") ||
    lower.includes("javascript") ||
    lower.includes("react") ||
    lower.includes("code") ||
    lower.includes("async") ||
    lower.includes("api") ||
    lower.includes("database")
  ) {
    return [
      "Show a practical code example",
      "What are key best practices?",
      "What projects can I build with this?",
      `How does this fit into ${context.careerGoal}?`,
    ];
  }

  // Mathematics
  if (
    lower.includes("math") ||
    lower.includes("calculus") ||
    lower.includes("algebra") ||
    lower.includes("equation") ||
    lower.includes("deviation") ||
    lower.includes("statistic")
  ) {
    return [
      "Show a step-by-step math example",
      "How is this applied in software engineering?",
      "What are real-world uses of this formula?",
      "Ask another math problem",
    ];
  }

  // Career Guidance
  if (
    lower.includes("career") ||
    lower.includes("resume") ||
    lower.includes("interview") ||
    lower.includes("portfolio") ||
    lower.includes("ai/ml") ||
    lower.includes("machine learning")
  ) {
    return [
      `What portfolio projects match ${context.careerGoal}?`,
      "How to prepare for technical interview rounds?",
      "What skills are most in demand right now?",
      `Explain ${context.nextTopicToLearn || "my next topic"}`,
    ];
  }

  // DSA & Roadmap Specific
  if (
    lower.includes("dsa") ||
    lower.includes("hint") ||
    context.pageContext?.pageType === "dsa"
  ) {
    return [
      "Give me a time complexity optimization hint",
      "What are edge cases to test?",
      `Recommend a ${context.careerGoal} DSA challenge`,
      `Explain ${context.nextTopicToLearn || "my next topic"}`,
    ];
  }

  if (lower.includes("next") || lower.includes("learn") || lower.includes("roadmap")) {
    return [
      `Explain ${context.nextTopicToLearn || "my next topic"}`,
      "What portfolio projects should I build?",
      "How to prepare for placement interviews?",
      "Give me a DSA problem hint",
    ];
  }

  return [
    "Explain a programming concept",
    "Ask a science or math question",
    `What to learn next in ${context.careerGoal}?`,
    "Give me a technical interview tip",
  ];
}

function generateLocalFallbackResponse(
  query: string,
  context: UserTutorContext
): TutorResponse {
  const lower = query.toLowerCase();
  const userName = context.userName || "Student";
  const track = context.careerGoal || "Software Engineer";
  const nextTopic = context.nextTopicToLearn || "Advanced Architecture & Systems";
  const nextDesc = context.nextTopicDescription || "Core curriculum module for your track.";

  // 1. Astronomy / Space / Science (e.g. "what is a black hole")
  if (
    lower.includes("black hole") ||
    lower.includes("event horizon") ||
    lower.includes("singularity")
  ) {
    return {
      message: `### SkillForge AI — Astronomy & Physics Explanation

A **black hole** is a region of spacetime where gravitational pull is so intense that nothing—not even light or electromagnetic radiation—can escape from inside its boundary, known as the **event horizon**.

#### Key Features of a Black Hole:
1. **Event Horizon**: The point of no return. Once anything crosses this boundary, escape velocity exceeds the speed of light ($c$).
2. **Singularity**: At the center lies a point of near-infinite density and mass compressed into zero volume, according to General Relativity.
3. **Formation**: Stellar-mass black holes form when massive stars exhaust their nuclear fuel and undergo gravitational collapse at the end of their lifecycle.
4. **Supermassive Black Holes**: Located at the centers of most galaxies (including Sagittarius A* in our Milky Way), containing millions to billions of solar masses.

*Tip: In computer science and physics, black holes are modeled using complex numerical simulations, tensor calculus algorithms, and high-performance computing clusters!*`,
      suggestions: [
        "How do black holes form?",
        "What is the event horizon?",
        "How are black holes simulated with computers?",
        `What topic should I learn next in ${track}?`,
      ],
    };
  }

  if (
    lower.includes("science") ||
    lower.includes("physics") ||
    lower.includes("quantum") ||
    lower.includes("chemistry") ||
    lower.includes("photosynthesis") ||
    lower.includes("gravity") ||
    lower.includes("atom")
  ) {
    return {
      message: `### SkillForge AI — Scientific Concept Overview

Here is a scientific breakdown for **${userName}**:

- **Core Concept**: Science uses observation, mathematical modeling, and hypothesis testing to understand physical phenomena.
- **Key Principles**:
  - Systems obey fundamental conservation laws (energy, momentum, electric charge).
  - Physical models can be simulated computationally using numerical methods, differential equations, and algorithms.

If you have a specific scientific question (like quantum computing, mechanics, or biology), ask away!`,
      suggestions: [
        "Explain quantum computing in simple terms",
        "How do physics engines work in game design?",
        `What to learn next in ${track}?`,
      ],
    };
  }

  // 2. Programming Languages (e.g. "what is python?")
  if (
    lower.includes("python") ||
    lower.includes("what is python")
  ) {
    return {
      message: `### SkillForge AI — Programming Explanation: Python

**Python** is a high-level, dynamically typed, interpreted programming language known for its clear syntax and high readability.

#### Why Python is Popular:
1. **Versatility**: Widely used in Web Development (Django, FastAPI), Data Science (Pandas, NumPy), Machine Learning (PyTorch, TensorFlow), and Scripting.
2. **Readability**: Designed so code is clean, concise, and easy to maintain.
3. **Ecosystem**: Millions of open-source packages available via \`pip\`.

\`\`\`python
# Example: Python List Comprehension & Async Concept
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers if n % 2 == 0]
print(f"Even squares: {squares}")  # Output: Even squares: [4, 16]
\`\`\``,
      suggestions: [
        "How does Python compare to JavaScript?",
        "What Python frameworks should I learn?",
        `How is Python used in ${track}?`,
      ],
    };
  }

  if (
    lower.includes("javascript") ||
    lower.includes("react") ||
    lower.includes("typescript") ||
    lower.includes("node") ||
    lower.includes("async") ||
    lower.includes("code") ||
    lower.includes("function")
  ) {
    return {
      message: `### SkillForge AI — Software Engineering & Code Explanation

Here is a technical overview for **${userName}**:

\`\`\`javascript
// Asynchronous Execution in JavaScript / TypeScript
async function fetchUserProgress(userId) {
  try {
    const res = await fetch(\`/api/user/\${userId}\`);
    if (!res.ok) throw new Error(\`Failed with status \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error("Data retrieval error:", err);
    throw err;
  }
}
\`\`\`

**Key Software Concepts**:
- **Non-blocking I/O**: Promises and \`async/await\` allow handling asynchronous network operations without freezing UI threads.
- **Robust Error Handling**: Guard with \`try/catch\` and explicit status checks.`,
      suggestions: [
        "Explain async/await step by step",
        "What are common debugging techniques?",
        `How does this apply to ${nextTopic}?`,
      ],
    };
  }

  // 3. Mathematics
  if (
    lower.includes("math") ||
    lower.includes("calculus") ||
    lower.includes("algebra") ||
    lower.includes("equation") ||
    lower.includes("statistic") ||
    lower.includes("probability") ||
    lower.includes("deviation")
  ) {
    return {
      message: `### SkillForge AI — Mathematics & Analytics

Here is a mathematical breakdown for **${userName}**:

- **Formula / Concept**:
  $$\\text{Standard Deviation } (\\sigma) = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}$$
  *where $\\mu$ is the population mean and $x_i$ represents observations.*
- **Application in Software**: Mathematics forms the foundation for data structures, algorithmic time complexity analysis ($O(N \\log N)$), machine learning, and cryptography.`,
      suggestions: [
        "Show a step-by-step math example",
        "How is statistics used in computer science?",
        `What topic should I learn next in ${track}?`,
      ],
    };
  }

  // 4. Career / Learning AI/ML
  if (
    lower.includes("ai/ml") ||
    lower.includes("machine learning") ||
    lower.includes("ai") ||
    lower.includes("learn ai")
  ) {
    return {
      message: `### SkillForge AI — Path to Mastering AI / Machine Learning

To master **AI & Machine Learning**, follow this structured roadmap:

1. **Foundations**: Mathematics (Linear Algebra, Multivariate Calculus, Probability & Statistics) and Python.
2. **Data Manipulation**: Master Pandas, NumPy, and Matplotlib.
3. **Classic ML**: Study Scikit-Learn (Supervised/Unsupervised Learning, Regression, Trees, SVMs).
4. **Deep Learning**: Learn PyTorch or TensorFlow (Neural Networks, CNNs, Transformers, LLMs).
5. **Applied Projects**: Build real-world applications combining API endpoints with modern LLMs and vector databases.`,
      suggestions: [
        "What Python libraries are essential for AI?",
        "What portfolio projects should I build for ML?",
        `How can I integrate AI into my ${track} track?`,
      ],
    };
  }

  if (
    lower.includes("career") ||
    lower.includes("resume") ||
    lower.includes("interview") ||
    lower.includes("portfolio") ||
    lower.includes("job")
  ) {
    return {
      message: `### SkillForge AI — Career & Interview Guidance

For **${track}**, here is your strategic action plan, **${userName}**:

1. **Portfolio Projects**: Build 2-3 production-grade applications featuring authentication, clean database schemas, and cloud deployment.
2. **DSA Mastery**: Practice solving problem patterns (Two Pointers, Sliding Window, Trees, Graphs).
3. **Resume Structure**: Focus on metrics (e.g. "Optimized API latency by 40% using Redis").
4. **Mock Interviews**: Practice explaining code structure and system design trade-offs out loud.`,
      suggestions: [
        `What projects match my ${track} track?`,
        "Top technical interview questions to practice",
        "Give me a DSA challenge hint",
      ],
    };
  }

  // 5. Explicit Roadmap / Next Topic Queries
  if (
    lower.includes("my roadmap") ||
    lower.includes("my profile") ||
    lower.includes("my progress") ||
    lower.includes("what should i learn next") ||
    lower.includes("next topic") ||
    lower.includes("my stage")
  ) {
    const upcomingList = context.upcomingTopics.length > 0
      ? context.upcomingTopics.map((t) => `- ${t}`).join("\n")
      : "- Complete current stage requirements";

    return {
      message: `### SkillForge AI Tutor — Personalized Roadmap Guidance

Hey **${userName}**! Here is your current **${track}** learning status:

- **Current Progress**: ${context.completedTopicsCount}/${context.totalTopicsCount} topics completed (${context.activeStageTitle || "Active Pipeline"}).
- **Next Required Topic**: **${nextTopic}**
  - *Overview*: ${nextDesc}

**Recommended Immediate Pipeline**:
1. Study and complete the module for **${nextTopic}**.
2. Work through the upcoming queue:
${upcomingList}
3. Practice recommended DSA problems: ${context.recommendedDsaProblems.join(", ") || "Arrays & Hash Maps"}.`,
      suggestions: [
        `Explain ${nextTopic}`,
        "What projects match my track?",
        "Give me a DSA problem hint",
      ],
    };
  }

  // 6. Explicit DSA Queries
  if (
    lower.includes("dsa") ||
    lower.includes("hint") ||
    context.pageContext?.pageType === "dsa"
  ) {
    const activeProblem = context.pageContext?.problemTitle || "your active problem";

    return {
      message: `### SkillForge AI Tutor — DSA Hint & Algorithmic Strategy

Hello **${userName}**! Here is your DSA guidance for **${track}**:

- **Solved Problems**: ${context.dsaSolvedCount} solved
- **Active Focus**: **${activeProblem}**

**Algorithmic Strategy**:
1. **Identify Pattern**: Look for Two Pointers, Binary Search ($O(\\log N)$), or Hash Table ($O(1)$ lookup).
2. **Edge Cases**: Guard against empty arrays, null values, single elements, and integer overflow.
3. **Complexity Target**: Aim for $O(N)$ time and minimal extra space.`,
      suggestions: [
        "Give me a hint for time complexity optimization",
        `How does this apply to ${track}?`,
        `What is my next roadmap topic?`,
      ],
    };
  }

  // 7. General Purpose Natural Answer (For any general question)
  return {
    message: `### SkillForge AI Assistant

Great question!

To give you the most accurate answer:
- If you're asking a **general knowledge, science, mathematics, or programming question**, I am ready to explain it in full detail!
- If you want guidance on your **${track}** learning path or **DSA practice**, ask "What should I learn next?" or "Give me a DSA hint".

Please rephrase or clarify your question so I can provide the exact step-by-step breakdown you need!`,
    suggestions: [
      "What is a black hole?",
      "What is Python?",
      "How do I learn AI/ML?",
      `What should I learn next in ${track}?`,
    ],
  };
}

