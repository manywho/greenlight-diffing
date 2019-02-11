import React, { Component } from 'react';
import { diff, observableDiff } from 'deep-diff';

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
        let arrayItems = [];

        let finalItems = [];

        const theDiff = observableDiff(snapshotA, snapshotB, function (item) {
            console.log(item);
            finalItems.push(item);
        }, {
            normalize: (path, key, lhs, rhs) => {
                if (typeof key === 'number') {
                    console.log('aaaaaaaaaa');
                    return false;
                    if (lhs.id === rhs.id) {
                        return true
                    } else {
                        return false;
                    }

                    // console.log('aaaa');
                    // console.table(lhs, rhs);
                }


                // if (path instanceof Array) {
                //     const finalKey = path[path.length - 1];
                //
                //     if (isNaN(finalKey) === false) {
                //         // console.log(path, key);
                //
                //         const pathString = path.join('.');
                //
                //         // If the
                //         if (key === 'id' && arrayItems.includes(pathString)) {
                //
                //         }
                //     }
                // }

                return [lhs, rhs];
            }
        });

        const groupedDiff = App.groupBy(theDiff, function (item) {
            // We only want to group element things
            if (item.path) {
                const firstPathSegment = item.path[0];

                if (['groupElements', 'macroElements', 'mapElements', 'navigationElements', 'pageElements', 'serviceElements', 'tagElements', 'typeElements', 'valueElements'].includes(firstPathSegment)) {
                    return firstPathSegment;
                }
            }

            // Anything that is part of the flow document itself should go into a "flow" group
            return 'flow';
        });

        const differences = Object.keys(groupedDiff).flatMap((group) => {
            const items = groupedDiff[group]
                .sort((a, b) => {
                    if (a.index && b.index) {
                        return a.index > b.index;
                    }

                    return a > b;
                })
                .map(d => App.createDiffItem(group, d));


            return (
                <div>
                    <h4>{ App.pluralise(App.createPrettyPathName(group)) }</h4>

                    { items }
                </div>
            )
        });

        // console.log(groupedDiff);
        // console.log(groupedDiff);

        return (
            <div className="App">
                { differences }
            </div>
        );
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
                            the { prettyName } changed from <strong>{ App.convertSideToRepresentation(d.lhs) }</strong> to <strong>{ App.convertSideToRepresentation(d.rhs) }</strong>
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

    static groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            var v = key instanceof Function ? key(x) : x[key];
            (rv[v] = rv[v] || []).push(x);
            return rv;
        }, {});
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
