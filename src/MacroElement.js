import React from 'react';
import { genericComponent, renderBasicValue } from "./GenericComponent";
import Who from './Who';

function handleCustomElement(node, path, key, item, rootPath, snapshotA, snapshotB) {

    // console.log("handleCustomElement, path=" + path + ", key=" + key + ", rootPath=" + rootPath);

    if (item != null && (rootPath.endsWith(".whoOwner") || rootPath.endsWith(".whoCreated") || rootPath.endsWith(".whoModified"))) {

        node.element = <Who who={item}/>;
        return true;
    }

    return false;
}

function validateRootElement(element) {
    return (typeof element['elementType'] === "undefined") || element['elementType'] === 'MACRO';
}

const MacroElement = genericComponent(handleCustomElement, validateRootElement);
export default MacroElement;