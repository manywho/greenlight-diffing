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

    createDiffItem(groupName, key, item) {
        if (item === null) {
            return null;
        }

        if (item instanceof Array) {
            // We're either adding, modifying or deleting

            switch (item.length) {
                case 1:
                    // We're adding
                    return <ElementAddition item={ item } key={ key } path={ groupName } />;
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

        if (item instanceof Object || typeof item === 'number') {
            // We either have an object or an array with inner changes

            if (item._t === 'a') {
                // We have an array with changes
                return Object.entries(item)
                    .filter(([innerKey]) => innerKey !== '_t')
                    .map(([innerKey, innerItem]) => {
                        if (innerItem instanceof Array || isNaN(innerKey)) {
                            // This item was either removed, or moved
                            return this.createDiffItem(groupName, innerKey, innerItem);
                        }

                        // This is a new item change
                        return this.createObjectDiffItem(key, innerItem);
                    })

            }

            // We have an object with multiple property changes
            return this.createObjectDiffItem(key, item);
        }

        // Otherwise, we have plain items (?)
        return null
    }

    createObjectDiffItem(key, item) {
        const innerItems = Object.entries(item).map(([innerKey, innerValue]) => {
            return <li key={ innerKey }>{ this.createDiffItem(key + '.' + innerKey, innerKey, innerValue) }</li>
        });

        return (
            <div key={ key } style={ { background: 'skyblue' } }>
                <h4>{ key }</h4>

                <ul>
                    { innerItems }
                </ul>
            </div>
        )
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
            <div className="container">
                { differences }
            </div>
        );
    }
}

export default App;
