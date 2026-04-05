import { generateConcept } from "@/lib/generation/pipeline";
import {
  AppUser,
  GenerationResult,
  Project,
  ProjectInput,
  Version,
  VersionScorecard
} from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  business_type: string;
  audience: string;
  page_goal: string;
  style_preset: Project["stylePreset"];
  desired_sections: Project["desiredSections"];
  notes: string | null;
  current_version_id: string | null;
  created_at: string;
  updated_at: string;
};

type VersionRow = {
  id: string;
  project_id: string;
  version_number: number;
  prompt_input: string;
  structured_output: GenerationResult;
  preview_code_or_render_config: Version["previewCodeOrRenderConfig"];
  export_prompt: string;
  scorecard: VersionScorecard;
  is_approved: boolean;
  refinement_instruction: string | null;
  created_at: string;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    businessType: row.business_type,
    audience: row.audience,
    pageGoal: row.page_goal,
    stylePreset: row.style_preset,
    desiredSections: row.desired_sections,
    notes: row.notes ?? "",
    currentVersionId: row.current_version_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapVersion(row: VersionRow): Version {
  return {
    id: row.id,
    projectId: row.project_id,
    versionNumber: row.version_number,
    promptInput: row.prompt_input,
    structuredOutput: row.structured_output,
    previewCodeOrRenderConfig: row.preview_code_or_render_config,
    exportPrompt: row.export_prompt,
    scorecard: row.scorecard,
    isApproved: row.is_approved,
    refinementInstruction: row.refinement_instruction ?? undefined,
    createdAt: row.created_at
  };
}

async function ensureUser(user: AppUser) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.fullName
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function listProjectsForUser(userId: string): Promise<Project[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProjectRow[]).map(mapProject);
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProject(data as ProjectRow) : null;
}

export async function updateProjectById(
  projectId: string,
  patch: Partial<ProjectInput>
): Promise<Project | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.businessType !== undefined ? { business_type: patch.businessType } : {}),
      ...(patch.audience !== undefined ? { audience: patch.audience } : {}),
      ...(patch.pageGoal !== undefined ? { page_goal: patch.pageGoal } : {}),
      ...(patch.stylePreset !== undefined ? { style_preset: patch.stylePreset } : {}),
      ...(patch.desiredSections !== undefined ? { desired_sections: patch.desiredSections } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      updated_at: new Date().toISOString()
    })
    .eq("id", projectId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProject(data as ProjectRow) : null;
}

export async function listVersionsForProject(projectId: string): Promise<Version[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("versions")
    .select("*")
    .eq("project_id", projectId)
    .order("version_number", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as VersionRow[]).map(mapVersion);
}

async function createGeneratedVersion(
  projectId: string,
  projectInput: ProjectInput,
  versionNumber: number,
  refinementInstruction?: string
): Promise<Version> {
  const supabase = createSupabaseServerClient();
  const generation = generateConcept(projectInput, refinementInstruction);
  const { data, error } = await supabase
    .from("versions")
    .insert({
      project_id: projectId,
      version_number: versionNumber,
      prompt_input: generation.promptInput,
      structured_output: generation.result,
      preview_code_or_render_config: {
        themeTone: projectInput.stylePreset,
        density: refinementInstruction ? "content-rich" : "balanced"
      },
      export_prompt: generation.exportPrompt,
      scorecard: generation.scorecard,
      is_approved: versionNumber === 1,
      refinement_instruction: refinementInstruction ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapVersion(data as VersionRow);
}

export async function createProjectWithInitialVersion(
  user: AppUser,
  input: ProjectInput
): Promise<Project> {
  await ensureUser(user);

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title: input.title,
      business_type: input.businessType,
      audience: input.audience,
      page_goal: input.pageGoal,
      style_preset: input.stylePreset,
      desired_sections: input.desiredSections,
      notes: input.notes ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const project = mapProject(data as ProjectRow);
  const initialVersion = await createGeneratedVersion(project.id, input, 1);

  const { data: updatedProject, error: updateError } = await supabase
    .from("projects")
    .update({
      current_version_id: initialVersion.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", project.id)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return mapProject(updatedProject as ProjectRow);
}

export async function createVersionForProject(
  projectId: string,
  projectInput: ProjectInput,
  refinementInstruction?: string
): Promise<Version> {
  const supabase = createSupabaseServerClient();
  const { data: latest, error: latestError } = await supabase
    .from("versions")
    .select("version_number")
    .eq("project_id", projectId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    throw new Error(latestError.message);
  }

  const versionNumber = ((latest as { version_number?: number } | null)?.version_number ?? 0) + 1;
  const version = await createGeneratedVersion(projectId, projectInput, versionNumber, refinementInstruction);

  const { error } = await supabase
    .from("projects")
    .update({
      current_version_id: version.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  return version;
}

export async function approveProjectVersion(projectId: string, versionId: string): Promise<Version[]> {
  const supabase = createSupabaseServerClient();

  const { error: resetError } = await supabase
    .from("versions")
    .update({ is_approved: false })
    .eq("project_id", projectId);

  if (resetError) {
    throw new Error(resetError.message);
  }

  const { error: approveError } = await supabase
    .from("versions")
    .update({ is_approved: true })
    .eq("id", versionId)
    .eq("project_id", projectId);

  if (approveError) {
    throw new Error(approveError.message);
  }

  const { error: projectError } = await supabase
    .from("projects")
    .update({
      current_version_id: versionId,
      updated_at: new Date().toISOString()
    })
    .eq("id", projectId);

  if (projectError) {
    throw new Error(projectError.message);
  }

  return listVersionsForProject(projectId);
}
