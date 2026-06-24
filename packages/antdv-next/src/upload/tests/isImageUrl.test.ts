import type { UploadFile } from '../interface'
import { describe, expect, it } from 'vitest'
import { isImageUrl } from '../utils'

function mkFile(overrides: Partial<UploadFile> = {}): UploadFile {
  return ({
    uid: '1',
    name: overrides.name ?? 'demo',
    ...overrides,
  }) as UploadFile
}

describe('upload isImageUrl', () => {
  it('matches legacy image extensions', () => {
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.png' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.jpg' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.jpeg' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.gif' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.webp' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.svg' }))).toBe(true)
  })

  it('matches ant-design 6.4.0 new image extensions: avif/tif/tiff', () => {
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.avif' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.tiff' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.tif' }))).toBe(true)
  })

  it('is case-insensitive on the extension', () => {
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.AVIF' }))).toBe(true)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.TIFF' }))).toBe(true)
  })

  it('honours an image MIME type when no thumbUrl is provided', () => {
    expect(isImageUrl(mkFile({ type: 'image/png' }))).toBe(true)
    expect(isImageUrl(mkFile({ type: 'application/pdf' }))).toBe(false)
  })

  it('matches data:image/ URLs regardless of extension', () => {
    expect(isImageUrl(mkFile({ url: 'data:image/png;base64,abc' }))).toBe(true)
  })

  it('rejects non-image data: URLs', () => {
    expect(isImageUrl(mkFile({ url: 'data:application/octet-stream;base64,abc' }))).toBe(false)
  })

  it('rejects unknown extensions', () => {
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.txt' }))).toBe(false)
    expect(isImageUrl(mkFile({ url: 'https://example.com/a.exe' }))).toBe(false)
  })

  // ant-design #58484: failed uploads have no url, so fall back to file.name
  // for extension detection (non-image name should NOT be treated as image).
  it('falls back to file.name when url is empty', () => {
    expect(isImageUrl(mkFile({ name: 'report.pdf' }))).toBe(false)
    expect(isImageUrl(mkFile({ name: 'photo.png' }))).toBe(true)
  })
})
