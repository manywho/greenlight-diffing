import React, {Component} from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import DiffTree from "./DiffTree";
import 'bootstrap/dist/css/bootstrap.css';

class DiffViewer extends Component {

    render() {
        let mapsLink = <li className=""><span className="glyphicon glyphicon-th"></span><span>Maps</span></li>;
        let macrosLink = <li className=""><span className="glyphicon glyphicon-cog"></span><span>Macros</span></li>;
        let servicesLink = <li className=""><span className="glyphicon glyphicon-transfer"></span><span>Services</span></li>;
        let flowLink = <li className=""><span className="glyphicon glyphicon-leaf"></span><span>Flow</span></li>;
        let pagesLink = <li className=""><span className="glyphicon glyphicon-record"></span><span>Pages</span></li>;
        let valuesLink = <li className=""><span className="glyphicon glyphicon-transfer"></span><span>Values</span></li>;
        let navigationLink = <li className=""><span className="glyphicon glyphicon-object-align-top"></span><span>Navigation</span></li>;
        let groupsLink = <li className=""><span className="glyphicon glyphicon-tasks"></span><span>Groups</span></li>;
        let typesLink = <li className=""><span className="glyphicon glyphicon-option-vertical"></span><span>Types</span></li>;

        if(this.props.rootModifications.mapElements) {
            mapsLink = <li className="active"><span className="glyphicon glyphicon-th"></span><span><a href={"#"}> Maps</a></span></li>;
        }

        if(this.props.rootModifications.macroElements) {
            macrosLink = <li className="active"><span className="glyphicon glyphicon-cog"></span><span><a href={"#"}> Macros</a></span></li>
        }

        if(this.props.rootModifications.serviceElements) {
            servicesLink = <li className=""><span className="glyphicon glyphicon-transfer"></span><span><a href={"#"}> Services</a></span></li>;
        }

        if(this.props.rootModifications.flow) {
            flowLink = <li className="active"><span className="glyphicon glyphicon-th"></span><span><a href={"#"}> Flow</a></span></li>;
        }

        if(this.props.rootModifications.pagesLink) {
            pagesLink = <li className=""><span className="glyphicon glyphicon-record"></span><span><a href={"#"}>Pages</a></span></li>;
        }

        if(this.props.rootModifications.valuesLink) {
            pagesLink = <li className=""><span className="glyphicon glyphicon-transfer"></span><span><a href={"#"}>Values</a></span></li>;
        }

        if(this.props.rootModifications.navigationLink) {
            navigationLink = <li className=""><span className="glyphicon glyphicon-object-align-top"></span><span><a href={"#"}> Navigation</a></span></li>;
        }

        if(this.props.rootModifications.groupsLink) {
            groupsLink = <li className=""><span className="glyphicon glyphicon-tasks"></span><span><a href={"#"}> Groups</a></span></li>;
        }

        if(this.props.rootModifications.typesLink) {
            typesLink = <li className=""><span className="glyphicon glyphicon-option-vertical"></span><span><a href={"#"}> Types</a></span></li>;
        }

        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-sm-3"}><h3>Flow Target Name</h3></div>
                    <div className={"col-sm-9"}><h3 style={{textAlign: "right"}}>2019-02-11 11:13:47 compared to 2019-02-11 12:10:47</h3></div>
                </div>
                <div className={"row"}>
                    <div className={"col-sm-3"}>
                        <ul className="list-unstyled menu-diff">
                            {flowLink}
                            {mapsLink}
                            {pagesLink}
                            {valuesLink}
                            {navigationLink}
                            {groupsLink}
                            {servicesLink}
                            {macrosLink}
                            {typesLink}
                        </ul>
                    </div>
                    <div className={"col-sm-9"}>
                        <h4 className={"diff-description-body"}>Value Modifications</h4>

                        <div>
                            <p>The differences in the snapshots are shown as follow: <span className={"node-modified"}>Modified Node</span>, <span className={"node-new"}>New Node</span> and <span className={"node-deleted"}>Deleted Node</span>.
                                When you have a <span className={"node-path"}>Gray Node</span> it means that that node doesn't have any modification but some of the child have been modified, deleted or created.</p>
                        </div>
                        <DiffTree/>
                        <code>API path: values/sfs/sfsf/s/f/s/fs///sf//sf</code>
                    </div>
                </div>
            </div>
        );
    }
}

export default DiffViewer;
