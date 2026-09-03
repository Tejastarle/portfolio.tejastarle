import Reveal from "./Reveal";

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Payments",
    items: ["Razorpay", "Stripe", "PayPal", "UPI Flows", "Webhooks & Callbacks", "Order–Capture–Refund", "HMAC Signature Verification", "Idempotency Keys", "Reconciliation", "Payment State Machines"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST API Design", "Microservices", "OAuth 2.0", "JWT", "OTP Auth", "Rate Limiting", "Session & Token Mgmt"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "MySQL", "Oracle", "Firebase Realtime DB", "Schema Design", "Indexing", "Query Optimisation"],
  },
  {
    title: "Frontend",
    items: ["ReactJS", "Responsive UI", "Component Architecture", "State Management", "HTML5", "CSS3"],
  },
  {
    title: "Mobile",
    items: ["Android (Java/XML)", "Flutter", "MVVM", "Material Design", "Firebase Auth & FCM", "Play Store Release"],
  },
  {
    title: "DevOps & Tooling",
    items: ["Git", "GitHub", "CI/CD Pipelines", "Linux", "Nginx", "DNS & Domains", "SSL/TLS", "Postman"],
  },
  {
    title: "Foundations",
    items: ["Data Structures & Algorithms", "OOP", "DBMS", "System Design", "RESTful Architecture", "Secure Coding", "OWASP Top 10"],
  },
  {
    title: "AI & Delivery",
    items: ["LLM API Integration", "Tool / Function Calling", "Prompt Engineering", "Reporting Agents", "Agile / Scrum", "Jira", "Asana", "Code Review"],
  },
];

export default function Skills() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {GROUPS.map((g, i) => (
        <Reveal key={g.title} delay={i * 0.05} className="bg-ink-2">
          <div className="h-full px-6 py-7">
            <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-gold">
              {g.title}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="cursor-default rounded border border-line px-2 py-1 text-[11px] text-paper/70 transition-colors duration-200 hover:border-gold/60 hover:text-paper"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
