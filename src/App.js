import React, { Component } from 'react';
import { DiffPatcher } from 'jsondiffpatch';

import './App.css';

import snapshotA from './snapshotA';
import snapshotB from './snapshotB';

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
        const differences = Object.keys(groupedDiff)
            .map(groupName => {
                const groupItems = groupedDiff[groupName];

                // For each group (i.e. group of elements in the flow root), we want to render a list of differences
                const items = Object.keys(groupItems)
                    .map(groupItem => this.createDiffItem(groupItems, groupItem, groupName));

                return (
                    <div>
                        { groupName }

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

                    return (
                        <div style={ { background: 'green' } }>
                            adding a { App.createPrettyPathName(groupName) }: { JSON.stringify(item[0]) }
                        </div>
                    );
                case 2:
                    // We're modifying
                    // console.log('modifying')

                    return (
                        <div style={ { background: 'skyblue' } }>
                            modifying { key } from { JSON.stringify(item[0]) } to { JSON.stringify(item[1]) }
                        </div>
                    );
                case 3:
                    // We're deleting
                    // console.log('deleting', item[0], item[1], item[2])

                    return (
                        <div style={ { background: 'red' } }>
                            deleting a { App.createPrettyPathName(groupName) } { JSON.stringify(item[0]) }
                        </div>
                    );
                default:
                    // Unknown
                    // console.log('unknown')

                    return (
                        <div style={ { background: 'yellow' } }>
                            unknown
                        </div>
                    );
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
                // We have an object with changes
                // console.log('object', item);

                return (
                    <div style={ { background: 'skyblue' } }>
                        changed item from { JSON.stringify(item[0]) } to { JSON.stringify(item[1]) }
                    </div>
                )
            }
        }
    }

    static createDiffItem(groupName, d) {
        const path = d.path.join(".");

        const prettyName = App.createPrettyPathName(path);

        switch (d.kind) {
            case "A":
                // An element was added to an array
                return (
                    <div style={ { background: 'green' } }>
                        <p>a new { prettyName } was added at index { d.index }</p>

                        <code> { App.convertSideToRepresentation(d.item.rhs) }</code>
                    </div>
                );
            case "E":
                return (
                    <div style={ { background: 'skyblue' } }>
                        <div>
                            the { prettyName } changed
                            from <strong>{ App.convertSideToRepresentation(d.lhs) }</strong> to <strong>{ App.convertSideToRepresentation(d.rhs) }</strong>
                        </div>
                    </div>
                );
            case "D":
                return <p style={ { background: 'red' } }>{ path }: deleted</p>;
            case "N":
                return <p>newly added property... TODO</p>
            default:
                return <p style={ { background: 'yellow' } }>{ path }: unknown</p>;
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
            case "flow":
                return "flow";
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

    static convertSideToRepresentation(side) {
        if (side === null) {
            return <span>null</span>
        }

        switch (true) {
            case side instanceof Array:
                const items = side.map((item, index) => {
                    return (
                        <div>
                            [{ index }]: { JSON.stringify(item) }
                        </div>
                    );
                });

                return (
                    <div>
                        <h4>array</h4>

                        { items }
                    </div>
                );
            case side instanceof Object:
                return JSON.stringify(side);
            default:
                if (side.trim() === '') {
                    return (
                        <span>
                            <i>empty string</i>
                        </span>
                    )
                }

                return side;
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
