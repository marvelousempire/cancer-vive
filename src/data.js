import messages from "./user-messages.json";

// Plain public copy is governed in one file. Exact research records remain in literature/.
export const content = messages.normal_view;
export const expertContent = messages.expert_view;
export const evidenceItems = content.topics;
export const evidenceClasses = content.grades;
export const mechanismLabels = content.categories;
export const navItems = [
  { id: "dashboard", label: content.ui.start, icon: "⌂" },
  { id: "mechanisms", label: content.ui.topics, icon: "⌬" },
  { id: "matrix", label: content.ui.quick, icon: "▦" },
  { id: "education", label: content.ui.learn, icon: "?" },
  { id: "research", label: content.ui.questions, icon: "≡" }
];
