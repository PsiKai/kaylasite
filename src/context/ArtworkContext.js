import { createContext } from "react"

export const ArtworkContext = createContext()

export function ArtworkProvider(props) {
	const { artWorks } = props
	
	return <ArtworkContext.Provider value={{ artWorks }} {...props} />
}
