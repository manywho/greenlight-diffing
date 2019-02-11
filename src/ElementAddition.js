import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementAddition = ({ groupName, item }) => (
    <div style={ { background: 'green' } }>
        adding a { createPrettyPathName(groupName) }: { JSON.stringify(item[0]) }
    </div>
);

export default ElementAddition;
