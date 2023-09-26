import Artwork from "./db/models/artwork.js"

let artWorks = []

export async function getArt() {
	if (!artWorks.length) {
		const newArt = await Artwork.find({}).lean()
		updateArt(newArt)
		console.log("FETCHING FRESH ARTWORK")
	}
	return artWorks
}

export function updateArt(newArt) {
	artWorks = newArt
}
