const HIGH_SURROGATE_START = 0xD800
const HIGH_SURROGATE_END = 0xDBFF

const LOW_SURROGATE_START = 0xDC00

const REGIONAL_INDICATOR_START = 0x1F1E6
const REGIONAL_INDICATOR_END = 0x1F1FF

const FITZPATRICK_MODIFIER_START = 0x1F3FB
const FITZPATRICK_MODIFIER_END = 0x1F3FF

const VARIATION_MODIFIER_START = 0xFE00
const VARIATION_MODIFIER_END = 0xFE0F

const DIACRITICAL_MARKS_START = 0x20D0
const DIACRITICAL_MARKS_END = 0x20FF

const ZWJ = 0x200D

const GRAPHEMS = [
  0x0308, // ( ◌̈ ) COMBINING DIAERESIS
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x0BA8, // ( ந ) TAMIL LETTER NA
  0x0BBF, // ( ி ) TAMIL VOWEL SIGN I
  0x0BCD, // ( ◌்) TAMIL SIGN VIRAMA
  0x0E31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
  0x0E33, // ( ำ ) THAI CHARACTER SARA AM
  0x0E40, // ( เ ) THAI CHARACTER SARA E
  0x0E49, // ( เ ) THAI CHARACTER MAI THO
  0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
  0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
  0x11A8, // ( ᆨ ) HANGUL JONGSEONG KIYEOK
]

export default function runes(string: string): string[] {
  if (typeof string !== 'string') {
    throw new TypeError('string cannot be undefined or null')
  }
  const result: string[] = []
  let i = 0
  let increment = 0
  while (i < string.length) {
    increment += nextUnits(i + increment, string)
    if (isGraphem(string[i + increment])) {
      increment++
    }
    if (isVariationSelector(string[i + increment])) {
      increment++
    }
    if (isDiacriticalMark(string[i + increment])) {
      increment++
    }
    if (isZeroWidthJoiner(string[i + increment])) {
      increment++
      continue
    }
    result.push(string.substring(i, i + increment))
    i += increment
    increment = 0
  }
  return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
// Variations: 2 code units
function nextUnits(i: number, string: string): number {
  const current = string[i]
  // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i
  if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
    return 1
  }

  const nextPair = string.substring(i + 2, i + 5)

  // Country flags are comprised of two regional indicator symbols,
  // each represented by a surrogate pair.
  // See http://emojipedia.org/flags/
  // If both pairs are regional indicator symbols, take 4
  if (current && isRegionalIndicator(current) && isRegionalIndicator(nextPair)) {
    return 4
  }

  // If the next pair make a Fitzpatrick skin tone
  // modifier, take 4
  // See http://emojipedia.org/modifiers/
  // Technically, only some code points are meant to be
  // combined with the skin tone modifiers. This function
  // does not check the current pair to see if it is
  // one of them.
  if (isFitzpatrickModifier(nextPair)) {
    return 4
  }
  return 2
}

function isFirstOfSurrogatePair(string: string | undefined): boolean {
  return !!string && !!string[0] && betweenInclusive(string[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END)
}

function isRegionalIndicator(string: string): boolean {
  return betweenInclusive(codePointFromSurrogatePair(string), REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END)
}

function isFitzpatrickModifier(string: string): boolean {
  return betweenInclusive(codePointFromSurrogatePair(string), FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END)
}

function isVariationSelector(string: string | undefined): boolean {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), VARIATION_MODIFIER_START, VARIATION_MODIFIER_END)
}

function isDiacriticalMark(string: string | undefined): boolean {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), DIACRITICAL_MARKS_START, DIACRITICAL_MARKS_END)
}

function isGraphem(string: string | undefined): boolean {
  return typeof string === 'string' && GRAPHEMS.includes(string.charCodeAt(0))
}

function isZeroWidthJoiner(string: string | undefined): boolean {
  return typeof string === 'string' && string.charCodeAt(0) === ZWJ
}

function codePointFromSurrogatePair(pair: string): number {
  const highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START
  const lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START
  return (highOffset << 10) + lowOffset + 0x10000
}

function betweenInclusive(value: number, lower: number, upper: number): boolean {
  return value >= lower && value <= upper
}

export function substring(string: string, start?: number, width?: number): string {
  const chars = runes(string)
  if (start === undefined) {
    return string
  }
  if (start >= chars.length) {
    return ''
  }
  const rest = chars.length - start
  const stringWidth = width === undefined ? rest : width
  let endIndex: number | undefined = start + stringWidth
  if (endIndex > (start + rest)) {
    endIndex = undefined
  }
  return chars.slice(start, endIndex).join('')
}

export const substr = substring
