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

    createDiffItem(elements, path, key, item) {

        const queue = [{path, key, item}];

        while (queue.length > 0) {

            let {path, key, item} = queue.pop();

            if (item instanceof Array) {
                // We're either adding, modifying or deleting

                switch (item.length) {
                    case 1:
                        // We're adding
                        elements.push(<ElementAddition item={item} key={key} path={path}/>);
                        break;
                    case 2:
                        // We're modifying
                        elements.push(<ElementModification item={item} key={key} path={key}/>);
                        break;
                    case 3:
                        // We're deleting
                        elements.push(<ElementDeletion item={item} key={key} path={path}/>);
                        break;
                    default:
                        // Unknown
                        elements.push(<ElementUnknown/>);
                }

            } else if (item instanceof Object) {

                // We either have an object or an array with inner changes

                Object.entries(item)
                    .filter(([innerKey]) => innerKey !== '_t')
                    .forEach(([innerKey, innerItem]) => {
                        queue.push({path: path + innerKey, key: innerKey, item: innerItem});
                    });

            }
            else {
                throw new Error("Not expecting that: (typeof item)=" + (typeof item));
            }
        }

        return elements;
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

        const groupedDiff = Object.entries(diff).reduce((output, [key, value]) => {
            if (key.toLowerCase().includes('elements')) {
                output[key] = value;
            } else {
                output.flow[key] = value;
            }

            return output;
        }, { flow: {} });


        // Render all the differences into a set of React elements
        const elements = [];
        Object.entries(groupedDiff)
            .filter(([groupName]) => groupName !== '_t')
            .forEach(([groupName, groupItems]) => {

                // For each group (i.e. group of elements in the flow root), we want to render a list of differences
                this.createDiffItem(elements, groupName, groupName, groupItems);
            });

        return (
            <div className="container">
                { elements }
            </div>
        );
    }
}

export default App;
