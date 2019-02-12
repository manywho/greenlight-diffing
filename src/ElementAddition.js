import React from 'react';
import { createPrettyPathName } from './Paths';

const ElementAddition = ({ path, item }) => (
    <div className="bg-success">
        adding a { createPrettyPathName(path) }: { JSON.stringify(item[0]) }
    </div>
);

export default ElementAddition;
