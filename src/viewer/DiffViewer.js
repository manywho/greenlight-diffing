import React, {Component} from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import DiffTree from "./DiffTree";
import Moment from 'react-moment';
import { createPrettyPathName } from "../Paths";
import { renderDelta } from "../App";

const MenuLink = ({ active, element, icon, onClick, title }) => {
    const className = active === element
        ? ' active'
        : '';

    return (
        <li>
            <button className={ "btn btn-transparent" + className } onClick={ () => onClick(element) }>
                <span className={ "glyphicon glyphicon-" + icon } />
                <span>{ title }</span>
            </button>
        </li>
    )
};

class DiffViewer extends Component {

    state = {
        selectedElementType: '',
        selectedNodeKey: '',
        selectedNodeValue: []
    };

    onClickMenuLink = (elementType) => {
        this.setState({
            selectedElementType: elementType
        })
    };

    onClickNode = (key, value) => {
        this.setState({
            selectedNodeKey: key,
            selectedNodeValue: value
        })
    };

    simplifyDate = (dateString) => {
        return <Moment format="D MMM YYYY hh:mm" withTitle>{dateString}</Moment>
    }

    render() {
        let mapsLink = <MenuLink active={ this.state.selectedElementType } icon="globe" title="Maps" element="mapElements" onClick={ this.onClickMenuLink } />;
        let macrosLink = <MenuLink active={ this.state.selectedElementType } icon="cog" title="Macros" element="macroElements" onClick={ this.onClickMenuLink } />;
        let servicesLink = <MenuLink active={ this.state.selectedElementType } icon="transfer" title="Service" element="serviceElements" onClick={ this.onClickMenuLink } />;
        let flowLink = <MenuLink active={ this.state.selectedElementType } icon="leaf" title="Flow" element="flow" onClick={ this.onClickMenuLink } />;
        let pagesLink = <MenuLink active={ this.state.selectedElementType } icon="th" title="Pages" element="pageElements" onClick={ this.onClickMenuLink } />;
        let valuesLink = <MenuLink active={ this.state.selectedElementType } icon="record" title="Values" element="valueElements" onClick={ this.onClickMenuLink } />;
        let navigationLink = <MenuLink active={ this.state.selectedElementType } icon="object-align-top" title="Navigations" element="navigationElements" onClick={ this.onClickMenuLink } />;
        let groupsLink = <MenuLink active={ this.state.selectedElementType } icon="tasks" title="Groups" element="groupElements" onClick={ this.onClickMenuLink } />;
        let tagsLink = <MenuLink active={ this.state.selectedElementType } icon="tags" title="Tags" element="tagElements" onClick={ this.onClickMenuLink } />;
        let typesLink = <MenuLink active={ this.state.selectedElementType } icon="option-vertical" title="Types" element="typeElements" onClick={ this.onClickMenuLink } />;

        let tree = null;

        if (this.state.selectedElementType) {
            tree = (
                <div>
                    <h4 className={"diff-description-body"}>{ createPrettyPathName(this.state.selectedElementType) } Modifications</h4>

                    <DiffTree diff={ this.props.diff } onClickNode={ this.onClickNode } selectedElementType={ this.state.selectedElementType } />

                    <div>
                        <p>The differences in the snapshots are shown as follow: <span className={"node-modified"}>Modified Node</span>, <span className={"node-new"}>New Node</span> and <span className={"node-deleted"}>Deleted Node</span>.
                            When you have a <span className={"node-path"}>Gray Node</span> it means that that node doesn't have any modification but some of the child have been modified, deleted or created.</p>
                    </div>
                </div>
            )
        }

        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-sm-6"}><h3>{this.props.targetTitle}</h3></div>
                    <div className={"col-sm-6"}><h3 style={{textAlign: "right"}}>{this.simplifyDate(this.props.sourceDate)} compared to {this.simplifyDate(this.props.targetDate)}</h3></div>
                </div>
                <div className={"row"}>
                    <div className={"col-sm-2"}>
                        <ul className="list-unstyled menu-diff">
                            {flowLink}
                            {mapsLink}
                            {pagesLink}
                            {valuesLink}
                            {navigationLink}
                            {groupsLink}
                            {servicesLink}
                            {macrosLink}
                            {tagsLink}
                            {typesLink}
                        </ul>
                    </div>
                    <div className={"col-sm-7"} >
                        <div>
                            { renderDelta(this.state.selectedNodeValue) }
                        </div>
                    </div>
                    <div className={"col-sm-3"}>
                        { tree }
                    </div>
                </div>
            </div>
        );
    }
}

export default DiffViewer;
