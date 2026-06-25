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
    width: 630,
    height: 386,
    qr: { left: 79.36, top: 61.92, width: 11.59 },
  },
  'A-0001': {
    width: 1608,
    height: 975,
    qr: { left: 78.04, top: 62.05, width: 11.87 },
  },
  'R-0001': {
    width: 661,
    height: 380,
    qr: { left: 78.22, top: 66.58, width: 11.96 },
  },
  'F-0001': {
    width: 630,
    height: 386,
    qr: { left: 78.41, top: 62.17, width: 11.59 },
  },
  'H-0001': {
    width: 633,
    height: 386,
    qr: { left: 77.73, top: 62.17, width: 12.32 },
  },
  'S-0001': {
    width: 649,
    height: 383,
    qr: { left: 78.58, top: 63.71, width: 10.94 },
  },
  'D-0001': {
    width: 1605,
    height: 977,
    qr: { left: 79.57, top: 66.63, width: 11.52 },
  },
}

const fallback: ArtifactImageLayout = {
  width: 1050,
  height: 600,
  qr: { left: 78.5, top: 63, width: 11.5 },
}

export function getArtifactImageLayout(artifactId: string) {
  return artifactImages[artifactId] ?? fallback
}

export function getArtifactImageUrl(imageUrl: string) {
  return `${imageUrl}?v=20260625-edge-fix`
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
