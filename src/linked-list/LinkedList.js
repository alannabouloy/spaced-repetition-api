const {_Node} = require('./_Node')

class LinkedList {
    constructor(){
        //first node in the list set to null
        this.head = null
    }

    insertFirst(node){
        this.head = new _Node(node, this.head)
    }

    insertLast(node){
        if(this.head === null){
            //list is empty so insert first item
            this.insertFirst(node)
        } else {
            //store first node in list
            let tempNode = this.head

            //loop until reach one before end
            while(tempNode.next !== null) {
                //set old end as one before
                tempNode = tempNode.next;
            }

            //set new next node as the new ending
            tempNode.next = new _Node(node, null);
        }
    }

    sendBackM(mValue){
        let count = 0;
        let curr = this.head
        //loop through list for m counts or until next node === null
        while(count < mValue && curr.next !== null){
            curr = curr.next
            count += 1
        }

        const answer = new _Node(this.head.value)
        //if curr node.next !== null then
        if(curr.next !== null){
            //create new node and set val to head of list and store in temp var. set next to curr.next
            answer.next = curr.next
            //take curr node and set curr.next to new node
            curr.next = answer
            //set head to head.next
            this.head = this.head.next
            //update words info
            curr.value.next = answer.value.id
            answer.value.next = answer.next.value.id
        }
        //if curr node.next === null 
         else {
            //then create new node and set val to head of list and set next to null
            answer.next = curr.next
            //set curr node.next to new node
            curr.next = answer
            //set head to head.next
            this.head = this.head.next
            //update words info
            curr.value.next = answer.value.id
            answer.value.next = null
        }     
        //return the new node
        return answer
    }
}

module.exports = {LinkedList}