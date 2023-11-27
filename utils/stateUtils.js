import LinkedList from "./LinkedList.js"

export function addNewArt(state, payload) {
  if (!payload) return state

  const { category, subCategory } = payload
  let current = state[category]?.[subCategory] || []

  if (!current.length) current.push(payload)
  else {
    const index = current.findIndex(({ _id }) => _id === payload._id)
    if (index < 0) current.push(payload)
    else current[index] = payload
  }
  const subCategoryList = new LinkedList(current)

  return {
    ...state,
    [category]: {
      ...state[category],
      [subCategory]: subCategoryList.entries,
    },
  }
}

export function removeArt(state, payload) {
  if (!payload) return state

  const { category, subCategory, _id } = payload
  let newSubCategory
  if (state[category]?.[subCategory]?.length <= 1) {
    newSubCategory = {}
    delete state[category]?.[subCategory]
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

export function updateExistingArt(state, payload) {
  if (!payload) return state

  const { category, subCategory } = payload
  let current = state[category]?.[subCategory] || []
  const index = current.findIndex(({ _id }) => _id === payload._id)

  if (index < 0) return state

  current[index] = payload

  return {
    ...state,
    [category]: {
      ...state[category],
      [subCategory]: current,
    },
  }
}
