export const JOB_CATEGORIES = [
  { name: "General", icon: "🛠" },
  { name: "Chatting", icon: "💬" },
  { name: "Copywriting", icon: "✍️" },
  { name: "Graphic Design", icon: "🎨" },
  { name: "Development", icon: "🚀" },
  { name: "Editing", icon: "🎬" },
  { name: "Marketing", icon: "📈" },
  { name: "Recruitment", icon: "🎯" },
  { name: "Sales", icon: "💼" },
  { name: "AI", icon: "🤖" },
  { name: "Finance", icon: "💰" },
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number]["name"];
