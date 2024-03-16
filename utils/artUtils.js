import { getArt } from "../artState.js"
import { randomIndex } from "./numberUtils.js"

export async function randomArtSample(totalSize) {
  const { floor, random } = Math
  const artWorks = await getArt()
  const subcategories = Object.values(artWorks)
  const randomSample = []
  const repeatMap = new Map()
  let pointer = 0

  for (let i = 0; i < totalSize; i++) {
    const subCat = subcategories[pointer]
    const subCatArt = Object.values(subCat)
    const randomIndex = floor(random() * subCatArt.length)
    randomSample.push(subCatArt[randomIndex])
    pointer = ++pointer % (subcategories.length - 1)
  }

  for (let i = 0; i < randomSample.length; i++) {
    let currSample = randomSample[i]
    let currIndex = randomIndex(currSample)

    for (let j = 0; j < currSample.length; j++) {
      const { _id } = currSample[currIndex]
      if (!repeatMap.has(_id)) {
        repeatMap.set(_id, currSample[currIndex])
        break
      }
      currIndex = randomIndex(currSample)
    }
  }

  return [...repeatMap.values()]
}
