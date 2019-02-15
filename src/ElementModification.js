import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementModification = (({item, key, rootPath, relPath}) => {

    console.log(`ElementModification.render, item=${item} key=${key} rootPath=${rootPath} relPath=${relPath}`);

    return (
            <table className="bg-info table wrap">
                <thead>
                <tr>
                    <th>Source value</th>
                    <th>Target value</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{renderChange(item[0])}</td>
                    <td>{renderChange(item[1])}</td>
                </tr>
                </tbody>
            </table>
    );
});

function renderChange(value) {
    if (value === null) {
        return "null";
    }

    if (value instanceof Object) {
        return JSON.stringify(value, null, 2);
    }

    if (value.trim() === "") {
        return <i>empty string</i>;
    }

    return value;
}

export default ElementModification;
