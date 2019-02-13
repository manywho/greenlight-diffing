import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementDeletion = ({ path, item }) => (
    <div className="bg-danger">
        deleting a { createPrettyPathName(path) } { JSON.stringify(item[0]) }
    </div>
);

export default ElementDeletion;
