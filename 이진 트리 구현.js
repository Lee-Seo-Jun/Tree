//Level-order 순회를 위한 Queue 생성
function Queue(array){
    this.array = array ? array : [];
};

Queue.prototype.isEmpty = function(){
    return this.array.length === 0;
};

Queue.prototype.enqueue = function(element){
    return this.array.push(element);
};

Queue.prototype.dequeue = function(){
   return this.array.shift();
};



//Node() : value와 left, right node 저장을 위한 생성자
function Node(value){
    this.value = value;
    this.left = null;
    this.right = null;
};


//BinaryTree(): 시작 노드인 root를 저장하기 위한 생성자
function BinaryTree(){
    this.root = null;
};

//_insertNode(): 재귀로 트리를 순회하며 노드를 추가 (내부 사용이므로 _로 표시)
BinaryTree.prototype._insertNode = function(node, value){
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

BinaryTree.prototype.insert = function(value){
    this.root = this._insertNode(this.root, value);
};

//preOrderTraverse(fn)) : 전위 순회(내부 사용이므로 _ 으로 표시)
//전위/중위/후위 는 콜백함수를 어디에서 실행시키는 가에 따라 달라진다.
//N-L-R 
BinaryTree.prototype._preOrderTraverseNode = function(node, callback){
    //매개변수 node는 이후 재귀함수로 node.left, node.right로 계속 변경
    if(node === null){
        //매개변수 node가 null 즉, Leaf node라면
        return;
        //재귀함수 종료;
    }

    callback(node);
    //콜백함수를 매개변수 node를 대상으로 먼저 수행.(N 방문)
    this._preOrderTraverseNode(node.left, callback);
    //node.left가 N이 되는 서브트리에서 전위 순회 실행(L)
    //재귀함수에서 Leaf node를 만날 때 까지 재귀함수를 수행하며
    //거쳐간 모든 node를 대상으로 콜백함수 수행.
    this._preOrderTraverseNode(node.right, callback);
    //node.right 서브트리에서 전위 순회 실행(R)
};

//preOrderTraverse() : 전위순회(Public)
BinaryTree.prototype.preOrderTraverse = function(callback){
    this._preOrderTraverseNode(this.root, callback);
};

//각 노드를 전위 순회 하며 방문한 노드들을 차례대로 print하기 위한 callback함수
function printNode(node){
    process.stdout.write(`${node.value} -> `)
};

//_inOrderTraverseNode() : 중위 순회 (내부)
//전위와 중위 순회는 callback함수를 어디에서 실행시키는가에 따라 달라진다. 
//L-N-R
BinaryTree.prototype._inOrderTraverseNode = function(node, callback){
    //매개변수 node는 이후 재귀함수로 node.left, node.right로 계속 변경
    if(node === null){
        return;
    }

    this._inOrderTraverseNode(node.left, callback);//L
    callback(node);//N
    this._inOrderTraverseNode(node.right, callback);//R
};

//inOrdertraverse : 중위순회(Public)
BinaryTree.prototype.inOrderTraverse = function(callback){
    this._inOrderTraverseNode(this.root, callback);
};


//_postOrderTraverseNode() : 후위 순회 (내부)
//L-R-N
BinaryTree.prototype._postOrderTraverseNode = function(node, callback){
    //매개변수 node는 이후 재귀함수로 node.left, node.right로 계속 변경
    if(node === null){
        return;
    }

    this._postOrderTraverseNode(node.left, callback);//L
    this._postOrderTraverseNode(node.right, callback);//R
    callback(node);//N
};

//postOrdertraverse() : 후위 순회(Public)
BinaryTree.prototype.postOrderTraverse = function(callback){
    this._postOrderTraverseNode(this.root, callback);
};


//leverOrderTraverse(): 층별 순회, Queue구조 이용
BinaryTree.prototype.levelOrderTraverse = function(fn){
    let q = new Queue();
    let node;
    q.enqueue(this.root);
    while(!q.isEmpty()){
        node = q.dequeue();
        fn(node);
        if(node.left !== null) q.enqueue(node.left);
        if(node.right !== null) q.enqueue(node.right);
        //while 중단 조건으로 if(node === null) return; 을 넣어줘도 된다.
    }
};


let tree = new BinaryTree();

tree.insert("F");
tree.insert("B");
tree.insert("A");
tree.insert("D");
tree.insert("C");
tree.insert("E");
tree.insert("G");
tree.insert("I");
tree.insert("H");

console.log(tree);

console.log("***** pre-Order *****")
tree.preOrderTraverse(printNode);
console.log("end");

console.log("***** in-Order *****")
tree.inOrderTraverse(printNode);
console.log("end");

console.log("***** post-Order *****")
tree.postOrderTraverse(printNode);
console.log("end");

console.log("***** level-Order *****")
tree.levelOrderTraverse(printNode);
console.log("end");


