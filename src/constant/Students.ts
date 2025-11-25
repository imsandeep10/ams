export const Languages=[
    "IELTS",
    "PTE",
    "Duolingo",
    "SAT"]


    export const Countries=[
        "Australia",
        "Canada",
        "USA",  
        "UK",
        "New Zealand",
        "Germany",
        "Denmark",
        "Finland",
        "Ireland",
        "South Korea"]


        export const academicQualifications=[
            "Diploma",
            "+2",
            "Bachelor's",
            "Master's",
            "PhD"
        ]

// Generate qualification years dynamically: current year + 1, then 10 years back
const currentYear = new Date().getFullYear();
export const qualificationYear = Array.from(
    { length: 12 }, 
    (_, i) => String(currentYear + 1 - i)
);