import { useEffect, useRef } from "react"
import useAlerts from "../hooks/useAlerts.js"

export default function useDropzone(handleValidDrop, accept = ["image/*"]) {
  const validDrag = useRef(false)

  const typeMatch = new RegExp("^" + accept.join("|"))

  const { setAlert } = useAlerts()

  useEffect(() => {
    function noEffectAllowed(e) {
      e.dataTransfer.effectAllowed = "none"
    }
    document.addEventListener("dragover", noEffectAllowed)

    return () => {
      document.removeEventListener("dragover", noEffectAllowed)
    }
  }, [])

  const handleDrop = e => {
    e.preventDefault()
    if (!isValidDragData(e)) {
      const badFile = Array.from(e.dataTransfer.items).find(({ type }) => !type.match(typeMatch))
      setAlert({
        message: `File with type "${badFile.type}" is not allowed!`,
        type: "warning",
      })
      resetDragClasses(e)
      return
    }
    handleValidDrop(e)
    resetDragClasses(e)
  }

  const isValidDragData = e => {
    const { items } = e.dataTransfer
    const files = Array.from(items)
    return files.every(({ kind, type }) => kind === "file" && type.match(typeMatch))
  }

  const handleDragEnter = e => {
    if (e.target !== e.currentTarget || e.currentTarget.contains(e.relatedTarget)) return
    if (isValidDragData(e)) {
      validDrag.current = true
      e.currentTarget.classList.add("is-dragged-over")
    }
  }

  const handleDragOver = e => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = validDrag.current ? "copy" : "none"
  }

  const handleDragLeave = e => {
    if (isInsideContainer(e)) return
    resetDragClasses(e)
  }

  const handleDragEnd = e => resetDragClasses(e)

  const resetDragClasses = e => {
    validDrag.current = false
    e.currentTarget.classList.remove("is-dragged-over")
  }

  const isInsideContainer = e => {
    const { top, bottom, left, right } = e.currentTarget.getBoundingClientRect()
    return e.clientX < right && e.clientX > left && e.clientY > top && e.clientY < bottom
  }

  return {
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
  }
}
