export const CHAPTER_PHOTO_TARGET_BYTES = 3 * 1024 * 1024
const MAX_PHOTO_DIMENSION = 1920

export function getResizedDimensions(width: number, height: number) {
  const largestDimension = Math.max(width, height)

  if (largestDimension <= MAX_PHOTO_DIMENSION) return { width, height }

  const scale = MAX_PHOTO_DIMENSION / largestDimension
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

function loadPhoto(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('The browser could not read this photo.'))
    }
    image.src = url
  })
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('The browser could not prepare this photo.'))
      },
      'image/jpeg',
      quality,
    )
  })
}

export async function optimizeChapterPhoto(file: File) {
  const image = await loadPhoto(file)
  const dimensions = getResizedDimensions(
    image.naturalWidth,
    image.naturalHeight,
  )
  const canvas = document.createElement('canvas')
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('The browser could not prepare this photo.')

  context.fillStyle = '#000000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  let blob = await canvasBlob(canvas, 0.84)

  for (const quality of [0.72, 0.6, 0.48]) {
    if (blob.size <= CHAPTER_PHOTO_TARGET_BYTES) break
    blob = await canvasBlob(canvas, quality)
  }

  if (blob.size > CHAPTER_PHOTO_TARGET_BYTES) {
    throw new Error('This photo is too large for the browser to prepare.')
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'chapter-photo'
  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

export function formatPhotoSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
