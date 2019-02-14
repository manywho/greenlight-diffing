import React, { Component } from 'react';
import classNames from 'classnames';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, CHANGE_UNKNOWN, determineChangeType } from "./Diffs";
import MapElementDiff from "./MapElementDiff";

export default class MapElement extends Component {
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

        let name;

        const changeType = determineChangeType(item);

        switch (changeType) {
            case CHANGE_ADDITION:
                name = item[0].developerName;
                break;
            case CHANGE_DELETION:
                name = item[0].developerName;
                break;
            case CHANGE_MODIFICATION:
                name = "?";
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

        return (
            <div className="panel-group" role="tablist" aria-multiselectable={ false }>
                <div className={ panelClasses }>
                    <div className="panel-heading" role="tab">
                        <h3 className="panel-title">
                            <a role="button" data-toggle="collapse" aria-expanded="false" onClick={ this.onToggleCollapse }>
                                Map Element: <strong>{ name }</strong>
                            </a>

                            <span className="pull-right">
                                { changeType }
                            </span>
                        </h3>
                    </div>

                    <div className={ panelBodyClasses } role="tabpanel">
                        <MapElementDiff item={ this.props.item } path={ this.props.path } />
                    </div>
                </div>
            </div>
        )
    }
}
