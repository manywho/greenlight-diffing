import React from 'react';
import { genericComponent, renderBasicValue } from "./GenericComponent";
import Who from './Who';

function renderProperty(key, value) {
    if (key === "whoOwner") {
        return <Who who={value}/>;
    } else {
        return renderBasicValue(value);
    }
}

function validateRootElement(element) {
    return (typeof element['elementType'] === "undefined") || element['elementType'] === 'MACRO';
}

const MacroElement = genericComponent(renderProperty, validateRootElement);
export default MacroElement;