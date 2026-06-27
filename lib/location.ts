export const LOCATION_SIMILARITY_THRESHOLD = 0.8

const monthName =
  '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)'

const writtenMonthFirstDate = new RegExp(
  `\\b${monthName}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s*,?\\s*(?:19|20)\\d{2})?\\b`,
  'g',
)
const writtenDayFirstDate = new RegExp(
  `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+${monthName}(?:\\s*,?\\s*(?:19|20)\\d{2})?\\b`,
  'g',
)
const writtenMonthAndYear = new RegExp(
  `\\b${monthName}\\s+(?:19|20)\\d{2}\\b`,
  'g',
)

export function normalizeLocation(location: string) {
  return location
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(?:19|20)\d{2}[./-]\d{1,2}[./-]\d{1,2}\b/g, ' ')
    .replace(/\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/g, ' ')
    .replace(writtenMonthFirstDate, ' ')
    .replace(writtenDayFirstDate, ' ')
    .replace(writtenMonthAndYear, ' ')
    .replace(/\b(?:19|20)\d{2}\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function damerauLevenshteinDistance(left: string, right: string) {
  const distances = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0),
  )

  for (let leftIndex = 0; leftIndex <= left.length; leftIndex += 1) {
    distances[leftIndex][0] = leftIndex
  }
  for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) {
    distances[0][rightIndex] = rightIndex
  }

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1

      distances[leftIndex][rightIndex] = Math.min(
        distances[leftIndex - 1][rightIndex] + 1,
        distances[leftIndex][rightIndex - 1] + 1,
        distances[leftIndex - 1][rightIndex - 1] + substitutionCost,
      )

      if (
        leftIndex > 1 &&
        rightIndex > 1 &&
        left[leftIndex - 1] === right[rightIndex - 2] &&
        left[leftIndex - 2] === right[rightIndex - 1]
      ) {
        distances[leftIndex][rightIndex] = Math.min(
          distances[leftIndex][rightIndex],
          distances[leftIndex - 2][rightIndex - 2] + 1,
        )
      }
    }
  }

  return distances[left.length][right.length]
}

export function locationSimilarity(left: string, right: string) {
  const normalizedLeft = normalizeLocation(left)
  const normalizedRight = normalizeLocation(right)

  if (normalizedLeft === normalizedRight) return 1
  if (!normalizedLeft || !normalizedRight) return 0

  const longestLength = Math.max(normalizedLeft.length, normalizedRight.length)
  return (
    1 -
    damerauLevenshteinDistance(normalizedLeft, normalizedRight) / longestLength
  )
}

export function countUniqueLocations(
  locations: readonly (string | null | undefined)[],
) {
  const normalizedLocations = [
    ...new Set(
      locations
        .map((location) => (location ? normalizeLocation(location) : ''))
        .filter(Boolean),
    ),
  ]
  const parents = normalizedLocations.map((_, index) => index)

  function find(index: number): number {
    if (parents[index] !== index) {
      parents[index] = find(parents[index])
    }
    return parents[index]
  }

  for (let leftIndex = 0; leftIndex < normalizedLocations.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < normalizedLocations.length;
      rightIndex += 1
    ) {
      if (
        locationSimilarity(
          normalizedLocations[leftIndex],
          normalizedLocations[rightIndex],
        ) >= LOCATION_SIMILARITY_THRESHOLD
      ) {
        parents[find(rightIndex)] = find(leftIndex)
      }
    }
  }

  return new Set(parents.map((_, index) => find(index))).size
}
