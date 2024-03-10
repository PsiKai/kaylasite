export const titleDesc = [
  {
    page: "Home-Page",
    title: "Home Page",
    htmlTitle: "Kayla's Art Page",
    htmlDescription: "A selection of Kayla's favorite art works all on one website!",
  },
  {
    page: "Illustration",
    title: "Illustration",
    description:
      "I love to paint with watercolors, but I also do a lot with acrylic.  You can see in this section how my love of animals inspires so much of my art. Some of these paintings are commissioned pet portraits from other animal lovers, and some are professional works I have done for clients, including one of the children's books I illustrated. My favorite work here might be from the Dragon Boat Festival in Nashville where my design was picked for one of the official posters of the event!",
    htmlTitle: "Kayla's Illustrations",
    htmlDescription: "A gallery of Kayla's illustrations.  Check out the portraits and animals!",
  },
  {
    page: "Photography",
    title: "Photography",
    description:
      "Ask anyone who knows me, and they will tell you how much I enjoy doing photoshoots.  Whether it is exploring nature and finding lots of critters or dressing up my friends and family in wild costumes so they can be models.  I have even done more serious work like senior portraits and professional profile pictures.  Of course, you can't forget the countless pictures of my cats and all the kittens I foster.  I just love to find something beautiful and capture it with photography.",
    htmlTitle: "Kayla's Photography",
    htmlDescription: "A gallery of Kayla's photography. Come see the wild costumes!",
  },
]

export const singleArtCopy = art => {
  return {
    page: art.title,
    title: art.title,
    htmlTitle: art.title,
    htmlDescription: `One of Kayla Kossajda's ${art.category} pieces named ${art.title} and its subject is ${art.subCategory}.`,
    thumbnail: art.thumbnail,
  }
}
