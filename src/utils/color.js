const hexadecimal = /#?([0-9a-fA-F]{2}){3}/

function decimalToHexadecimal(num, size = 2) {
  const hex = num.toString(16)
  return hex.length < size ? hex.padStart(size, '0') : hex
}

function isHex(color) {
  return typeof color === 'string' ? color.match(hexadecimal) : false
}

export function hexToRgb(hex) {
  if (!isHex(hex)) return { r: 255, g: 255, b: 255 }
  let aux = hex.replace(/#/g, '')
  return {
    r: parseInt(aux.substr(0, 2), 16),
    g: parseInt(aux.substr(2, 2), 16),
    b: parseInt(aux.substr(4, 2), 16),
  }
}

export function rgbToHex(color) {
  return `#${decimalToHexadecimal(color.r)}${decimalToHexadecimal(
    color.g
  )}${decimalToHexadecimal(color.b)}`
}

function getRgb(color) {
  if (isHex(color)) return hexToRgb(color)
  return color
}

export function colorinScale(scale = [], percent = 0, outputHex = false) {
  if (!scale || !scale.length)
    return outputHex ? '#ffffff' : { r: 255, g: 255, b: 255 }

  const rgbInput = scale.map((color) => getRgb(color))
  if (percent === 0) return outputHex ? rgbToHex(rgbInput[0]) : rgbInput[0]
  if (percent === 1)
    return outputHex
      ? rgbToHex(rgbInput[rgbInput.length - 1])
      : rgbInput[rgbInput.length - 1]

  const scaleInPercent = rgbInput.map(
    (color, idx) => idx / (rgbInput.length - 1)
  )

  let scaleRefIdx = 0
  for (let i = 0; i < scale.length - 1; i++) {
    if (scaleInPercent[i] <= percent && scaleInPercent[i + 1] > percent) {
      scaleRefIdx = i
      break
    }
  }

  const startColor = scale[scaleRefIdx],
    endColor = scale[scaleRefIdx + 1],
    inBetweenPercent =
      (percent - scaleInPercent[scaleRefIdx]) /
      (scaleInPercent[scaleRefIdx + 1] - scaleInPercent[scaleRefIdx])

  const color = {
    r: Math.floor(
      startColor.r + (endColor.r - startColor.r) * inBetweenPercent
    ),
    g: Math.floor(
      startColor.g + (endColor.g - startColor.g) * inBetweenPercent
    ),
    b: Math.floor(
      startColor.b + (endColor.b - startColor.b) * inBetweenPercent
    ),
  }

  if (outputHex) return rgbToHex(color)
  return color
}

export function gradientPalette(colors, steps, outputHex = false) {
  if (colors.length < 2)
    throw 'Invalid Gradient: Not enough colors to fill steps'

  const rgbInput = colors.map((color) => getRgb(color))
  return new Array(steps)
    .fill(0)
    .map((x, idx) => colorinScale(rgbInput, idx / (steps - 1), outputHex))
}

export default {
  inScale: colorinScale,
  hexToRgb,
  rgbToHex,
  gradientPalette,
}
