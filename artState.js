import Artwork from "./db/models/artwork.js"

let artWorks = {}

export async function getArt() {
  if (Object.keys(artWorks).length) return artWorks

  return await fetchArt()
}

export async function fetchArt() {
  console.log("FETCHING FRESH ARTWORK")
  const artworkCollection = await Artwork.aggregate([
    {
      $group: {
        _id: {
          category: "$category",
          subCategory: "$subCategory",
        },
        artworks: {
          $push: {
            _id: "$_id",
            title: "$title",
            extension: "$extension",
            thumbnail: "$thumbnail",
            category: "$category",
            subCategory: "$subCategory",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.category",
        subcategories: {
          $push: {
            subCategory: "$_id.subCategory",
            artworks: "$artworks",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        subcategories: 1,
      },
    },
  ])

  const groupedArt = artworkCollection.reduce((group, { category, subcategories }) => {
    group[category] = {}
    subcategories.forEach(({ subCategory, artworks }) => {
      group[category][subCategory] = artworks
    })
    return group
  }, {})

  updateArt(groupedArt)
  return groupedArt
}

export function updateArt(newArt) {
  artWorks = newArt
}
