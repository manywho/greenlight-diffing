import React from 'react';
import { genericComponent, renderBasicValue } from "./GenericComponent";
import Who from './Who';

function handleCustomElement(node, path, key, item, rootPath, snapshotA, snapshotB) {

    return false;
}

function validateRootElement(element) {
    return (typeof element['elementType'] === "undefined") || element['elementType'] === 'MACRO';
}

const MacroElement = genericComponent(handleCustomElement, validateRootElement);
export default MacroElement;