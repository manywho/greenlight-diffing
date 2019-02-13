import React from 'react';
import { stringify } from './Strings'
import Who from './Who';

import './Element.css'

const MacroElement = ({item: item}) => {

    let heading, element, className;
    if (item instanceof Array && item.length === 1) {
        heading = "New MacroElement";
        element = item[0];
        className = 'bg-success';
    }
    else if (item.length === 3) {
        heading = "Removed MacroElement";
        element = item[0];
        className = 'bg-secondary';
    }
    else if (item instanceof Object) {
        heading = "Updated MacroElement";
        element = item;
        className = 'bg-primary';
    } else {
        throw new Error("Invalid item argument");
    }

    if(element['elementType'] && element['elementType'] !== 'MACRO') {
        throw new Error("Invalid element type");
    }

    const rows = Object.keys(element)
        .filter(propKey => !['dateCreated', 'dateModified', 'elementType'].includes(propKey))
        .map(propKey => {

            if (element[propKey] instanceof Array && element[propKey].length === 2) {
                return (<tr key={propKey}>
                    <td>{propKey}</td>
                    <td>{createValueElement(element[propKey][0], propKey)}</td>
                    <td>{createValueElement(element[propKey][1], propKey)}</td>
                </tr>)
            }
            else {
                return (<tr key={propKey}>
                    <td>{propKey}</td>
                    <td>{createValueElement(element[propKey], propKey)}</td>
                </tr>)
            }
        });

    return (
        <div className={'Element ' + className}>
            <h4>{heading}</h4>
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>)

};

export default MacroElement;

function createValueElement(value, propKey) {
    if (propKey === "whoOwner") {
        return <Who who={value}/>;
    } else {
        return stringify(value);
    }
}