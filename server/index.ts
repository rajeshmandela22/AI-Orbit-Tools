import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

const tools = [
  {
    id: 1,
    slug: "chatgpt",
    name: "ChatGPT",
    category: "Productivity",
    description:
      "An AI assistant for writing, brainstorming, learning, coding, research, and everyday tasks.",
    rating: 4.8,
    reviews: 1250,
    pricing: "Free and paid plans",
    website: "https://chatgpt.com",
    features: [
      "AI conversations",
      "Writing and research",
      "Code assistance",
    ],
    about:
      "ChatGPT helps users explore ideas, solve problems, create content, and learn new concepts through conversational AI.",
  },
  {
    id: 2,
    slug: "claude",
    name: "Claude",
    category: "Productivity",
    description:
      "An AI assistant for writing, analysis, coding, and complex tasks.",
    rating: 4.7,
    reviews: 980,
    pricing: "Free and paid plans",
    website: "https://claude.ai",
    features: [
      "Writing assistance",
      "Document analysis",
      "Coding support",
    ],
    about:
      "Claude is an AI assistant designed to help with writing, reasoning, document analysis, and software development.",
  },
  {
    id: 3,
    slug: "github-copilot",
    name: "GitHub Copilot",
    category: "Development",
    description:
      "An AI coding assistant that helps developers write and understand code.",
    rating: 4.6,
    reviews: 850,
    pricing: "Free and paid plans",
    website: "https://github.com/features/copilot",
    features: [
      "Code suggestions",
      "Coding assistance",
      "Developer workflow support",
    ],
    about:
      "GitHub Copilot assists developers with code suggestions and AI-powered features throughout their coding workflow.",
  },
  {
    id: 4,
    slug: "midjourney",
    name: "Midjourney",
    category: "Image Generation",
    description:
      "Create images from text prompts using generative AI.",
    rating: 4.7,
    reviews: 760,
    pricing: "Paid plans",
    website: "https://www.midjourney.com",
    features: [
      "AI image generation",
      "Creative exploration",
      "Visual concepts",
    ],
    about:
      "Midjourney generates visual content from text prompts, helping users explore artistic styles and creative ideas.",
  },
  {
    id: 5,
    slug: "canva-ai",
    name: "Canva AI",
    category: "Design",
    description:
      "Create graphics, presentations, and visual content with AI assistance.",
    rating: 4.5,
    reviews: 620,
    pricing: "Free and paid plans",
    website: "https://www.canva.com",
    features: [
      "Design assistance",
      "Presentation creation",
      "AI-powered content",
    ],
    about:
      "Canva provides design tools with AI features to help create presentations, graphics, and other visual content.",
  },
  {
    id: 6,
    slug: "perplexity",
    name: "Perplexity",
    category: "Research",
    description:
      "An AI-powered search and answer engine for exploring information.",
    rating: 4.6,
    reviews: 710,
    pricing: "Free and paid plans",
    website: "https://www.perplexity.ai",
    features: [
      "AI search",
      "Research assistance",
      "Source-linked answers",
    ],
    about:
      "Perplexity helps users explore questions and research topics through AI-generated answers and linked sources.",
  },
];

app.get("/", (_req, res) => {
  res.json({
    message: "AI Orbit API is running!",
  });
});

app.get("/api/tools", (req, res) => {
  const search = String(req.query.search ?? "")
    .trim()
    .toLowerCase();

  const category = String(req.query.category ?? "All");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search) ||
      tool.description.toLowerCase().includes(search) ||
      tool.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || tool.category === category;

    return matchesSearch && matchesCategory;
  });

  res.json({
    count: filteredTools.length,
    tools: filteredTools,
  });
});

app.get("/api/tools/:slug", (req, res) => {
  const tool = tools.find(
    (item) => item.slug === req.params.slug
  );

  if (!tool) {
    return res.status(404).json({
      message: "Tool not found",
    });
  }

  res.json(tool);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Orbit API running on port ${PORT}`);
});