const helpers = {
    makeArray(linkedList){
        let curr = linkedList.head
        let arr = []

        while(curr.next !== null){
            arr.push(curr.value)
            curr = curr.next
        }
        arr.push(curr.value)
        return arr
    }
}

module.exports = {helpers};