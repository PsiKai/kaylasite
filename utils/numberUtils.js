export function roundedBytes(bytes) {
  const magnitudeScale = ["", "k", "M", "G", "T"]
  let magnitude = 0

  while (bytes > 1000) {
    bytes = bytes / 1000
    magnitude += 1
  }

  return bytes.toFixed(2) + " " + magnitudeScale[magnitude] + "B"
}

export function randomIndex(arr) {
  return Math.floor(Math.random() * arr.length)
}
