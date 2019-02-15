import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementModification = ({ path, item }) => (
    <div className="bg-info wrap">
        changed <i>{ createPrettyPathName(path) }</i> from <strong>{ renderChange(item[0]) }</strong> to <strong>{ renderChange(item[1]) }</strong>
    </div>
);

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
