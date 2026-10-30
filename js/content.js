// ============================================================================
//  YOUR PORTFOLIO CONTENT
//  This is the only file you need to edit to update the site.
//
//  Images and certificate files go in the assets/ folder, for example:
//    assets/projects/telemetry-cover.png
//    assets/certificates/oci-foundations.pdf
//  Then point to them with a path like "assets/projects/telemetry-cover.png".
//  A full web link (https://...) also works for files and certificates.
//
//  Dates: use "YYYY-MM" (e.g. "2026-03") or just "YYYY".
// ============================================================================

window.PORTFOLIO = {
  profile: {
    name: "Lorenzo Orrante",
    role: "Computer Science student",
    location: "Monterrey, Nuevo León",
    headline: "Building software for",   // big hero text
    headlineAccent: "the real world.",   // highlighted last line (optional)
    intro: "I'm Lorenzo, a Computer Science student at Tecnológico de Monterrey. I build real-time systems, computer vision and local AI tools, from race-car telemetry to autonomous drones.",
    subIntro: "Currently on the VantTec Autonomous Systems team. Expected graduation June 2028.",
    available: true,                    // true shows an "open to opportunities" dot
    availableText: "Open to internships",
    resume: "assets/resume.pdf",          // leave "" to hide the button
    email: "lorenzo.orrante@icloud.com",
    links: [
      { label: "GitHub", url: "https://github.com/ZeusTucZ" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/lorenzo-orrante-rom%C3%A1n-75b146359/" }
    ],
    about: [
      "I'm studying for a B.S. in Computer Science and Technologies at Tecnológico de Monterrey, with a 3.75/4.00 GPA.",
      "Most of my work sits where software meets hardware: telemetry for an eco-marathon race car, a race-strategy simulator, a privacy-first smart mirror, and vision-based navigation for an autonomous drone."
    ]
  },

  // --------------------------------------------------------------------------
  //  PROJECTS. Shown in this order. Copy one { ... } block to add another.
  //  cover:  path to a screenshot. If empty, a colored mockup is drawn using
  //          `colors` (two hex colors) and `mock` ("chart", "list", "tiles", "text").
  // --------------------------------------------------------------------------
  projects: [
    {
      title: "Vehicle Telemetry Dashboard",
      year: "2025–26",
      period: "May 2025 – Apr 2026",
      role: "Full-stack developer",
      summary: "A real-time telemetry and monitoring platform for a race car, with under 50 ms of latency.",
      tags: ["React", "Express.js", "PostgreSQL", "Socket.io"],
      cover: "assets/projects/telemetry-dashboard.jpg",
      colors: ["#ff9a6b", "#c2477a"],
      mock: "chart",
      problem: "The team needed to watch the vehicle live during track testing and keep reliable data for analysis afterwards.",
      solution: "A real-time platform built with React, Express.js, PostgreSQL and WebSockets. Incoming telemetry is validated automatically and saved to the database, and a responsive React interface shows live metrics and historical data. The platform is deployed to the cloud.",
      results: [
        "Under 50 ms communication latency across 100 validated data points",
        "Used for monitoring during track testing, helping spot abnormal or inconsistent system behavior",
        "Faster inspection of vehicle performance during testing sessions"
      ],
      images: [],
      links: [{ label: "Source code", url: "https://github.com/ZeusTucZ/Elyos-Telemetry" }]
    },
    {
      title: "agent-eval",
      year: "2026",
      period: "Oct 2026",
      role: "Solo project",
      summary: "A reliability harness that tests LLM agents and measures correctness, tool use, latency, cost and retries.",
      tags: ["Python", "SQLite", "Gemini", "Groq", "Ollama"],
      cover: "",
      colors: ["#e8c45c", "#c9733b"],
      mock: "chart",
      problem: "An agent can answer correctly in a demo and still be slow, expensive, flaky, or right for the wrong reason, such as answering from memory instead of using its tools. A single pass/fail number hides all of that.",
      solution: "A harness that runs an agent over a dataset many times and traces every LLM and tool call. Scorers are kept separate from trials, so they can be fixed and re-run without calling the model again. It adds retries with backoff, client-side rate limiting and a circuit breaker for daily quotas, and it works with a mock agent, Gemini, and OpenAI-compatible providers such as Groq or a local Ollama.",
      results: [
        "48/48 correct on the standard dataset with Groq, choosing the right tool every time",
        "A harder dataset scored 89.1% and showed prompt injection succeeding 2 of 4 times",
        "Inspecting real runs exposed a bug in my own scorer and mislabelled failures, both fixed"
      ],
      images: [],
      links: [{ label: "Source code", url: "https://github.com/ZeusTucZ/agent-eval" }]
    },
    {
      title: "Lux: Local AI Meeting Assistant",
      year: "2026",
      period: "May 2026",
      role: "Developer",
      summary: "Transcribes meetings and generates summaries, mind maps and chat answers with a local LLM.",
      tags: ["Python", "FastAPI", "Ollama", "Whisper", "ChromaDB", "React"],
      cover: "",
      colors: ["#8b8cf0", "#4a3f8f"],
      mock: "text",
      problem: "Meeting assistants usually send recordings to the cloud. Lux runs entirely on a local model.",
      solution: "An end-to-end Python/FastAPI application that transcribes audio with Whisper and uses a local Ollama LLM for summaries, mind maps and chat. A RAG pipeline with ChromaDB retrieves only the relevant parts of the transcript. The React interface supports streaming responses, persistent chat history, timeline navigation and structured transcript access.",
      results: [
        "30% fewer input tokens by retrieving only relevant transcript context"
      ],
      images: [],
      links: [{ label: "Source code", url: "https://github.com/ZeusTucZ/Guadalahacks-2026" }]
    },
    {
      title: "Autonomous Drone Navigation",
      year: "2026",
      period: "Sep 2026",
      role: "",
      summary: "A DJI Tello that uses its camera to find a 1×1 m gate, align with it and advance in controlled stages.",
      tags: ["Python", "OpenCV", "djitellopy"],
      cover: "",
      colors: ["#6f9fd8", "#2b4a7d"],
      mock: "text",
      problem: "The drone has to align with a gate and fly toward it using only its onboard camera, with no trained model and no 3D trajectory estimate.",
      solution: "A Python prototype that combines HSV color segmentation, geometric filters, a proportional controller and a state machine. It turns camera-frame error into movement commands during takeoff, traversal and landing, and a flight guard supervises the commands sent to the drone.",
      results: [
        "Runs on a live Tello, a webcam or a video file, so the vision logic can be tested without flying",
        "Automated tests cover capture, takeoff and failure cases with simulated hardware"
      ],
      images: [],
      links: [{ label: "Source code", url: "https://github.com/ZeusTucZ/reto-tello-gates" }]
    },
    {
      title: "Smart Mirror",
      year: "2025",
      period: "Oct – Dec 2025",
      role: "Developer",
      summary: "A smart mirror with facial recognition and voice commands that keeps biometric data on the local network.",
      tags: ["Python", "JavaScript", "MongoDB"],
      cover: "",
      colors: ["#6fb7a8", "#2c5f73"],
      mock: "tiles",
      problem: "Facial recognition usually means sending biometric data to an outside server.",
      solution: "Facial recognition with on-device inference, designed around Privacy by Design so biometric data never leaves the local network. Voice commands make it hands-free.",
      results: [
        "1st place, Physical Prototype category, Expo Ingenierías, against 12+ engineering teams"
      ],
      images: [],
      links: [{ label: "Source code", url: "https://github.com/danihdz11/Smart-Mirror" }]
    }
  ],

  // --------------------------------------------------------------------------
  //  EXPERIENCE. Shown in this order.
  // --------------------------------------------------------------------------
  experience: [
    {
      org: "VantTec Autonomous Systems Team",
      school: "Tecnológico de Monterrey",
      period: "Sep 2026 – Present",
      location: "Monterrey, Nuevo León",
      award: "",
      points: [
        "Developed an autonomous drone navigation system in Python using OpenCV and djitellopy to detect and align with a 1×1 m visual gate.",
        "Debugged and iterated on a computer-vision feedback loop, reproducing alignment failures and continuously correcting drone movement from camera-frame error during takeoff, traversal and landing."
      ]
    },
    {
      org: "Elyos Racing Team",
      school: "Tecnológico de Monterrey",
      period: "Aug 2025 – Jun 2026",
      location: "Guadalajara, Jalisco",
      award: "6th place, Shell Eco-marathon Americas 2025",
      points: [
        "Led race strategy for Shell Eco-marathon Americas 2025, building a Python energy model to evaluate lap strategies and engineering data, achieving an 11% improvement in energy efficiency.",
        "Developed a physics-based race simulator in Python and worked with the mechanical and electronics sub-teams to validate engineering assumptions and support data-driven decisions."
      ]
    }
  ],

  education: [
    {
      school: "Tecnológico de Monterrey",
      degree: "B.S. in Computer Science and Technologies",
      period: "Aug 2024 – Expected June 2028",
      location: "Monterrey, Nuevo León",
      note: "GPA 3.75 / 4.00"
    }
  ],

  skills: [
    { group: "Programming", items: ["Python", "C++", "JavaScript / TypeScript", "MATLAB"] },
    { group: "Software engineering", items: ["Object-oriented programming", "Data structures & algorithms", "REST APIs", "Full-stack development", "FastAPI", "Express.js", "React"] },
    { group: "AI & computer vision", items: ["OpenCV", "Ollama", "ChromaDB", "Whisper"] },
    { group: "Systems & infrastructure", items: ["Linux", "Cloud deployment", "WebSockets", "PostgreSQL", "MongoDB"] },
    { group: "Testing & validation", items: ["Debugging", "Automated validation", "API testing", "Git", "GitHub"] }
  ],

  // --------------------------------------------------------------------------
  //  CERTIFICATIONS. Sorted by date automatically (newest first).
  //  badge: 2–4 letters shown on the medal. file: PDF, image or link to the certificate.
  // --------------------------------------------------------------------------
  certifications: [
    {
      title: "OCI Foundations Associate",
      issuer: "Oracle",
      date: "",
      expires: "",
      credentialId: "",
      verifyUrl: "",
      file: "https://drive.google.com/file/d/108MJNYTEdnUXAzgJKHvCWzTOx-4BJ33V/view?usp=sharing",
      badge: "OCI"
    },
    {
      title: "OCI AI Foundations Associate",
      issuer: "Oracle",
      date: "",
      expires: "",
      credentialId: "",
      verifyUrl: "",
      file: "https://drive.google.com/file/d/1NszRxV8fscqQDoagyQuRi-gxA6I3L1x_/view?usp=sharing",
      badge: "AI"
    },
    {
      title: "Data Structures",
      issuer: "Zero To Mastery · Udemy",
      date: "",
      expires: "",
      credentialId: "",
      verifyUrl: "https://www.udemy.com/certificate/UC-e7d39414-74b3-46c6-b8b1-64b29e95e29d/",
      file: "",
      badge: "DS"
    }
  ],

  // --------------------------------------------------------------------------
  //  AWARDS. Sorted together with certifications by date.
  // --------------------------------------------------------------------------
  awards: [
    {
      title: "1st place, Physical Prototype category",
      by: "Expo Ingenierías",
      date: "2025",
      detail: "Smart Mirror, against 12+ engineering teams.",
      file: "https://drive.google.com/file/d/1Uo6PxW_tF16aJmc5TvvSlPt9WQb-I_m7/view?usp=sharing",
      badge: "1st"
    },
    {
      title: "6th place, Shell Eco-marathon Americas",
      by: "Shell Eco-marathon",
      date: "2025",
      detail: "With the Elyos Racing Team, where I led race strategy.",
      file: "https://drive.google.com/file/d/1KhPYm1C0T-40S-9WdeZvzZkT_pG76oo2/view?usp=sharing",
      badge: "6th"
    }
  ]
};
