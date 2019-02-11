import React, { Component } from 'react';
import { DiffPatcher } from 'jsondiffpatch';

import './App.css';

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
                if (Object.hasOwnProperty('id')) {
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
        const differences = Object.entries(groupedDiff).map(([groupName, groupItems]) => {

            // For each group (i.e. group of elements in the flow root), we want to render a list of differences
            const items = Object.entries(groupItems).map(([itemKey, itemValue]) => {
                return this.createDiffItem(groupName, itemKey, itemValue)
            });

            return (
                <div key={ groupName }>
                    <h3 className="title">{ pluralise(createPrettyPathName(groupName)) }</h3>

                    { items }
                </div>
            )
        });

        return (
            <div className="App">
                { differences }
            </div>
        );
    }

    createDiffItem(groupName, key, item) {
        if (item instanceof Array) {
            // We're either adding, modifying or deleting

            switch (item.length) {
                case 1:
                    // We're adding
                    return <ElementAddition item={ item } groupName={ groupName } key={ key } />;
                case 2:
                    // We're modifying
                    return <ElementModification item={ item } key={ key } path={ key } />;
                case 3:
                    // We're deleting
                    return <ElementDeletion item={ item } key={ key } path={ groupName } />;
                default:
                    // Unknown
                    return <ElementUnknown />;
            }
        }

        if (item instanceof Object) {
            // We either have an object or an array with inner changes

            if (item._t === 'a') {
                // We have an array with changes
                Object.keys(item).forEach(innerKey => {
                    const innerItem = item[innerKey];

                    if (isNaN(innerKey)) {
                        // This item was either removed, or moved
                    } else {
                        // This is a new item
                    }
                })

            } else {
                // We have an object with multiple property changes
                const innerItems = Object.entries(item).map(([innerKey, innerValue]) => {
                    return <ElementModification item={ innerValue } key={ innerKey } path={ key + '.' + innerKey } />;
                });

                return (
                    <div key={ key } style={ { background: 'skyblue' } }>
                        { innerItems }
                    </div>
                )
            }
        }
    }
}

export default App;
