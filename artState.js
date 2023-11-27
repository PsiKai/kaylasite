import Artwork from "./db/models/artwork.js"
import LinkedList from "./utils/LinkedList.js"

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
            nextArtwork: "$nextArtwork",
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
            subCatSize: { $size: "$artworks" },
          },
        },
      },
    },
    {
      $unwind: "$subcategories",
    },
    {
      $sort: { "subcategories.subCatSize": -1 },
    },
    {
      $group: {
        _id: "$_id",
        category: { $first: "$_id" },
        subcategories: { $push: "$subcategories" },
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
      const sortedArt = new LinkedList(artworks)
      group[category][subCategory] = sortedArt.entries
    })
    return group
  }, {})

  updateArt(groupedArt)
  return groupedArt
}

export function updateArt(newArt) {
  artWorks = newArt
}
