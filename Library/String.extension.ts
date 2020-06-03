interface String {
  /**
   * Pad a string on both sides by a specified character.
   *
   * @param maxLength The final length of the string.
   * @param fillString Optional, the character to pad with.
   */
  center(maxLength: number, fillString?: string): string

  /**
   * Remove non-ascii characters from a string.
   *
   * @param fillString Optional, the character used to replace the non-ascii character.
   */
  toASCIIString(fillString?: string): string
}

String.prototype.center = function (
  maxLength: number,
  fillString?: string
): string {
  fillString = fillString || ' '
  return this.length >= maxLength
    ? this.toString()
    : this.padStart((this.length + maxLength) / 2, fillString).padEnd(
        maxLength,
        fillString
      )
}

String.prototype.toASCIIString = function (fillString?: string): string {
  fillString = fillString || ''
  return this.replace(/[^\x00-\x7F]/g, '')
}
