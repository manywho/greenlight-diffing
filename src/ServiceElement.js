import React, { Component } from 'react';
import classNames from 'classnames';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, CHANGE_UNKNOWN, determineChangeType } from "./Diffs";
import Who from './Who';

export default class ServiceElement extends Component {
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

        if (element['elementType'] && element['elementType'] !== 'SERVICE') {
            throw new Error("Invalid element type");
        }

        const rows = Object.entries(element)
            .filter(propKey => !['dateCreated', 'dateModified', 'elementType'].includes(propKey))
            .map(([key, value]) => {

                switch (changeType) {
                    case CHANGE_MODIFICATION:
                        return (<tr key={key}>
                            <td>{key}</td>
                            <td>{createValueElement(value[0], key)}</td>
                            <td>{createValueElement(value[1], key)}</td>
                        </tr>);

                    default:
                        return (<tr key={key}>
                            <td>{key}</td>
                            <td>{createValueElement(value, key)}</td>
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
            <div className="panel-group" role="tablist" aria-multiselectable={ false }>
                <div className={ panelClasses }>
                    <div className="panel-heading" role="tab">
                        <h3 className="panel-title">
                            <a role="button" data-toggle="collapse" aria-expanded="false" onClick={ this.onToggleCollapse }>
                                Macro Element: <strong>{ name }</strong>
                            </a>

                            <span className="pull-right">
                                { changeType }
                            </span>
                        </h3>
                    </div>

                    <div className={ panelBodyClasses } role="tabpanel">
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

function createValueElement(value, propKey) {
    if (["whoCreated", "whoModified", "whoOwner"].includes(propKey)) {
        return <Who who={value}/>;
    } else {
        return renderChange(value);
    }
}

function renderChange(value) {
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