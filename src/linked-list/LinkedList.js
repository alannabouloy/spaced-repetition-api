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
}

module.exports = {LinkedList}