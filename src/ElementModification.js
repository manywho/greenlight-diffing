import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementModification = (({item, rootPath, relPath}) => {

    console.log(`ElementModification.render, item=${item} rootPath=${rootPath} relPath=${relPath}`);


    let propertyName = "";
    const relPathArray = relPath.split(".");
    if(relPathArray && relPathArray.length > 0) {
       propertyName = relPathArray[relPathArray.length - 1];
    }

    return (
            <table className="bg-info table wrap">
                <thead>
                <tr>
                    <th>Property name</th>
                    <th>Source value</th>
                    <th>Target value</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{propertyName}</td>
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
