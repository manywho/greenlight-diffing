import React from 'react';
import {genericComponent, renderBasicValue} from "./GenericComponent";
import Who from './Who';
import ServiceAction from './ServiceAction';

function handleCustomElement(node, path, key, item, rootPath, snapshotA, snapshotB) {

    // console.log("ServiceElement.handleCustomElement [path, key, item]=");
    // console.log(path);
    // console.log(key);
    // console.log(item);

    let shouldContinue = false;

    if (path.startsWith(".")) {
        node.element = <ServiceAction item={item} key={key} elementTypeName="Action" rootPath={rootPath} relPath={path} snapshotA={snapshotA} snapshotB={snapshotB}/>;
        shouldContinue = true;
    }

    return shouldContinue;
}

function validateRootElement(element) {
    return (typeof element['elementType'] === "undefined") || element['elementType'] === 'SERVICE';
}

const ServiceElement = genericComponent(handleCustomElement, validateRootElement);
export default ServiceElement;