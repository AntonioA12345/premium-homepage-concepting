export type StylePresetName =
  | "Editorial Premium"
  | "Minimal Authority"
  | "Cinematic Luxury"
  | "Bold Modern Contrast"
  | "Structured Professional";

export type HomepageSectionType =
  | "Hero"
  | "Proof Strip"
  | "Services"
  | "Outcomes / Benefits"
  | "Case Study Preview"
  | "Testimonials"
  | "Process"
  | "CTA"
  | "Footer";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface ProjectInput {
  title: string;
  businessType: string;
  audience: string;
  pageGoal: string;
  stylePreset: StylePresetName;
  desiredSections: HomepageSectionType[];
  notes?: string;
}

export interface Project extends ProjectInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  currentVersionId?: string;
}

export interface GenerationSection {
  type: HomepageSectionType;
  variant: string;
  purpose: string;
  content: {
    eyebrow?: string;
    headline: string;
    supportingText: string;
    bullets?: string[];
    cta?: string;
    stats?: Array<{ label: string; value: string }>;
    cards?: Array<{
      title: string;
      description: string;
      meta?: string;
    }>;
  };
  visualNotes: string;
  layoutNotes: string;
}

export interface GenerationResult {
  projectSummary: string;
  pageStrategy: {
    primaryMessage: string;
    conversionGoal: string;
    trustSignals: string[];
  };
  visualDirection: {
    preset: StylePresetName;
    summary: string;
    palette: string[];
    typography: string;
    moodKeywords: string[];
  };
  sections: GenerationSection[];
  exportNotes: {
    imageDirection: string[];
    figmaCodexPrompt: string;
    webflowNotes: string[];
  };
}

export interface VersionScorecard {
  clarity: number;
  differentiation: number;
  premiumFeel: number;
  conversionFocus: number;
  average: number;
}

export interface Version {
  id: string;
  projectId: string;
  versionNumber: number;
  promptInput: string;
  structuredOutput: GenerationResult;
  previewCodeOrRenderConfig: {
    themeTone: string;
    density: "airy" | "balanced" | "content-rich";
  };
  exportPrompt: string;
  scorecard: VersionScorecard;
  isApproved: boolean;
  refinementInstruction?: string;
  createdAt: string;
}

export interface StylePreset {
  id: string;
  name: StylePresetName;
  description: string;
  rulesJson: {
    layoutRhythm: string;
    typographyVoice: string;
    imageStyle: string;
    componentDirection: string;
    do: string[];
    avoid: string[];
  };
}
