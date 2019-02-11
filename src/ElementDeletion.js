import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementDeletion = ({ path, item }) => (
    <div style={ { background: 'red' } }>
        deleting a { createPrettyPathName(path) } { JSON.stringify(item[0]) }
    </div>
);

export default ElementDeletion;
