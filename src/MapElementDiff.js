import React from 'react';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, determineChangeType, renderChange } from "./Diffs";
import Outcomes from "./Outcomes";

function renderDeletion(item) {
    return (
        <div>
            Deleted the map element <strong>{ item.developerName }</strong> ({ item.id })
        </div>
    );
}

function renderModification(key, lhs, rhs) {
    switch (key) {
        case "outcomes":
            return <Outcomes item={ lhs } path={ key } />;
        default:
            return (
                <div>
                    { key } changed { JSON.stringify(lhs) } to { JSON.stringify(rhs) }
                </div>
            )
    }
}

function renderAddition(item) {
    const table = Object.entries(item).map(([key, value]) => {
        return (
            <tr>
                <td>{ key }</td>
                <td>{ renderValue(value) } </td>
            </tr>
        )
    });

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
                </thead>

                <tbody>
                { table }
                </tbody>
            </table>
        </div>
    );
}

const MapElementDiff = ({ path, item }) => {
    return renderChange(path, item, renderAddition, renderDeletion, renderModification, () => <p>unknown</p>);

    switch (determineChangeType(item)) {
        case CHANGE_ADDITION:

        case CHANGE_DELETION:

        case CHANGE_MODIFICATION:

        default:
            return null;
    }
};

function renderValue(value) {
    if (value === null) {
        return "null";
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    if (value instanceof Object) {
        return JSON.stringify(value);
    }

    if (value instanceof String) {
        if (value.trim() === "") {
            return <i>empty string</i>;
        }
    }

    return value;
}

export default MapElementDiff;
