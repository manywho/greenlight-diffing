import React, {Component} from 'react';
import snapshotA from './../snapshotA';
import snapshotB from './../snapshotB';
import './SnapSelector.css';

class SnapSelector extends Component {
    state = {
        selectedSource: false,
        selectedTarget: false,
        sourcePosition: undefined,
        overItem: undefined,
    };

    setSnapShot = (snapshot, position) => {
        console.log("login setSnapShot");
        console.log(position);
        console.log(this.state.sourcePosition);

        if (this.state.selectedSource === true && position === this.state.sourcePosition) {
            //  clean source
            this.setState({selectedSource: false, selectedTarget: false, sourcePosition: undefined});
            this.props.cleanSelected();
        } else if (this.state.selectedSource === true) {
            this.props.setTarget(snapshot);
            this.setState({selectedTarget: true})
        } else {
            this.props.setSource(snapshot);
            this.setState({selectedSource: true, sourcePosition: position})
        }
    };

    renderSelection = (position) => {
        if (this.state.overItem !== undefined && this.state.overItem === this.state.sourcePosition && this.state.overItem === position) {
            return "-(source)-";
        } else if (this.state.sourcePosition === position) {
            return "(source)";
        } else if (this.state.overItem === position && this.state.sourcePosition !== undefined) {
            return "(target)";
        } else if (this.state.overItem === position  && this.state.sourcePosition === undefined) {
            return "(source)";
        } else {
            return "";
        }
    };

    render() {
        return (<div className="panel panel-default selector-panel">
                    <div className="panel-heading"><h2>CORE-4734: One of Everything</h2></div>
                    <div className="panel-body">
                        <ul className="list-unstyled menu-sanpshot">
                            <li><span><a className={"selected-source"} onMouseOver={()=> this.setState({overItem: 0})} onMouseLeave={()=> this.setState({overItem: undefined})}  onClick={() => {this.setSnapShot(snapshotA, 0)}}> Snapshot 2019-02-11 11:04:16 {this.renderSelection(0)} </a></span></li>
                            <li><span><a className={"selected-target"} onMouseOver={()=> this.setState({overItem: 1})} onMouseLeave={()=> this.setState({overItem: undefined})}  onClick={() => {this.setSnapShot(snapshotB, 1)}}> Snapshot 2019-02-11 11:55:18 {this.renderSelection(1)} </a></span></li>
                        </ul>
                    </div>
            </div>);
    }
}

export default SnapSelector;