import React, {Component} from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import DiffTree from "./DiffTree";
import 'bootstrap/dist/css/bootstrap.css';

class DiffViewer extends Component {

    render() {
        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-sm-3"}><h3>Flow Target Name</h3></div>
                    <div className={"col-sm-9"}><h3 style={{textAlign: "left"}}>2019-02-11 11:13:47 compared to 2019-02-11 12:10:47</h3></div>
                </div>
                <div className={"row"}>
                    <div className={"col-sm-3"}>
                        <ul className="list-unstyled menu-diff">
                            <li className="active"><span className="glyphicon glyphicon-leaf"></span><span><a href={"aa"}>Flow</a></span></li>
                            <li className=""><span className="glyphicon glyphicon-th"></span><span>Maps</span></li>
                            <li className=""><span className="glyphicon glyphicon-record"></span><span>Pages</span></li>
                            <li className=""><span className="glyphicon glyphicon-transfer"></span><span>Values</span></li>
                            <li className=""><span className="glyphicon glyphicon-object-align-top"></span><span>Navigation</span></li>
                            <li className=""><span className="glyphicon glyphicon-tasks"></span><span>Groups</span></li>
                            <li className=""><span className="glyphicon glyphicon-transfer"></span><span>Services</span></li>
                            <li className=""><span className="glyphicon glyphicon-cog"></span><span>Macros</span></li>
                            <li className=""><span className="glyphicon glyphicon-option-vertical"></span><span>Types</span></li>
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
