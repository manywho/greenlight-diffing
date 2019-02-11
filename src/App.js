import React, { Component } from 'react';
import { DiffPatcher } from 'jsondiffpatch';

import './App.css';

import snapshotA from './snapshotA';
import snapshotB from './snapshotB';
import ElementAddition from "./ElementAddition";
import ElementModification from "./ElementModification";
import ElementDeletion from "./ElementDeletion";
import ElementUnknown from "./ElementUnknown";

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

        const groupedDiff = Object.keys(diff).reduce((output, value) => {
            if (['groupElements', 'macroElements', 'mapElements', 'navigationElements', 'pageElements', 'serviceElements', 'tagElements', 'typeElements', 'valueElements'].includes(value)) {
                output[value] = diff[value];
            } else {
                output.flow[value] = diff[value];
            }

            return output;
        }, { flow: {} });

        // Render all the differences into a set of React elements
        const differences = Object.keys(groupedDiff).map(groupName => {
            const groupItems = groupedDiff[groupName];

            // For each group (i.e. group of elements in the flow root), we want to render a list of differences
            const items = Object.keys(groupItems)
                .map(item => this.createDiffItem(groupItems, item, groupName));

            return (
                <div key={ groupName }>
                    <h3 className="title">{ App.pluralise(App.createPrettyPathName(groupName)) }</h3>

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

    createDiffItem(things, key, groupName) {
        const item = things[key];

        if (item instanceof Array) {
            // We're either adding, modifying or deleting

            switch (item.length) {
                case 1:
                    // We're adding
                    // console.log('adding', item[0]);

                    return <ElementAddition item={ item } groupName={ groupName } key={ key } />;
                case 2:
                    // We're modifying
                    // console.log('modifying')

                    return <ElementModification item={ item } key={ key } path={ key } />;
                case 3:
                    // We're deleting
                    // console.log('deleting', item[0], item[1], item[2])

                    return <ElementDeletion item={ item } key={ key } path={ groupName } />;
                default:
                    // Unknown
                    // console.log('unknown')

                    return <ElementUnknown />;
            }
        }

        if (item instanceof Object) {
            // We either have an object or an array with inner changes

            if (item._t === 'a') {
                // We have an array with changes
                // console.log('array');

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
                // console.log('object', item);

                const innerItems = Object.keys(item).map(innerKey => {
                    return <ElementModification item={ item[innerKey] } key={ innerKey } path={ key + '.' + innerKey } />;
                });

                return (
                    <div key={ key } style={ { background: 'skyblue' } }>
                        { innerItems }
                    </div>
                )
            }
        }
    }

    static createPrettyPathName(path) {
        switch (path) {
            case "dateCreated":
                return "flow creation date";
            case "dateModified":
                return "flow modification date";
            case "developerName":
                return "flow name";
            case "id.id":
                return "flow ID";
            case "id.versionId":
                return "flow version";
            case "groupElements":
                return "group element";
            case "macroElements":
                return "macro element";
            case "mapElements":
                return "map element";
            case "navigationElements":
                return "navigation element";
            case "pageElements":
                return "page element";
            case "serviceElements":
                return "service element";
            case "startMapElementId":
                return "starting map element ID";
            case "tagElements":
                return "tag element";
            case "typeElements":
                return "type element";
            case "valueElements":
                return "value element";
            case "whoCreated":
                return "creator";
            case "whoModified":
                // TODO
                return "modifier";
            case "whoOwner":
                return "owner";
            default:
                console.warn("An unknown path was encountered:", path);

                return path;
        }
    }

    /**
     * This is a super naive way to pluralise a given string, which I think works for everything we need it to?
     *
     * @param group
     * @param count
     * @returns string
     */
    static pluralise(group, count = 0) {
        if (count === 1) {
            return group;
        }

        return group + 's';
    }
}

export default App;
