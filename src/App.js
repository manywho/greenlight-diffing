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

    createDiffItem(groupName, path, key, item) {
        if (item === null) {
            return null;
        }

        if (item instanceof Array) {
            // We're either adding, modifying or deleting

            switch (item.length) {
                case 1:
                    // We're adding
                    return <ElementAddition item={ item } key={ key } path={ path } />;
                case 2:
                    // We're modifying
                    return <ElementModification item={ item } key={ key } path={ key } />;
                case 3:
                    // We're deleting
                    return <ElementDeletion item={ item } key={ key } path={ path } />;
                default:
                    // Unknown
                    return <ElementUnknown />;
            }
        }

        if (item instanceof Object || typeof item === 'number') {
            // We either have an object or an array with inner changes

            if (item._t === 'a') {

                // We have an array with changes
                const result = Object.entries(item)
                    .filter(([innerKey]) => innerKey !== '_t')
                    .map(([innerKey, innerItem]) => {
                        // This item was either removed, or moved
                        if (innerItem instanceof Array || isNaN(innerKey)) {
                            // This item was either removed, or moved
                            return this.createDiffItem(groupName, path, innerKey, innerItem);
                        }

                        // This is a new item change
                        return this.createObjectDiffItem(groupName, path, innerKey, innerItem);
                    });

                return (
                    <div key={ key }>
                        <h4>{ path }</h4>

                        { result }
                    </div>
                );

            }

            // We have an object with multiple property changes
            return this.createObjectDiffItem(groupName, path, key, item);
        }

        // Otherwise, we have plain items (?)
        return null
    }

    createObjectDiffItem(groupName, path, key, item) {
        const innerItems = Object.entries(item).map(([innerKey, innerValue]) => {
            return <li key={ innerKey }>{ this.createDiffItem(groupName, innerKey, innerKey, innerValue) }</li>
        });

        return (
            <ul key={ key } style={ { background: 'skyblue' } }>
                { innerItems }
            </ul>
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
                return this.createDiffItem(groupName, groupName, itemKey, itemValue)
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
