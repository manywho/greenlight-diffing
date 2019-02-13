import React, { Component } from 'react';
import classNames from 'classnames';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, CHANGE_UNKNOWN, determineChangeType } from "./Diffs";

export function genericComponent(renderProperty, validateRootElement) {

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
                case CHANGE_MODIFICATION:
                    name = this.props.original['developerName'];
                    element = item;
                    break;
                default:
                    break;
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

                    switch (changeType) {
                        case CHANGE_MODIFICATION:
                            return (<tr key={key}>
                                <td>{key}</td>
                                <td>{renderProperty(key, value[0])}</td>
                                <td>{renderProperty(key, value[1])}</td>
                            </tr>);

                        default:
                            return (<tr key={key}>
                                <td>{key}</td>
                                <td>{renderProperty(key, value)}</td>
                            </tr>);
                    }
                });

            let headerRow;
            switch (changeType) {
                case CHANGE_MODIFICATION:
                    headerRow = (
                        <tr>
                            <th>Name</th>
                            <th>Left value</th>
                            <th>Right value</th>
                        </tr>
                    );
                    break;
                default:
                    headerRow = (
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    );
            }

            return (
                <div className="panel-group" role="tablist" aria-multiselectable={false}>
                    <div className={panelClasses}>
                        <div className="panel-heading" role="tab">
                            <h3 className="panel-title">
                                <a role="button" data-toggle="collapse" aria-expanded="false"
                                   onClick={this.onToggleCollapse}>
                                    Macro Element: <strong>{name}</strong>
                                </a>

                                <span className="pull-right">
                                {changeType}
                            </span>
                            </h3>
                        </div>

                        <div className={panelBodyClasses} role="tabpanel">
                            <table className="table">
                                <thead>
                                {headerRow}
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