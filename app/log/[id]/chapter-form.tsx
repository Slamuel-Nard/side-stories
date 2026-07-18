'use client'

import type { ReactNode } from 'react'
import { useActionState, useRef, useState } from 'react'

import {
  createChapter,
  createChapterPhotoUpload,
} from '@/app/log/actions'
import {
  initialChapterState,
  type ChapterActionState,
} from '@/lib/chapter-submission'
import {
  formatPhotoSize,
  optimizeChapterPhoto,
} from '@/lib/chapter-photo-client'
import type { ChapterFieldName } from '@/lib/chapter-validation'

export type ChapterFormAction = (
  previousState: ChapterActionState,
  formData: FormData,
) => Promise<ChapterActionState>

export type ChapterPhotoUploadAction = (
  artifactId: string,
) => Promise<{
  path: string
  signature: string
  signedUrl: string
}>

const fieldClassName =
  'w-full rounded-xl border border-yellow-700/40 bg-black/50 p-4 text-white placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

function FieldError({
  field,
  state,
}: {
  field: ChapterFieldName | 'photo'
  state: ChapterActionState
}) {
  const errors = state.fieldErrors?.[field]
  if (!errors?.length) return null

  return (
    <p id={`${field}-error`} className="mt-2 text-sm text-red-300">
      {errors[0]}
    </p>
  )
}

