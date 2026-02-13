export const Languages = ["IELTS", "PTE", "Duolingo", "SAT"];

export const Countries = [
  { label: "Australia", value: "Australia" },
  { label: "Canada", value: "Canada" },
  { label: "USA", value: "USA" },
  { label: "UK", value: "UK" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Germany", value: "Germany" },
  { label: "Denmark", value: "Denmark" },
  { label: "Finland", value: "Finland" },
  { label: "Ireland", value: "Ireland" },
  { label: "South Korea", value: "South Korea" },
];
export const academicQualifications = [
  "Diploma",
  "+2",
  "Bachelor's",
  "Master's",
  "PhD",
];

// Generate qualification years dynamically: current year + 1, then 10 years back
const currentYear = new Date().getFullYear();
export const qualificationYear = Array.from({ length: 12 }, (_, i) => ({
  label: `${currentYear + 1 - i}`,
  value: `${currentYear + 1 - i}`,
}));
