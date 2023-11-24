import { useEffect, useRef } from "react"

function noEffectAllowed(e) {
  e.preventDefault()
  e.dataTransfer.effectAllowed = "none"
}

export default function useDropzone(handleValidDrop, handleInvalidDrop, accept = ["image/*"]) {
  const validDrag = useRef(false)

  const typeMatch = new RegExp("^" + accept.join("|"))

  useEffect(() => {
    document.addEventListener("dragover", noEffectAllowed)
    document.addEventListener("drop", noEffectAllowed)

    return () => {
      document.removeEventListener("dragover", noEffectAllowed)
      document.removeEventListener("drop", noEffectAllowed)
    }
  }, [])

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragClasses(e, false)
    if (isValidDragData(e)) handleValidDrop(e)
    else handleInvalidDrop(e)
  }

  const handleDragEnter = e => {
    e.preventDefault()
    if (e.currentTarget.contains(e.relatedTarget)) return

    if (isValidDragData(e)) {
      e.dataTransfer.effectAllowed = "copy"
      setDragClasses(e, true)
    } else {
      e.dataTransfer.effectAllowed = "none"
      setDragClasses(e, false)
    }
  }

  const handleDragOver = e => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = validDrag.current ? "copy" : "none"
  }

  const handleDragLeave = e => {
    if (isInsideContainer(e)) return
    setDragClasses(e, false)
  }

  const handleDragEnd = e => setDragClasses(e, false)

  const isValidDragData = e => {
    const { items } = e.dataTransfer
    const files = Array.from(items)
    return files.every(({ type }) => type.match(typeMatch))
  }

  const setDragClasses = (e, value) => {
    validDrag.current = value
    e.currentTarget.classList.toggle("is-dragged-over", value)
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
