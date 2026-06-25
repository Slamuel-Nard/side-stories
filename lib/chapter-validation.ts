import { z } from 'zod'

export const chapterFieldNames = [
  'event',
  'traveler_name',
  'instagram_handle',
  'story',
  'next_destination',
  'message_to_future_holders',
] as const

export type ChapterFieldName = (typeof chapterFieldNames)[number]
export type ChapterFormValues = Record<ChapterFieldName, string>

export const emptyChapterValues: ChapterFormValues = {
  event: '',
  traveler_name: '',
  instagram_handle: '',
  story: '',
  next_destination: '',
  message_to_future_holders: '',
}

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .transform((value) => value || null)

export function normalizeInstagram(value: string) {
  const normalized = value.replace(/^@/, '')
  return normalized || null
}

const chapterSchema = z.object({
  artifact_id: z.string().trim().min(1).max(64),
  event: optionalText('Location', 120),
  traveler_name: optionalText('Traveler name', 80),
  instagram_handle: z
    .string()
    .trim()
    .max(31, 'Instagram username must be 30 characters or fewer.')
    .transform(normalizeInstagram)
    .refine(
      (value) => value === null || value.length <= 30,
      'Instagram username must be 30 characters or fewer.',
    )
    .refine(
      (value) => value === null || /^[A-Za-z0-9._]+$/.test(value),
      'Use only letters, numbers, periods, and underscores.',
    ),
  story: z
    .string()
    .trim()
    .min(20, 'Your story must be at least 20 characters.')
    .max(2_000, 'Your story must be 2,000 characters or fewer.'),
  next_destination: optionalText('Next destination', 160),
  message_to_future_holders: optionalText(
    'Message to future holders',
    500,
  ),
  website: z.literal('', {
    error: 'Unable to accept this submission.',
  }),
})

export type ValidatedChapter = z.output<typeof chapterSchema>

export function valuesFromFormData(formData: FormData): ChapterFormValues {
  return Object.fromEntries(
    chapterFieldNames.map((field) => [field, String(formData.get(field) ?? '')]),
  ) as ChapterFormValues
}

export function validateChapter(formData: FormData) {
  return chapterSchema.safeParse({
    artifact_id: String(formData.get('artifact_id') ?? ''),
    ...valuesFromFormData(formData),
    website: String(formData.get('website') ?? ''),
  })
}
