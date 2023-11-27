export default class LinkedList {
  constructor(array) {
    this.rawList = array
    // this.head = this.buildList()
    this.entries = this.orderList()
  }

  orderList() {
    let node = this.findHead()
    const newList = [node]
    while (node.nextArtwork) {
      node = this.rawList.find(({ _id }) => _id.toString() === node.nextArtwork.toString())
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
