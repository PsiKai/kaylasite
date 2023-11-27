import { createContext, useReducer } from "react"
import { addNewArt, removeArt, updateExistingArt } from "../../utils/stateUtils.js"

export const ArtworkContext = createContext()

export function ArtworkProvider(props) {
  const { artWorks: artWorkProp } = props

  const [artWorks, dispatch] = useReducer(ArtworkReducer, { ...artWorkProp })

  return <ArtworkContext.Provider value={{ artWorks, dispatch }} {...props} />
}

function ArtworkReducer(state, action) {
  switch (action.type) {
    case "ADD_ARTWORK": {
      return addNewArt(state, action.payload)
    }
    case "DELETE_ARTWORK": {
      return removeArt(state, action.payload)
    }
    case "MOVE_ARTWORK": {
      const { newImg, oldImg } = action.payload
      return addNewArt(removeArt(state, oldImg), newImg)
    }
    case "UPDATE_ARTWORK": {
      return updateExistingArt(state, action.payload)
    }
    default:
      return state
  }
}