export function ChapterForm({
  action = createChapter,
  artifactId,
  buttonLabel = '✦ Seal This Chapter',
  notice = (
    <>
      ✦ This chapter becomes public immediately and remains part of the
      artifact&apos;s record. Future travelers may read your words long after
      tonight.
    </>
  ),
  pendingLabel = 'Sealing Chapter…',
  photoUploadAction = createChapterPhotoUpload,
}: {
  action?: ChapterFormAction
  artifactId: string
  buttonLabel?: string
  notice?: ReactNode
  pendingLabel?: string
  photoUploadAction?: ChapterPhotoUploadAction
}) {
  const [state, formAction, pending] = useActionState(action, initialChapterState)
  const [preparedPhoto, setPreparedPhoto] = useState<File | null>(null)
  const [photoMessage, setPhotoMessage] = useState<string | null>(null)
  const [preparingPhoto, setPreparingPhoto] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoSelection = useRef(0)

  const describedBy = (field: ChapterFieldName) =>
    state.fieldErrors?.[field]?.length ? `${field}-error` : undefined

  const submitAction = async (formData: FormData) => {
    if (!preparedPhoto) {
      formAction(formData)
      return
    }

    setUploadingPhoto(true)
    setPhotoMessage('Uploading prepared photo…')

    try {
      const upload = await photoUploadAction(artifactId)
      const uploadBody = new FormData()
      uploadBody.append('cacheControl', '31536000')
      uploadBody.append('', preparedPhoto)
      const uploadResponse = await fetch(upload.signedUrl, {
        method: 'PUT',
        headers: { 'x-upsert': 'false' },
        body: uploadBody,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Photo storage returned ${uploadResponse.status}.`)
      }

      formData.delete('photo')
      formData.set('photo_path', upload.path)
      formData.set('photo_signature', upload.signature)
      setPhotoMessage('Photo uploaded. Sealing chapter…')
      formAction(formData)
    } catch (error) {
      console.error('Direct chapter photo upload failed', error)
      setPhotoMessage(
        'The photo upload could not connect. Please check your signal and try again.',
      )
    } finally {
      setUploadingPhoto(false)
    }
  }

  const preparePhoto = async (file: File | undefined) => {
    const selection = ++photoSelection.current
    setPreparedPhoto(null)
    setPhotoMessage(null)

    if (!file) return

    setPreparingPhoto(true)

    try {
      const optimized = await optimizeChapterPhoto(file)
      if (selection !== photoSelection.current) return

      setPreparedPhoto(optimized)
      setPhotoMessage(
        optimized.size < file.size
          ? `Ready — automatically reduced from ${formatPhotoSize(file.size)} to ${formatPhotoSize(optimized.size)}.`
          : `Ready — ${formatPhotoSize(optimized.size)}.`,
      )
    } catch {
      if (selection !== photoSelection.current) return
      setPhotoMessage(
        'This photo could not be prepared. Please choose another photo.',
      )
    } finally {
      if (selection === photoSelection.current) setPreparingPhoto(false)
    }
  }

  return (
    <form
      action={submitAction}
      className="space-y-6"
      noValidate
    >
      <input type="hidden" name="artifact_id" value={artifactId} />
      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="event"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Chapter location
        </label>
        <input
          id="event"
          name="event"
          maxLength={120}
          disabled={pending}
          defaultValue={state.values.event}
          aria-invalid={Boolean(state.fieldErrors?.event)}
          aria-describedby={describedBy('event')}
          className={fieldClassName}
          placeholder="Where did this chapter take place?"
        />
        <FieldError field="event" state={state} />
      </div>

      <div>
        <label
          htmlFor="traveler_name"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Traveler name
        </label>
        <input
          id="traveler_name"
          name="traveler_name"
          maxLength={80}
          disabled={pending}
          defaultValue={state.values.traveler_name}
          aria-invalid={Boolean(state.fieldErrors?.traveler_name)}
          aria-describedby={describedBy('traveler_name')}
          className={fieldClassName}
          placeholder="What should future travelers call you?"
        />
        <FieldError field="traveler_name" state={state} />
      </div>

      <div>
        <label
          htmlFor="instagram_handle"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Instagram username <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          id="instagram_handle"
          name="instagram_handle"
          maxLength={31}
          disabled={pending}
          defaultValue={state.values.instagram_handle}
          aria-invalid={Boolean(state.fieldErrors?.instagram_handle)}
          aria-describedby={
            describedBy('instagram_handle') || 'instagram-disclosure'
          }
          className={fieldClassName}
          placeholder="@your_username"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <p id="instagram-disclosure" className="mt-2 text-sm text-zinc-500">
          If supplied, this username will be published with your chapter.
        </p>
        <FieldError field="instagram_handle" state={state} />
      </div>

      <div>
        <label
          htmlFor="story"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Tell the story <span className="text-yellow-400">*</span>
        </label>
        <textarea
          id="story"
          name="story"
          required
          minLength={20}
          maxLength={2_000}
          disabled={pending}
          defaultValue={state.values.story}
          aria-invalid={Boolean(state.fieldErrors?.story)}
          aria-describedby={describedBy('story')}
          className={`${fieldClassName} min-h-48`}
          placeholder="What happened? Who did you meet? How did this artifact find you?"
        />
        <FieldError field="story" state={state} />
      </div>

      <div>
        <label
          htmlFor="photo"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Chapter photo <span className="text-zinc-500">(optional)</span>
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          disabled={pending || preparingPhoto || uploadingPhoto}
          onChange={(event) => {
            void preparePhoto(event.currentTarget.files?.[0])
          }}
          aria-invalid={Boolean(
            state.fieldErrors?.photo ||
              photoMessage?.startsWith('This') ||
              photoMessage?.startsWith('The'),
          )}
          aria-describedby={
            state.fieldErrors?.photo?.length ? 'photo-error' : 'photo-help'
          }
          className={`${fieldClassName} cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-yellow-400`}
        />
        <p id="photo-help" className="mt-2 text-sm text-zinc-500">
          Choose a photo from your phone. It will be automatically prepared and
          published beneath your chapter.
        </p>
        {preparingPhoto ? (
          <p className="mt-2 text-sm text-yellow-400" aria-live="polite">
            Preparing photo…
          </p>
        ) : photoMessage ? (
          <p
            className={`mt-2 text-sm ${photoMessage.startsWith('This') || photoMessage.startsWith('The') ? 'text-red-300' : 'text-green-300'}`}
            aria-live="polite"
          >
            {photoMessage}
          </p>
        ) : null}
        <FieldError field="photo" state={state} />
      </div>

      <div>
        <label
          htmlFor="next_destination"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Hoped next destination
        </label>
        <input
          id="next_destination"
          name="next_destination"
          maxLength={160}
          disabled={pending}
          defaultValue={state.values.next_destination}
          aria-invalid={Boolean(state.fieldErrors?.next_destination)}
          aria-describedby={describedBy('next_destination')}
          className={fieldClassName}
          placeholder="Where do you hope this artifact travels next?"
        />
        <FieldError field="next_destination" state={state} />
      </div>

      <div>
        <label
          htmlFor="message_to_future_holders"
          className="mb-2 block text-sm font-semibold text-zinc-200"
        >
          Message to future holders
        </label>
        <textarea
          id="message_to_future_holders"
          name="message_to_future_holders"
          maxLength={500}
          disabled={pending}
          defaultValue={state.values.message_to_future_holders}
          aria-invalid={Boolean(
            state.fieldErrors?.message_to_future_holders,
          )}
          aria-describedby={describedBy('message_to_future_holders')}
          className={`${fieldClassName} min-h-32`}
          placeholder="Leave a message for whoever finds this next..."
        />
        <FieldError field="message_to_future_holders" state={state} />
      </div>

      <div className="rounded-2xl border border-yellow-700/30 bg-black/40 p-5">
        <p className="leading-relaxed text-zinc-400">{notice}</p>
      </div>

      {state.message ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-200"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={
          pending ||
          preparingPhoto ||
          uploadingPhoto ||
          Boolean(
            photoMessage?.startsWith('This') ||
              photoMessage?.startsWith('The'),
          )
        }
        className="w-full rounded-xl bg-yellow-500 py-5 text-xl font-bold tracking-wide text-black shadow-[0_0_25px_rgba(250,204,21,0.25)] transition hover:bg-yellow-400 disabled:cursor-wait disabled:bg-yellow-700"
      >
        {uploadingPhoto
          ? 'Uploading Photo…'
          : pending
            ? pendingLabel
            : buttonLabel}
      </button>
    </form>
  )
}
