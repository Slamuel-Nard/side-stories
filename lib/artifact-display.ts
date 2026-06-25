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
    width: 632,
    height: 388,
    qr: { left: 79.27, top: 61.86, width: 11.55 },
  },
  'A-0001': {
    width: 1610,
    height: 977,
    qr: { left: 78.01, top: 62.03, width: 11.86 },
  },
  'R-0001': {
    width: 663,
    height: 382,
    qr: { left: 78.13, top: 66.49, width: 11.92 },
  },
  'F-0001': {
    width: 632,
    height: 388,
    qr: { left: 78.32, top: 62.11, width: 11.55 },
  },
  'H-0001': {
    width: 635,
    height: 388,
    qr: { left: 77.64, top: 62.11, width: 12.28 },
  },
  'S-0001': {
    width: 651,
    height: 385,
    qr: { left: 78.49, top: 63.64, width: 10.91 },
  },
  'D-0001': {
    width: 1607,
    height: 979,
    qr: { left: 79.53, top: 66.6, width: 11.51 },
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
