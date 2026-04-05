insert into style_presets (name, description, rules_json)
values
  (
    'Editorial Premium',
    'Sophisticated layouts with restrained contrast, refined typography, and elegant storytelling pacing.',
    '{
      "layoutRhythm": "Spacious editorial blocks with alternating feature moments and controlled line lengths.",
      "typographyVoice": "Serif-led, poised, and high-end without feeling old-fashioned.",
      "imageStyle": "Architectural, lifestyle, and detail-oriented photography with soft neutrals.",
      "componentDirection": "Magazine-like content bands, proof modules, and quiet call-to-action treatments.",
      "do": ["Use asymmetry sparingly", "Create strong reading hierarchy", "Pair statements with proof"],
      "avoid": ["Loud gradients", "Crowded cards", "Overly casual copy"]
    }'::jsonb
  ),
  (
    'Minimal Authority',
    'Lean, confident presentation built around concise copy, strong whitespace, and sober trust cues.',
    '{
      "layoutRhythm": "Clean vertical stacking with disciplined spacing and clear section transitions.",
      "typographyVoice": "Direct, confident, modern sans-serif with executive tone.",
      "imageStyle": "Selective photography, subtle texture, restrained monochrome accents.",
      "componentDirection": "Simple containers, metrics strips, and crisp service breakdowns.",
      "do": ["Keep CTA language practical", "Use proof early", "Prioritize scanability"],
      "avoid": ["Decorative clutter", "Verbose copy", "Playful motifs"]
    }'::jsonb
  ),
  (
    'Cinematic Luxury',
    'High-drama concepting with premium tension, atmospheric imagery, and immersive hero composition.',
    '{
      "layoutRhythm": "Large visual anchors, layered sections, and slower reveal of detail.",
      "typographyVoice": "Confident, dramatic, slightly fashion-adjacent.",
      "imageStyle": "Moody lighting, rich textures, dramatic contrast, premium environments.",
      "componentDirection": "Statement hero, immersive case study moments, and polished testimonial treatment.",
      "do": ["Lead with atmosphere", "Keep copy selective", "Use contrast for focus"],
      "avoid": ["Stock-feeling icons", "Generic corporate blocks", "Dense supporting UI"]
    }'::jsonb
  ),
  (
    'Bold Modern Contrast',
    'Energetic contemporary layouts that lean on contrast, clear segmentation, and assertive messaging.',
    '{
      "layoutRhythm": "Tighter pacing with contrast bands, card systems, and strong visual breaks.",
      "typographyVoice": "Sharp, contemporary, slightly punchy but still premium.",
      "imageStyle": "Clean compositions with directional crops and graphic contrast.",
      "componentDirection": "High-contrast hero, bold cards, and modern process visualization.",
      "do": ["Make hierarchy unmistakable", "Use direct headlines", "Separate ideas clearly"],
      "avoid": ["Muted messaging", "Flat one-note sections", "Overly decorative scripts"]
    }'::jsonb
  ),
  (
    'Structured Professional',
    'Reliable, premium B2B structure with clear proof, process, and action flow for service firms.',
    '{
      "layoutRhythm": "Predictable but elevated section structure optimized for trust and conversion.",
      "typographyVoice": "Professional, composed, and reassuring.",
      "imageStyle": "Team, environment, work-in-context, and clean detail shots.",
      "componentDirection": "Framework-friendly grids, trusted proof strips, and implementation-ready sections.",
      "do": ["Clarify outcomes", "Explain process", "Support claims with evidence"],
      "avoid": ["Lifestyle-only pages", "Ambiguous offers", "Experimental layouts that hurt clarity"]
    }'::jsonb
  )
on conflict (name) do update
set
  description = excluded.description,
  rules_json = excluded.rules_json;
