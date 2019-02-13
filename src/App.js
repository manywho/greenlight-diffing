import React, { Component } from 'react';
import { DiffPatcher } from 'jsondiffpatch';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import snapshotA from './snapshotA';
import snapshotB from './snapshotB';
import ElementAddition from "./ElementAddition";
import ElementModification from "./ElementModification";
import ElementDeletion from "./ElementDeletion";
import ElementUnknown from "./ElementUnknown";
import { createPrettyPathName } from "./Paths";
import { pluralise } from "./Strings";

class App extends Component {
    state = {
        snapshotA: snapshotA,
        snapshotB: snapshotB
    };

    componentDidMount() {

    }

    render() {
        const diffPatcher = new DiffPatcher({
            objectHash: function (obj) {
                // We want to hash the objects by ID, if there is a field called "id"
                if (obj.id) {
                    return obj.id;
                }

                return obj;
            }
        });

        const diff = diffPatcher.diff(snapshotA, snapshotB);

        // Render all the differences into a set of React elements
        const queue = [];
        const rootNode = {level: 0, children: []};

        let childIndex = 0;
        Object.entries(diff)
            .filter(([groupName]) => groupName !== '_t')
            .forEach(([key, item]) => {

                queue.push({path: key, key, item, treeIndex: [childIndex++]});
                rootNode.children.push({path: key, children: []});
            });

        while (queue.length > 0) {

            let {path, key, item, treeIndex} = queue.pop();
            const node = this.findNode(rootNode, treeIndex);

            // console.log(path);
            //
            // const snapshotAObject = this.findByPath(snapshotA, path);
            // console.log("Snapshot A");
            // console.log(snapshotAObject);
            //
            // const snapshotBObject = this.findByPath(snapshotB, path);
            // console.log("Snapshot B");
            // console.log(snapshotBObject);

            if (item instanceof Array) {
                // We're either adding, modifying or deleting

                switch (item.length) {
                    case 1:
                        // We're adding
                        node.element = <ElementAddition item={item} key={key} path={path}/>;
                        break;
                    case 2:
                        // We're modifying
                        node.element = (<ElementModification item={item} key={key} path={key}/>);
                        break;
                    case 3:
                        // We're deleting
                        node.element = (<ElementDeletion item={item} key={key} path={path}/>);
                        break;
                    default:
                        // Unknown
                        node.element = (<ElementUnknown/>);
                }

            } else if (item instanceof Object) {

                // We either have an object or an array with inner changes

                let childIndex = 0;
                Object.entries(item)
                    .filter(([propKey]) => propKey !== '_t')
                    .forEach(([propKey, propItem]) => {

                        let propPath = path + '.' + propKey;

                        let propTreeIndex = treeIndex.slice();
                        propTreeIndex.push(childIndex++);

                        queue.push({path: propPath, key: propKey, item: propItem, treeIndex: propTreeIndex});
                        node.children.push({path: propPath, children: []})
                    });

            }
            else {
                throw new Error("Not expecting that: (typeof item)=" + (typeof item));
            }
        }

        const elements = this.createElementTree(rootNode);

        return (
            <div className="container">
                {elements}
            </div>
        );
    }

    findNode(root, index) {

        let node = root;

        for(let i = 0 ; i < index.length ; i++) {
           node = node.children[index[i]];
        }

        return node;
    }

    createElementTree(node) {

        if(node.children.length > 0) {
            const childElements = node.children.map((child) => this.createElementTree(child));
            return (
                <div>
                <h3>{node.path}</h3>
              <ul>
                  {childElements}
              </ul>
                </div>
            );

        } else {
            return node.element;
        }
    }

    findByPath(root, pathStr) {

        const path = pathStr.split(".")

        let node = root;

        for(let i = 0; i < path.length; i++) {

            const currentNode = node[path[i]];
            if(typeof currentNode === "undefined" || currentNode == null) {
                return null;
            }

            node = currentNode;
        }

        return node;
    }
}

export default App;
