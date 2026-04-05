import { stylePresets } from "@/lib/mock-data/style-presets";
import {
  DEFAULT_SECTION_ORDER
} from "@/lib/constants";
import {
  GenerationResult,
  GenerationSection,
  HomepageSectionType,
  Project,
  ProjectInput,
  StylePreset,
  VersionScorecard
} from "@/lib/types";

function getPreset(name: ProjectInput["stylePreset"]): StylePreset {
  return stylePresets.find((preset) => preset.name === name) ?? stylePresets[0];
}

function buildPromptSummary(project: ProjectInput, refinement?: string) {
  const sectionList = project.desiredSections.join(", ");
  return [
    `Create a premium homepage concept for a ${project.businessType} business.`,
    `Audience: ${project.audience}. Goal: ${project.pageGoal}.`,
    `Style preset: ${project.stylePreset}.`,
    `Required sections: ${sectionList}.`,
    project.notes ? `Notes: ${project.notes}.` : null,
    refinement ? `Refinement request: ${refinement}.` : null
  ]
    .filter(Boolean)
    .join(" ");
}

function createScorecard(project: ProjectInput, refinement?: string): VersionScorecard {
  const baseline = refinement ? 8 : 7;
  const sectionBonus = Math.min(project.desiredSections.length, 9) / 2;
  const clarity = Math.min(10, Math.round((baseline + sectionBonus) * 10) / 10);
  const differentiation = Math.min(10, Math.round((baseline + 0.4) * 10) / 10);
  const premiumFeel = Math.min(10, Math.round((baseline + 0.8) * 10) / 10);
  const conversionFocus = Math.min(10, Math.round((baseline + 0.5) * 10) / 10);
  const average = Math.round(((clarity + differentiation + premiumFeel + conversionFocus) / 4) * 10) / 10;

  return { clarity, differentiation, premiumFeel, conversionFocus, average };
}

function sectionTemplate(
  type: HomepageSectionType,
  project: ProjectInput,
  preset: StylePreset,
  refinement?: string
): GenerationSection {
  const serviceExample = project.businessType.toLowerCase();
  const refinementNote = refinement ? ` Updated to reflect: ${refinement}.` : "";

  switch (type) {
    case "Hero":
      return {
        type,
        variant: "Split editorial hero",
        purpose: "Introduce the offer with premium positioning and an immediate trust cue.",
        content: {
          eyebrow: `${project.businessType} for ${project.audience}`,
          headline: `A clearer, more premium online presence for ${serviceExample} brands.`,
          supportingText: `Position the business as the obvious premium choice while moving visitors toward ${project.pageGoal.toLowerCase()}.${refinementNote}`,
          cta: "Book a strategy call",
          stats: [
            { label: "Positioning", value: "Sharper value story" },
            { label: "Conversion", value: "CTA-first page flow" },
            { label: "Delivery", value: "Figma/Webflow ready" }
          ]
        },
        visualNotes: `Use ${preset.rulesJson.imageStyle.toLowerCase()} and a composed art direction with restrained motion.`,
        layoutNotes: "Left-aligned messaging, right-side visual block, supporting proof metrics below headline."
      };
    case "Proof Strip":
      return {
        type,
        variant: "Trust metrics band",
        purpose: "Establish authority within the first viewport and reduce perceived risk.",
        content: {
          headline: "Chosen when the site needs to look established from day one.",
          supportingText: "Introduce recognisable proof markers that support the premium positioning.",
          stats: [
            { label: "Typical uplift", value: "Higher-quality leads" },
            { label: "Engagement", value: "Stronger first impression" },
            { label: "Handoff", value: "Clean implementation path" }
          ]
        },
        visualNotes: "Keep the strip slim, calm, and high contrast against the surrounding sections.",
        layoutNotes: "Three to four metrics or logos in a compact horizontal layout."
      };
    case "Services":
      return {
        type,
        variant: "Offer cards",
        purpose: "Make the service offer feel concrete without losing premium restraint.",
        content: {
          headline: "What the homepage concept is designed to solve.",
          supportingText: `Translate the ${project.businessType} offer into a homepage that is easier to trust and easier to buy from.`,
          cards: [
            {
              title: "Sharper positioning",
              description: "Clarify the offer, audience, and perceived value in the first few seconds.",
              meta: "Messaging"
            },
            {
              title: "Premium section flow",
              description: "Plan section order around proof, persuasion, and calmer decision-making.",
              meta: "Structure"
            },
            {
              title: "Production-ready direction",
              description: "Output visuals and content in a format ready for Figma, Codex, or Webflow execution.",
              meta: "Handoff"
            }
          ]
        },
        visualNotes: `Cards should feel ${preset.name === "Bold Modern Contrast" ? "assertive" : "refined"} with subtle borders and strong spacing.`,
        layoutNotes: "Three-card grid with concise descriptions and minimal icon dependence."
      };
    case "Outcomes / Benefits":
      return {
        type,
        variant: "Benefit pillars",
        purpose: "Shift from features to business outcomes that matter to the client.",
        content: {
          headline: "Built to improve how the business is perceived before the first call.",
          supportingText: `Frame outcomes around confidence, conversion quality, and authority with ${project.audience.toLowerCase()}.`,
          bullets: [
            "More premium first impression",
            "Better alignment between message and audience",
            "Clearer action path for high-intent visitors"
          ]
        },
        visualNotes: "Use a quieter background with an elevated content band or quote-style presentation.",
        layoutNotes: "Two-column layout with benefit copy on the left and a summary card or stat group on the right."
      };
    case "Case Study Preview":
      return {
        type,
        variant: "Transformation spotlight",
        purpose: "Provide a concrete example of the design direction in action.",
        content: {
          headline: "A homepage concept that makes the business look more expensive, not just more modern.",
          supportingText: "Show a before-to-after shift in clarity, tone, and section hierarchy using one concise featured case story.",
          cards: [
            {
              title: "Before",
              description: "Generic structure, weak proof sequencing, and a message that blends into the category."
            },
            {
              title: "After",
              description: "More intentional hierarchy, stronger trust cues, and a premium value narrative."
            }
          ]
        },
        visualNotes: "Treat this as a featured editorial case slice with a dominant visual and concise supporting analysis.",
        layoutNotes: "Large case card with side-by-side comparison notes or a layered spotlight panel."
      };
    case "Testimonials":
      return {
        type,
        variant: "Client perspective quotes",
        purpose: "Reinforce trust with concise, high-signal social proof.",
        content: {
          headline: "Direction that gives teams something solid to build from.",
          supportingText: "Use two or three short quotes that focus on clarity, speed, and implementation confidence.",
          cards: [
            {
              title: "Studio Founder",
              description: "The concept gave us a premium visual direction and a homepage structure we could actually ship."
            },
            {
              title: "Freelance Designer",
              description: "It helped me move from vague style ideas to a concept the client could approve quickly."
            }
          ]
        },
        visualNotes: "Avoid carousel patterns. Use anchored cards with strong whitespace and selective emphasis.",
        layoutNotes: "Two-up or three-up quote cards beneath a short section intro."
      };
    case "Process":
      return {
        type,
        variant: "Three-step process rail",
        purpose: "Make the workflow feel credible, fast, and easy to understand.",
        content: {
          headline: "A simple generation flow built for fast concepting.",
          supportingText: "Show how the app gets from brief to approved direction without heavy overhead.",
          cards: [
            {
              title: "Generate",
              description: "Turn project context and selected sections into a premium homepage concept."
            },
            {
              title: "Refine",
              description: "Apply targeted feedback to evolve the concept without restarting from zero."
            },
            {
              title: "Approve & Export",
              description: "Save versions, lock the preferred direction, and hand off clean outputs."
            }
          ]
        },
        visualNotes: "Use subtle numbering or rule lines rather than decorative illustrations.",
        layoutNotes: "Horizontal process cards on desktop, stacked sequence on mobile."
      };
    case "CTA":
      return {
        type,
        variant: "High-intent closing panel",
        purpose: "Convert motivated users after the narrative and proof sequence.",
        content: {
          headline: "Move from rough brief to premium homepage direction faster.",
          supportingText: "Keep the CTA concise and practical, pointing to concept generation or strategy kickoff.",
          cta: "Start a new concept"
        },
        visualNotes: "Stronger contrast and tighter copy, but still premium rather than salesy.",
        layoutNotes: "Contained panel with primary CTA, short reassurance, and optional secondary action."
      };
    case "Footer":
    default:
      return {
        type,
        variant: "Lean footer",
        purpose: "Close with structure, trust, and a final utility layer.",
        content: {
          headline: project.title,
          supportingText: `${project.businessType} homepage concepting, built for premium service businesses.`,
          bullets: ["Project summary", "Contact path", "Implementation handoff"]
        },
        visualNotes: "Minimal footer treatment with clear grouping and muted styling.",
        layoutNotes: "Two to three compact columns with restrained typography."
      };
  }
}

