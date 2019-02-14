import React, {Component} from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import DiffTree from "./DiffTree";
import ChangeProperties from "./ChangeProperties";
import { createPrettyPathName } from "../Paths";

const MenuLink = ({ element, icon, onClick, title }) => {
    return (
        <li>
            <a onClick={ () => onClick(element) }>
                <span className={ "glyphicon glyphicon-" + icon } />
                <span>{ title }</span>
            </a>
        </li>
    )
};

class DiffViewer extends Component {

    state = {
        selectedElementType: '',
        selectedNodeKey: '',
        selectedNodeValue: [],
        showProperties: true
    };


    closeDescription = () => {
        this.setState({showProperties: false})
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

    render() {
        let mapsLink = <MenuLink icon="globe" title="Maps" element="mapElements" onClick={ this.onClickMenuLink } />;
        let macrosLink = <MenuLink icon="cog" title="Macros" element="macroElements" onClick={ this.onClickMenuLink } />;
        let servicesLink = <MenuLink icon="transfer" title="Service" element="serviceElements" onClick={ this.onClickMenuLink } />;
        let flowLink = <MenuLink icon="leaf" title="Flow" element="flow" onClick={ this.onClickMenuLink } />;
        let pagesLink = <MenuLink icon="th" title="Pages" element="pageElements" onClick={ this.onClickMenuLink } />;
        let valuesLink = <MenuLink icon="record" title="Values" element="valueElements" onClick={ this.onClickMenuLink } />;
        let navigationLink = <MenuLink icon="object-align-top" title="Navigations" element="navigationElements" onClick={ this.onClickMenuLink } />;
        let groupsLink = <MenuLink icon="tasks" title="Groups" element="groupElements" onClick={ this.onClickMenuLink } />;
        let tagsLink = <MenuLink icon="tags" title="Tags" element="tagElements" onClick={ this.onClickMenuLink } />;
        let typesLink = <MenuLink icon="option-vertical" title="Types" element="typeElements" onClick={ this.onClickMenuLink } />;

        let tree;

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
        } else {
            tree = (
                <div>

                </div>
            );
        }

        console.log('poop', this.state.selectedNodeValue);

        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-sm-3"}><h3>Flow Target Name</h3></div>
                    <div className={"col-sm-9"}><h3 style={{textAlign: "right"}}>2019-02-11 11:13:47 compared to 2019-02-11 12:10:47</h3></div>
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
                        {/*<ChangeProperties visible={this.state.showProperties} closeCallback={this.closeDescription}/>*/}
                        <div>
                            from { JSON.stringify(this.state.selectedNodeValue[0]) } to { JSON.stringify(this.state.selectedNodeValue[1]) }
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
