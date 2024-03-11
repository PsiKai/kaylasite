export const titleDesc = [
  {
    page: "Home-Page",
    title: "Home Page",
    htmlTitle: "Kayla's Art Page",
    htmlDescription: "A selection of Kayla's favorite art works all on one website!",
    description: "Hi, I'm Kayla, a Photographer and artist based in Denver, Colorado.",
  },
  {
    page: "Illustration",
    htmlTitle: "Kayla's Illustrations",
    htmlDescription: "A collection of Kayla's illustrations.",
  },
  {
    page: "Photography",
    htmlTitle: "Kayla's Photography",
    htmlDescription: "A collection of Kayla's photography.",
  },
]

export const singleArtCopy = art => {
  return {
    page: art.title,
    title: art.title,
    htmlTitle: art.title,
    htmlDescription: `One of Kayla Kossajda's ${art.category} pieces.`,
    thumbnail: art.thumbnail,
  }
}
