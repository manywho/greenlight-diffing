import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementDeletion = ({ path, item }) => (
    <div className="bg-danger wrap">
        deleting a { createPrettyPathName(path) } { JSON.stringify(item[0], null, 2) }
    </div>
);

export default ElementDeletion;
