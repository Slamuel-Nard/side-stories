type ArtifactImageLayout = {
  height: number
  qr: {
    left: number
    top: number
    width: number
  }
  width: number
}

const artifactImages: Record<string, ArtifactImageLayout> = {
  'M-0001': {
    width: 1028,
    height: 650,
    qr: { left: 77.43, top: 63.38, width: 11.67 },
  },
  'A-0001': {
    width: 1028,
    height: 650,
    qr: { left: 79.09, top: 61.38, width: 12.55 },
  },
  'R-0001': {
    width: 1028,
    height: 650,
    qr: { left: 77.82, top: 63.38, width: 11.09 },
  },
  'F-0001': {
    width: 1028,
    height: 650,
    qr: { left: 78.31, top: 61.85, width: 11.87 },
  },
  'H-0001': {
    width: 1028,
    height: 650,
    qr: { left: 76.65, top: 59.85, width: 12.65 },
  },
  'S-0001': {
    width: 1028,
    height: 650,
    qr: { left: 77.24, top: 63.69, width: 10.41 },
  },
  'D-0001': {
    width: 1028,
    height: 650,
    qr: { left: 76.26, top: 64.62, width: 11.77 },
  },
}

const fallback: ArtifactImageLayout = {
  width: 1028,
  height: 650,
  qr: { left: 78.5, top: 63, width: 11.5 },
}

export function getArtifactImageLayout(artifactId: string) {
  return artifactImages[artifactId] ?? fallback
}

export function getArtifactImageUrl(imageUrl: string) {
  return `${imageUrl}?v=20260714-rounded-cards`
}

export function getQrMaskStyle(artifactId: string) {
  const { height, qr, width } = getArtifactImageLayout(artifactId)
  const maskWidth = qr.width * 0.72
  const horizontalInset = (qr.width - maskWidth) / 2
  const verticalInset = horizontalInset * (width / height)

  return {
    left: `${qr.left + horizontalInset}%`,
    top: `${qr.top + verticalInset}%`,
    width: `${maskWidth}%`,
  }
}
