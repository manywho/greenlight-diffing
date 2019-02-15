import React from 'react';
import classNames from 'classnames';
import {
    CHANGE_ADDITION,
    CHANGE_DELETION,
    CHANGE_MODIFICATION,
    CHANGE_NESTED,
    CHANGE_UNKNOWN,
    determineChangeType
} from "./Diffs";
import { renderDelta, findByPath } from "./App";

export function genericComponent(handleCustomElement, validateRootElement) {

    return class extends React.Component {
        state = {
            isCollapsed: true
        };

        onToggleCollapse = () => {
            this.setState({
                isCollapsed: !this.state.isCollapsed
            });
        };

        render() {
            const panelBodyClasses = classNames({
                'collapse': true,
                'in': this.state.isCollapsed,
                'panel-body': true,
                'panel-collapse': true
            });

            const item = this.props.item;
            if(item.length === 0) {
                return <div>Nothing to render</div>;
            }

            let name, element;

            const changeType = determineChangeType(item);

            switch (changeType) {
                case CHANGE_ADDITION:
                    name = item[0].developerName;
                    element = item[0];
                    break;
                case CHANGE_DELETION:
                    name = item[0].developerName;
                    element = item[0];
                    break;
                case CHANGE_NESTED:
                    name = this.lookupDeveloperNameInSnapshots();
                    element = item;
                    break;
                default:
                    break;
            }

            if(typeof element === "undefined") {
                throw new Error("Element is undefined");
            }

            const panelClasses = classNames({
                'panel': true,
                'panel-danger': changeType === CHANGE_DELETION,
                'panel-default': changeType === CHANGE_UNKNOWN,
                'panel-info': changeType === CHANGE_MODIFICATION,
                'panel-success': changeType === CHANGE_ADDITION,
            });

            if(validateRootElement(element) === false) {
                throw new Error("Element invalid");
            }

            const rows = Object.entries(element)
                .filter(propKey => !['dateCreated', 'dateModified', 'elementType'].includes(propKey))
                .map(([key, value]) => {

                    // console.log("GenericComponent [key,value]=");
                    // console.log(key);
                    // console.log(value);

                    const nestedElements =  renderDelta(value, this.props.rootPath + this.props.relPath + "." + key, handleCustomElement); // todo: there might be a path separator needed

                    return (<tr key={key}>
                        <td>{key}</td>
                        <td>{nestedElements}</td>
                    </tr>)

                });

            const elementTypeName = this.props.elementTypeName ? this.props.elementTypeName : "???";

            return (
                <div className="panel-group" role="tablist" aria-multiselectable={false}>
                    <div className={panelClasses}>
                        <div className="panel-heading" role="tab">
                            <h3 className="panel-title">
                                <a role="button" data-toggle="collapse" aria-expanded="false"
                                   onClick={this.onToggleCollapse}>
                                    {elementTypeName}: <strong>{name}</strong>
                                </a>

                                <span className="pull-right">
                                {changeType}
                            </span>
                            </h3>
                        </div>

                        <div className={panelBodyClasses} role="tabpanel">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        lookupDeveloperNameInSnapshots() { // todo: shouldn't this be bound?

            const path = this.props.rootPath + this.props.relPath;
            // console.log(`lookupDeveloperNameInSnapshots(): rootPath=${this.props.rootPath} relpath=${this.props.relPath} path=${path}`);


            if (path && this.props.snapshotA) {

                const snapshotAElement = findByPath(this.props.snapshotA, path);
                if (snapshotAElement) {
                    if (snapshotAElement['developerName']) {
                        return snapshotAElement['developerName'];
                    } else {
                        return "(no developerName)";
                    }
                } else if (this.props.snapshotB) {
                    const snapshotBElement = findByPath(this.props.snapshotB, path);
                    if (snapshotBElement) {
                        if (snapshotBElement['developerName']) {
                            return snapshotBElement['developerName'];
                        } else {
                            return "(no developerName)";
                        }
                    } else {
                        return "(object not found in any snapshot)";
                    }
                } else {
                    return "(object not found in any snapshot)";
                }
            } else {
                return "(path or snapshot not provided)";
            }
        }
    }
}

export function renderBasicValue(value) {
    if (value === null) {
        return "null";
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    if (value instanceof Object) {
        return JSON.stringify(value);
    }

    if (value instanceof String) {
        if (value.trim() === "") {
            return <i>empty string</i>;
        }
    }

    return value;
}
