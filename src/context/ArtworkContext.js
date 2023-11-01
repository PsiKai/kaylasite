import { createContext, useReducer } from "react"

export const ArtworkContext = createContext()

export function ArtworkProvider(props) {
  const { artWorks: artWorkProp } = props

  const [artWorks, dispatch] = useReducer(ArtworkReducer, { ...artWorkProp })

  return <ArtworkContext.Provider value={{ artWorks, dispatch }} {...props} />
}

function ArtworkReducer(state, action) {
  switch (action.type) {
    case "ADD_ARTWORK": {
      const { category, subCategory } = action.payload
      return {
        ...state,
        [category]: {
          ...state[category],
          [subCategory]: [...(state[category][subCategory] || []), action.payload],
        },
      }
    }
    case "DELETE_ARTWORK": {
      const { category, subCategory, _id } = action.payload
      console.log(state)
      console.log(state[category][subCategory])
      console.log(action.payload)
      let newSubCategory
      if (state[category][subCategory]?.length <= 1) {
        newSubCategory = {}
        delete state[category][subCategory]
      } else {
        newSubCategory = {
          [subCategory]: state[category][subCategory].filter(art => art._id === _id),
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
    default:
      return state
  }
}
