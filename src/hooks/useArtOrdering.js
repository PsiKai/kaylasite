import { useEffect, useRef } from "react"

export default function useArtOrdering(container, onValidDrop) {
  const dragGrid = useRef()
  const dropNeighbor = useRef()
  const dragEnabled = useRef(false)

  useEffect(() => {
    children().forEach(dragItem => {
      dragItem.addEventListener("dragstart", handleDragStart)
      dragItem.addEventListener("dragend", handleDragEnd)
    })

    return () => {
      children().forEach(dragItem => {
        dragItem.removeEventListener("dragstart", handleDragStart)
        dragItem.removeEventListener("dragstart", handleDragEnd)
      })
    }
  }, [handleDragStart])

  function children() {
    return Array.from(container.current?.children || [])
  }

  function showDropLocation(dropId, dropSide) {
    const toggleOff = dropSide === "left" ? "right" : "left"
    children().forEach(child => {
      child.classList.toggle(`dragged-${dropSide}-of`, child.dataset.dragid === dropId)
      child.classList.toggle(`dragged-${toggleOff}-of`, false)
    })
  }

  function getCurrentRow(e) {
    const { top } = container.current.getBoundingClientRect()
    const { clientY } = e
    const { scrollTop, scrollHeight } = container.current
    const rowHeight = scrollHeight / dragGrid.current.length
    const mouseY = clientY - top

    let row = 0
    let currentHeight = rowHeight
    while (mouseY + scrollTop > currentHeight) {
      row++
      currentHeight += rowHeight
    }
    return row
  }

  function getCurrentColumn(e, row) {
    const { left } = container.current.getBoundingClientRect()
    const { clientX } = e
    let column = 0
    while (column < dragGrid.current[row]?.length) {
      const currItem = dragGrid.current[row][column]
      const midPoint = currItem.left + currItem.width / 2
      if (clientX > midPoint) column++
      else break
    }
    return column
  }

  function createDragItem(item) {
    const { left, top, width, height } = item.getBoundingClientRect()
    return { top, left, height, width, id: item.dataset.dragid }
  }

  function nearestNeighbor(row) {
    if (row === dragGrid.current.length - 1) {
      return { id: undefined }
    } else {
      return dragGrid.current[row + 1][0]
    }
  }

  function handleDragStart(e) {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text", e.currentTarget.dataset.dragid)
    dragEnabled.current = true

    const rows = new Set()
    const dragItemGrid = []
    const dragItems = children()

    dragItems.forEach(dragItem => {
      const { top } = dragItem.getBoundingClientRect()
      rows.add(top)
    })

    let itemIndex = 0
    let rowIndex = 0

    for (const row of rows) {
      while (dragItems[itemIndex]?.getBoundingClientRect()?.top === row) {
        const newDragItem = createDragItem(dragItems[itemIndex])
        dragItemGrid[rowIndex] ||= []
        dragItemGrid[rowIndex].push(newDragItem)
        itemIndex++
      }

      rowIndex++
    }
    dragGrid.current = dragItemGrid
  }

  function handleDragEnd(e) {
    container.current.style.outline = "none"
    dragEnabled.current = false
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.effectAllowed !== "move" || !dragEnabled.current) {
      e.dataTransfer.effectAllowed = "none"
      return
    }

    e.dataTransfer.dropEffect = "move"
    e.currentTarget.style.outline = "auto"

    const row = getCurrentRow(e)
    const column = getCurrentColumn(e, row)
    const neighbor = dragGrid.current[row][column]
    const dropId = neighbor?.id || dragGrid.current[row].at(-1)?.id
    const dropSide = neighbor ? "left" : "right"

    showDropLocation(dropId, dropSide)

    dropNeighbor.current = neighbor || nearestNeighbor(row)
  }

  function handleDragLeave(e) {
    e.currentTarget.style.outline = "unset"
    showDropLocation(null, "left")
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!dragEnabled.current) return

    const draggedItemid = e.dataTransfer.getData("text")
    console.log({ draggedItemid })
    console.log({ neighborId: dropNeighbor.current.id })
    showDropLocation(null, "left")
  }

  return {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  }
}
