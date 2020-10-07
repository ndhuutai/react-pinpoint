class TreeNode {
  // will add type after ;D
  uID: any;
  elementType: any;
  selfBaseDuration: any;
  memoizedProps: any;
  memoizedState: any;
  effectTag: any;
  ref: any;
  fiberName: any;
  updateQueue: any;
  tag: any;
  updateList: any[];
  stateNode:
    | {
        state: any;
        updater: any;
      }
    | string;
  parent: any;
  child: any;
  sibling: any;
  children: any;

  constructor(fiberNode, uID) {
    this.uID = uID;
    const {elementType, selfBaseDuration, memoizedState, memoizedProps, effectTag, tag, ref, updateQueue, stateNode} = fiberNode;
    this.elementType = elementType;
    this.selfBaseDuration = selfBaseDuration;
    this.memoizedProps = memoizedProps;
    this.memoizedState = memoizedState;
    this.effectTag = effectTag;
    this.ref = ref;
    this.fiberName = getElementName(fiberNode);
    this.updateQueue = updateQueue; // seems to be replaced entirely and since it exists directly under a fiber node, it can't be modified.
    this.tag = tag;
    this.updateList = [];
    this.children = [];

    // stateNode can contain circular references depends on the fiber node
    if (tag === 5) {
      this.stateNode = 'host component';
    } else if (tag === 3) {
      this.stateNode = 'host root';
    } else {
      this.stateNode = stateNode;
    }

    // check the fiber and the attach the spy
    // find a way to store the update function variable and result here
    // if ((tag === 1 || tag === 5) && this.stateNode && this.stateNode.state) {
    //   /*
    //     enqueueReplaceState (inst, payload, callback)
    //     enqueueForceUpdate (inst, callback)
    //     enqueueSetState    (inst, payload, callback)
    //   */
    //   if (this.stateNode.updater) {
    //     const cb = (update, payload) => {
    //       this.updateList.push([update, payload]);
    //     };
    //     // spying
    //     // if (!stateNodeWeakSet.has(this.stateNode)) {
    //     //   stateNodeWeakSet.add(this.stateNode);
    //     //   Spy(this.stateNode.updater, "enqueueSetState", cb);
    //     //   Spy(this.stateNode.updater, "enqueueReplaceState", cb);
    //     //   Spy(this.stateNode.updater, "enqueueForceUpdate", cb);
    //     // }
    //   }
    // }
    if (tag === 0 && !stateNode && memoizedState) {
      // pass in "queue" obj to spy on dispatch func
      console.log('attaching a spy', memoizedState.queue);

      const cb = (...args) => {
        this.updateList.push([...args]);
      };
    }
  }

  addChild(treeNode): void {
    // remove other uneccessary properties
    this.child = treeNode;
  }

  addSibling(treeNode): void {
    // if (!node) return;
    this.sibling = treeNode;
  }

  addParent(treeNode): void {
    // if (!node) return;
    this.parent = treeNode;
  }

  toSerializable(): any {
    const newObj = {};
    const omitList = ['memoizedProps', 'memoizedState', 'updateList', 'updateQueue', 'ref', 'elementType', 'stateNode'];
    // transform each nested node to just ids where appropriate
    const keys = Object.keys(this);
    for (const key in keys) {
      if (omitList.indexOf(key) < 0) {
        switch (key) {
          case 'parent':
          case 'sibling':
          case 'child':
            newObj[`${key}ID`] = this[key].uID;
            break;
          case 'children': // sorry for this monstrosity, :D
            newObj[`childrenIDs`] = this[key].map(treeNode => treeNode.uID);
            break;
          default:
            newObj[key] = this[key];
        }
      }
    }

    return newObj;
  }
}

function getElementName(fiber) {
  switch (fiber.tag) {
    case 1:
      return fiber.elementType.name;
    case 3:
      return 'Host Root - The element you used to render the React App';
    case 5:
      return `${fiber.elementType}${fiber.elementType.className ? `.${fiber.elementType.className}` : ''}`;
    default:
      return `${fiber.elementType}`;
  }
}

export default TreeNode;
