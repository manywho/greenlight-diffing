import React from 'react';

const ElementUnknown = ({ item, key, path }) => {
    console.warn("An unknown change occurred", item, key, path);

    return <div />;
};

export default ElementUnknown;
