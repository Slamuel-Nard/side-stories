import { describe, expect, it } from 'vitest'

import {
  countUniqueLocations,
  LOCATION_SIMILARITY_THRESHOLD,
  locationSimilarity,
  normalizeLocation,
} from '@/lib/location'

describe('location counting', () => {
  it('treats years, capitalization, punctuation, and spacing as formatting', () => {
    expect(
      countUniqueLocations([
        'Lost Lands',
        'lost lands 2026',
        '  LOST-LANDS!  ',
      ]),
    ).toBe(1)
  })

  it('ignores common numeric and written date variations', () => {
    expect(
      countUniqueLocations([
        'Lost Lands 7/1/2026',
        'Lost Lands 7.1.2026',
        'Lost Lands 7-1-2026',
        'Lost Lands July 1, 2026',
        'Lost Lands 1st July 2026',
        'Lost Lands 2026-07-01',
      ]),
    ).toBe(1)
  })

  it('groups spelling errors that meet the similarity threshold', () => {
    expect(locationSimilarity('Lost Lands', 'Lost Lnads')).toBeGreaterThanOrEqual(
      LOCATION_SIMILARITY_THRESHOLD,
    )
    expect(
      countUniqueLocations([
        'Lost Lands',
        'Lost Lnads 7.1.2026',
        'Lost Landz',
      ]),
    ).toBe(1)
  })

  it('keeps genuinely different locations separate', () => {
    expect(
      countUniqueLocations(['Lost Lands', 'Philadelphia', null, '']),
    ).toBe(2)
  })

  it('normalizes accents and equivalent ampersand wording', () => {
    expect(normalizeLocation('Montréal & Québec 2025')).toBe(
      'montreal and quebec',
    )
  })
})
