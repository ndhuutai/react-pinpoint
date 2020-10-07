/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */

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
  stateNode: {
    state: any;
    updater: any;
    tag: number;
  };
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
    const omitList = [
      // "memoizedProps", // currently working on serialization for this
      // "memoizedState", // and this as well
      'updateList',
      'updateQueue',
      'ref',
      'elementType',
      // "stateNode", // serialization needed for this?
    ];
    // transform each nested node to just ids where appropriate
    for (const key of Object.getOwnPropertyNames(this)) {
      if (omitList.indexOf(key) < 0) {
        switch (key) {
          case 'parent':
            newObj['parent_component_id'] = this[key] ? this[key].uID : this[key];
            break;
          case 'sibling':
            newObj['sibling_component_id'] = this[key].uID;
            break;
          case 'selfBaseDuration':
            newObj['self_base_duration'] = this[key];
            break;
          case 'child': // probably not needed anymore, this prop seems to be redundant
            // newObj[`${key}ID`] = this[key].uID;
            break;
          case 'children':
            newObj[`children_ids`] = this[key].map(treeNode => treeNode.uID);
            break;
          case 'memoizedState':
            newObj['component_state'] = this[key];
            break;
          case 'memoizedProps':
            if (this[key]) {
              newObj['component_props'] = this[key].hasOwnProperty('children') ? serializeMemoizedProps(this[key]) : this[key];
            } else {
              newObj['component_props'] = this[key];
            }
            // newObj["component_props"] = this[key];
            break;
          case 'uID':
            newObj['component_id'] = this[key];
            break;
          case 'stateNode':
            let value = null;
            if (this[key]) {
              if (this[key].tag === 5) {
                value = 'host component';
              } else if (this[key].tag === 3) {
                value = 'host root';
              } else {
                value = 'other type';
              }
            }
            newObj['state_node'] = value;
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

function serializeMemoizedProps(obj) {
  console.log('to be done');
}

export default TreeNode;
