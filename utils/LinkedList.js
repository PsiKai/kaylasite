export default class LinkedList {
  constructor(array) {
    this.rawList = array
    // this.head = this.buildList()
    this.entries = this.orderList()
  }

  orderList() {
    let node = this.findHead()
    const newList = [node]
    while (node?.nextArtwork) {
      node = this.rawList.find(
        listNode => listNode?._id?.toString() === node.nextArtwork.toString(),
      )
      newList.push(node)
    }
    return newList
  }

  // buildList() {
  //   const head = this.findHead()
  //   let node = head
  //   while (node.nextArtwork) {
  //     const next = this.rawList.find(({ _id }) => _id.toString() === node.nextArtwork.toString())
  //     node.nextArtwork = next
  //     node = node.nextArtwork
  //   }
  //   return head
  // }

  moveListItem(movedNodeId, neighborNodeId) {
    const movedNode = this.rawList.findIndex(art => art._id.toString() === movedNodeId)
    if (this.rawList[movedNode].nextArtwork?.toString() === neighborNodeId) return

    const newNeighbor = this.rawList.findIndex(
      art => art.nextArtwork?.toString() === neighborNodeId,
    )
    const movedNeighbor = this.rawList.findIndex(art => art.nextArtwork?.toString() === movedNodeId)
    if (movedNeighbor > -1)
      this.rawList[movedNeighbor].nextArtwork = this.rawList[movedNode].nextArtwork
    if (newNeighbor > -1) this.rawList[newNeighbor].nextArtwork = movedNodeId
    this.rawList[movedNode].nextArtwork = neighborNodeId
    this.entries = this.orderList()
  }

  findHead() {
    const nextIds = new Set()

    for (const entry of this.rawList) {
      nextIds.add(entry.nextArtwork?.toString())
    }
    for (const entry of this.rawList) {
      if (!nextIds.has(entry._id.toString())) {
        return entry
      }
    }
    return null
  }
}
