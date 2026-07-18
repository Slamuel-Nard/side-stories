import { describe, expect, it } from 'vitest'

import {
  formatPhotoSize,
  getResizedDimensions,
} from '@/lib/chapter-photo-client'

describe('chapter photo client helpers', () => {
  it('keeps photos already within the maximum dimensions', () => {
    expect(getResizedDimensions(1200, 800)).toEqual({
      width: 1200,
      height: 800,
    })
  })

  it('resizes landscape and portrait photos proportionally', () => {
    expect(getResizedDimensions(4032, 3024)).toEqual({
      width: 1920,
      height: 1440,
    })
    expect(getResizedDimensions(3024, 4032)).toEqual({
      width: 1440,
      height: 1920,
    })
  })

  it('formats photo sizes for festival-friendly status text', () => {
    expect(formatPhotoSize(512 * 1024)).toBe('512 KB')
    expect(formatPhotoSize(2.25 * 1024 * 1024)).toBe('2.3 MB')
  })
})
