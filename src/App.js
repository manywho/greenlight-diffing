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
import MapElement from "./MapElement";
import MacroElement from "./MacroElement";
import ServiceElement from "./ServiceElement";
import DiffViewer from "./viewer/DiffViewer";
import SnapSelector from "./snapselector/SnapSelector";

function findNode(root, index) {

    let node = root;

    for(let i = 0 ; i < index.length ; i++) {
        node = node.children[index[i]];
    }

    return node;
}

function createElementTree(node) {

    if(node.children.length > 0) {
        const childElements = node.children.map((child) => createElementTree(child));
        return (
            <div key={ node.path }>
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

export function findByPath(root, pathStr) {

    if(pathStr.startsWith("."))
        pathStr = pathStr.substring(1);

    const path = pathStr.split(".");

    // console.log("findByPath, path=");
    // console.log(path);

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

export function renderDelta(diff, rootPath, snapshotA, snapshotB, handleCustomElement) {

    if(!rootPath) {
        rootPath = "";
    }

    const queue = [{path: "", key: "", item: diff, treeIndex: []}];
    const rootNode = {level: 0, children: []};

    while (queue.length > 0) {

        let {path, key, item, treeIndex} = queue.pop();
        const node = findNode(rootNode, treeIndex);

        if(handleCustomElement) {
            let shouldContinue = handleCustomElement(node, path, key, item, rootPath, snapshotA, snapshotB);
            if(shouldContinue) {
                continue;
            }
        }

        if (typeof item === "string" || typeof item === "number") {
            node.element = <div key={key}>{item}</div>
        }
        else if(item === null) {
            node.element = <div key={key}>null</div>
        }
        else if(typeof item === "boolean") {
            node.element = <div key={key}>{item ? 'true' : 'false'}</div>
        }
        else if (item instanceof Array) {
            // We're either adding, modifying or deleting

            switch (item.length) {
                case 1:
                    // We're adding
                    node.element = <ElementAddition item={item} key={key} path={path}/>;
                    break;
                case 2:
                    // We're modifying
                    node.element = (<ElementModification item={item} key={key} rootPath={rootPath} relPath={path} />);
                    break;
                case 3:
                    // We're deleting
                    node.element = (<ElementDeletion item={item} key={key} path={path}/>);
                    break;
                default:
                    // Unknown
                    node.element = <ElementUnknown item={ item } key={ key } path={ path } />;
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
            console.error("Not expecting that: (typeof item)=" + (typeof item) + ", item=" + item);
        }
    }

    const elements = createElementTree(rootNode);
    return elements;
}

class App extends Component {
    state = {
        snapshotA: null,
        snapshotB: null,
        viewer: true
    };

    componentDidMount() {

    }

    diffRenderToggle = () => {
        const newState = !this.state.viewer;
        this.setState({viewer: newState});
    };

    setSource = (snapshotSource) => {
        this.setState({snapshotA: snapshotSource});
    };

    setTarget = (snapshotTarget) => {
        this.setState({snapshotB: snapshotTarget});
    };

    cleanSelected = () => {
        this.setSource(null);
        this.setTarget(null);
    };

    render() {

        if (this.state.snapshotA === null || this.state.snapshotB === null) {
            return <div className={"container"}>
                            <SnapSelector setSource={this.setSource} setTarget={this.setTarget} cleanSelected={this.cleanSelected}/>
                   </div>
        }

        const diffPatcher = new DiffPatcher({
            objectHash: function (obj) {
                // We want to hash the objects by ID, if there is a field called "id"
                if (obj.id) {
                    return obj.id;
                } else if (obj.developerName) {
                    return obj.developerName;
                }

                return obj;
            }
        });

        const originalDiff = diffPatcher.diff(this.state.snapshotA, this.state.snapshotB);

        const diff = Object.entries(originalDiff).reduce((output, [key, value]) => {
            if (key.toLowerCase().includes('elements')) {
                output[key] = value;
            } else {
                output.flow[key] = value;
            }

            return output;
        }, { flow: {} });


        // Render all the differences into a set of React elements
        const elements = renderDelta(diff, "", this.state.snapshotA, this.state.snapshotB, (node, path, key, item, rootPath) => {
            let shouldContinue = false;

            if (path.startsWith(".mapElements.")) {
                node.element = <MapElement item={item} key={key} elementTypeName="Map Element" rootPath={rootPath} relPath={path} snapshotA={snapshotA} snapshotB={snapshotB} />;

                shouldContinue = true;
            } else if (path.startsWith(".macroElements.")) {
                node.element = <MacroElement item={item} key={key} elementTypeName="Macro Element" rootPath={rootPath} relPath={path} snapshotA={this.state.snapshotA} snapshotB={this.state.snapshotB} />;

                shouldContinue = true;
            } else if (path.startsWith(".serviceElements.")) {
                node.element = <ServiceElement item={item} key={key} elementTypeName="Service Element" rootPath={rootPath} relPath={path} snapshotA={this.state.snapshotA} snapshotB={this.state.snapshotB} />;

                shouldContinue = true;
            }
            return shouldContinue;
        });


        let diffRender;
        if (this.state.viewer === false) {
            diffRender = elements;
        } else {
            diffRender = <DiffViewer diff={ diff } snapshotA={ this.state.snapshotA } snapshotB={ this.state.snapshotB } targetTitle={this.state.snapshotB.developerName} sourceDate={this.state.snapshotA.dateModified} targetDate={this.state.snapshotB.dateModified}/>
        }

        return (
            <div className="container-fluid">
                {diffRender}
            </div>
        );
    }
}

export default App;
