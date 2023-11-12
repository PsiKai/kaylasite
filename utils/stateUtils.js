export function addNewArt(state, payload) {
  const { category, subCategory } = payload
  return {
    ...state,
    [category]: {
      ...state[category],
      [subCategory]: [...(state[category][subCategory] || []), payload],
    },
  }
}

export function removeArt(state, payload) {
  const { category, subCategory, _id } = payload
  let newSubCategory
  if (state[category][subCategory]?.length <= 1) {
    newSubCategory = {}
    delete state[category][subCategory]
  } else {
    newSubCategory = {
      [subCategory]: state[category][subCategory].filter(art => art._id !== _id),
    }
  }
  return {
    ...state,
    [category]: {
      ...state[category],
      ...newSubCategory,
    },
  }
}
