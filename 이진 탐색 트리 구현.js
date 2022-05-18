//Node() : value와 left, right node 저장을 위한 생성자
function Node(value){
    this.value = value;
    this.left = null;
    this.right = null;
};

//BinarySearchTree(): 시작 노드인 root를 저장하기 위한 생성자
function BinarySearchTree(){
    this.root = null;
};

//_insertNode(): 재귀로 트리를 순회하며 노드를 추가 (내부 사용이므로 _로 표시)
BinarySearchTree.prototype._insertNode = function(node, value){
    if(node === null){
        //node 매개변수는 내부 재귀함수에서 node.left로 더 깊은 Depth의 node를 탐색
        //이후 메서드 호출 시 node 매개변수 최초값 === this.root
        node = new Node(value);
    }else if (value < node.value){
        //매개변수 node의 value가 현재 node의 value보다 작다면,
        node.left = this._insertNode(node.left, value);
        //node.left === null 일 때 까지, 즉 Leaf node까지 탐색하고,
        //Leaf node를 만나면 value값을 넣은 node를 생성하고 
        //if 절 이후 return문으로 그 노드를 return한다.
        //내부 재귀에서 return 한 반환값을 Parents node.left에 넣고,
        //최종 Depth에서 insert를 완료한 이후 return 되는 node값은
        //기존에 있던 node들이다.
    }else if(value >= node.value){
        //매개변수 node의 value가 현재 node의 value보다 크거나 같다면,
        node.right = this._insertNode(node.right, value);
        //left 지정과 마찬가지
    }
    return node;
};

BinarySearchTree.prototype.insert = function(value){
    this.root = this._insertNode(this.root, value);
};

//_inOrderTraverseNode() : 중위 순회 (내부)
//전위와 중위 순회는 callback함수를 어디에서 실행시키는가에 따라 달라진다. 
//L-N-R
BinarySearchTree.prototype._inOrderTraverseNode = function(node, callback){
    //매개변수 node는 이후 재귀함수로 node.left, node.right로 계속 변경
    if(node === null){
        return;
    }

    this._inOrderTraverseNode(node.left, callback);//L
    callback(node);//N
    this._inOrderTraverseNode(node.right, callback);//R
};

//inOrdertraverse : 중위순회(Public)
BinarySearchTree.prototype.inOrderTraverse = function(callback){
    this._inOrderTraverseNode(this.root, callback);
};

//printNode : node.value들을 출력
function printNode(node){
    process.stdout.write(`${node.value} -> `)
};

//_minNode(): 반복문으로 트리를 순회하며 최솟값 노드 탐색
BinarySearchTree.prototype._minNode = function(node){
    if(node === null){
        return null;
    }

    while(node && node.left !== null){
        node = node.left;
    }

    return node.value;
};

//_maxNode(): 반복문으로 트리를 순회하며 최댓값 노드 탐색
BinarySearchTree.prototype._maxNode = function(node){
    if(node === null){
        return null;
    }

    while(node && node.right !== null){
        node = node.right;
    }

    return node.value;
};

//min(): 최소값 노드 탐색(Public)
BinarySearchTree.prototype.min = function(){
    return this._minNode(this.root);
};

//max(): 최대값 노드 탐색(Public)
BinarySearchTree.prototype.max = function(){
    return this._maxNode(this.root);
}; 

//_searchNode() : 재귀로 트리를 순회하며 값을 만족하는 노드가 있는 지 true/false로 반환
BinarySearchTree.prototype._searchNode = function(node, value){
    if(node === null){
        return false;
    }

    if(node.value === value){
        return true;
    }else if(node.value > value) {
        return this._searchNode(node.left, value);
    }else if(node.value < value) {
        return this._searchNode(node.right, value);
    }
};

BinarySearchTree.prototype.search = function(value){
    return this._searchNode(this.root, value);
};

//_findMinNode(): 반복문으로 트리를 순회하며 최소값을 보유한 노드틀 탐색하고 반환
BinarySearchTree.prototype._findMinNode = function(node){
    while(node && node.left !== null){
        node = node.left;
    }

    return node;
};



//_removeNode(): 재귀로 트리를 순회하며 값을 만족하는 노드를 찾고 삭제
//경우의 수) 1: 삭제하는 노드가 Leaf Node이다.
//경우의 수) 2: 삭제하는 노드가 1개의 Child node를 가진다
//경우의 수) 3: 삭제하는 노드가 2개의 Child node를 가진다
//process 1: 내가 삭제할 노드를 찾아서 그 노드를 방문
//process 2: Leaf node라면 그냥 삭제, 
//child node가 1개 있다면 삭제된 노드 자리에 1개의 child node를 할당한다.
//child node가 2개 있다면, 
//"node.right 서브트리중 가장 작은 leaf node" 를 "삭제한 노드" 위치에 할당하고 "해당 leaf node"는 삭제한다
//"node.right" 를 root로 해서 _removeNode 함수를 재귀로 실행시킨다.
//그러면 할당된 노드는 Leaf node이므로 삭제된다.
//node.left or right 를 삭제된 노드로 할당하면, 재귀를 빠져나오면서 node.left or right 가 업데이트 되고,
//업데이트 된 노드가 다시 Parents node의 left or right 속성 값으로 업데이트 된다.
//그러므로 Public 실행 시 최초 매개변수는 this.root여야 하며, this.root자체를 업데이트 시켜줘야 한다.
BinarySearchTree.prototype._removeNode = function(node, value){
    if(node === null){
        return null;
    }

    if(node.value === value){
        //case 1: leaf node
        if(node.left === null && node.right === null){
            node = null;
        }

        //case 2: 1 child node
        else if(node.left === null){
            node = node.right;
        }else if(node.right === null){
            node = node.left;
        }

        //case 3: 2 childe node
        else{
            let aux = this._findMinNode(node.right);
            node.value = aux.value;
            node.right = this._removeNode(node.right, aux.value);
        }
    }else if(node.value > value){
        node.left = this._removeNode(node.left, value);
    }else if(node.value < value){
        node.right = this._removeNode(node.right, value);
    }

    return node;
}

//remove(): 노드 삭제
BinarySearchTree.prototype.remove = function(value){
    this.root = this._removeNode(this.root, value);
}


let tree = new BinarySearchTree();

tree.insert("F");
tree.insert("B");
tree.insert("A");
tree.insert("D");
tree.insert("C");
tree.insert("E");
tree.insert("G");
tree.insert("I");
tree.insert("H");



console.log("***** in-Order *****")
tree.inOrderTraverse(printNode);
console.log("end");


tree.remove("H");
tree.inOrderTraverse(printNode);
console.log("end");

tree.remove("D");
tree.inOrderTraverse(printNode);
console.log("end");

tree.remove("F");
tree.inOrderTraverse(printNode);
console.log("end");

console.log(tree.root);