export function generateConcept(project: ProjectInput | Project, refinement?: string): {
  promptInput: string;
  result: GenerationResult;
  exportPrompt: string;
  scorecard: VersionScorecard;
} {
  const preset = getPreset(project.stylePreset);
  const sections = (project.desiredSections.length ? project.desiredSections : DEFAULT_SECTION_ORDER).map((type) =>
    sectionTemplate(type, project, preset, refinement)
  );

  const promptInput = buildPromptSummary(project, refinement);
  const result: GenerationResult = {
    projectSummary: `${project.title} is a premium homepage concept for a ${project.businessType} business targeting ${project.audience}. The concept is oriented around ${project.pageGoal.toLowerCase()} and uses the ${project.stylePreset} preset to guide hierarchy, tone, and visual direction.`,
    pageStrategy: {
      primaryMessage: `Present ${project.title} as the premium, lower-risk choice for ${project.audience}.`,
      conversionGoal: project.pageGoal,
      trustSignals: [
        "Early proof placement",
        "Service clarity with business outcomes",
        "Simple high-intent CTA path"
      ]
    },
    visualDirection: {
      preset: project.stylePreset,
      summary: preset.description,
      palette: ["Stone", "Ivory", "Graphite", "Muted bronze"],
      typography: preset.rulesJson.typographyVoice,
      moodKeywords: preset.rulesJson.do
    },
    sections,
    exportNotes: {
      imageDirection: [
        `Use imagery that matches ${preset.rulesJson.imageStyle.toLowerCase()}.`,
        "Prioritize believable service moments over generic office stock.",
        "Reserve stronger imagery for the hero and case study preview."
      ],
      figmaCodexPrompt: `Design a premium service-business homepage using the ${project.stylePreset} preset. Prioritize ${project.pageGoal.toLowerCase()}, include ${sections
        .map((section) => section.type)
        .join(", ")}, and translate each section into clean desktop-first UI with mobile-ready structure.`,
      webflowNotes: [
        "Build each homepage section as a reusable wrapper component or section symbol.",
        "Keep proof, service, and CTA sections editable without altering the broader layout system.",
        "Use predictable class naming that mirrors the section order for easier handoff."
      ]
    }
  };

  return {
    promptInput,
    result,
    exportPrompt: result.exportNotes.figmaCodexPrompt,
    scorecard: createScorecard(project, refinement)
  };
}
