import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementAddition = ({ path, item }) => (
    <div className="bg-success wrap">
        adding a { createPrettyPathName(path) }:
        { JSON.stringify(item[0], null, 2) }
    </div>
);

export default ElementAddition;
