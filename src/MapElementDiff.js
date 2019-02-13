import React from 'react';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, determineChangeType } from "./Diffs";

const MapElementDiff = ({ item }) => {
    switch (determineChangeType(item)) {
        case CHANGE_ADDITION:
            const table = Object.entries(item[0]).map(([key, value]) => {
                return (
                    <tr>
                        <td>{ key }</td>
                        <td>{ renderChange(value) } </td>
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
        case CHANGE_DELETION:
            const deleted = item[0];

            return (
                <div>
                    Deleted the map element <strong>{ deleted.developerName }</strong> ({ deleted.id })
                </div>
            );
        case CHANGE_MODIFICATION:
            const changes = Object.entries(item).map(([key, value]) => {
                if (value instanceof Array) {
                    return <div>changed { key } from { renderChange(value[0]) } to { renderChange(value[1]) }</div>
                }

                console.log(key, value);

                return (
                    <div>
                        {/*changed { key } from { renderChange(item[0]) } to { renderChange(item[1]) }*/}
                    </div>
                )
            });

            return (
                <div>
                    { changes }
                </div>
            );
        default:
            return null;
    }
};

function renderChange(value) {
    if (value === null) {
        return "null";
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
