import React, { Component } from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import Tree, { TreeNode } from 'rc-tree';
import ChangeProperties from './ChangeProperties';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, CHANGE_UNKNOWN, determineChangeType } from '../Diffs';
import { createPrettyPathName } from "../Paths";

class DiffTree extends Component {
    state = {
        selectedKeys: [],
        selectedNode: null,
        showDescription: false
    };

    onSelect = (selectedKeys) => {
        if (selectedKeys[0] === "0-1") {
            this.setState({ selectedNode: "flow" });
        } else if (selectedKeys[0] === "0-0-0-0") {
            this.setState({ selectedNode: "service1", showDescription: true });
        } else if (selectedKeys[0] === "0-0-0-1") {
            this.setState({ selectedNode: "service2" });
        } else if (selectedKeys[0] === "0-0-0-2") {
            this.setState({ selectedNode: "service3" });
        } else {
            this.setState({ selectedNode: "none" });
        }

        console.log(selectedKeys);
    };

    closeDescription = () => {
        this.setState({ showDescription: false })
    };

    renderChangeType = (key, value, index) => {
        console.error(key, index);

        const title = createPrettyPathName(key);

        switch (determineChangeType(value)) {
            case CHANGE_ADDITION:
                return <TreeNode title={ title } className="node-new" />;
            case CHANGE_DELETION:
                return <TreeNode title={ title } className="node-deleted" />;
            case CHANGE_MODIFICATION:
                return <TreeNode title={ title } className="node-modified" />;
            case CHANGE_UNKNOWN:
                // console.log('unknown', key, value);
                return null;
            default:
                if (value._t === "a") {
                    // Excluding _t here seems weird...
                    const tree = Object.entries(value).filter(([innerKey]) => innerKey !== "_t").map(([innerKey, innerValue], innerIndex) => {
                        return this.renderChangeType(key, innerValue, innerIndex);
                    });

                    return (
                        <TreeNode title={ key }>
                            { tree }
                        </TreeNode>
                    )
                } else {
                    const tree = Object.entries(value).filter(([innerKey]) => innerKey !== "_t").map(([innerKey, innerValue], innerIndex) => {
                        return this.renderChangeType(innerKey, innerValue, innerIndex);
                    });

                    return (
                        <TreeNode title={ index } className="node-modified">
                            { tree }
                        </TreeNode>

                    )
                }
        }
    };

    renderTree = (diff, selectedElementType) => {
        console.warn(diff);

        let nodes;
        if (diff instanceof Array) {
            nodes = this.renderChangeType(selectedElementType, diff, 0);
        } else {
            nodes = Object.entries(diff).filter(([innerKey]) => innerKey !== "_t").map(([key, value], index) => {
                return this.renderChangeType(key, value, index);
            });
        }

        return <Tree>{ nodes }</Tree>
    };

    render() {
        let flow = <div className="description-node"></div>

        let service2 = <div className="description-node"></div>

        let service3 = <div className="description-node"></div>

        var none = <div></div>
        var showNode = none;
        if (this.state.selectedNode === "flow") {
            showNode = flow
        } else if (this.state.selectedNode === "service1") {
            showNode =
                <ChangeProperties visible={ this.state.showDescription } closeCallback={ this.closeDescription } />;

        } else if (this.state.selectedNode === "service2") {
            showNode = service2;

        } else if (this.state.selectedNode === "service3") {
            showNode = service3;

        } else {
            showNode = none;
        }

        const tree = this.props.selectedElementType
            ? this.renderTree(this.props.diff[this.props.selectedElementType], this.props.selectedElementType)
            : <div>nothing selected</div>;

        return (
            <div className="row">
                <div className="col-sm">
                    { tree }

                    {/*<Tree onSelect={ this.onSelect }*/}
                          {/*defaultExpandAll showLine={ false } showIcon={ false } className={ "fixo" }>*/}
                        {/*<TreeNode title="Course Registration Flow" key="0-1" className={ "node-modified" }>*/}

                            {/*<TreeNode title="Authorization" disabled={ true } />*/}
                            {/*<TreeNode title="Group Elements" disabled={ true } />*/}
                            {/*<TreeNode title="Map Elements" disabled={ true }>*/}
                                {/*<TreeNode title="Outcomes" key="0-0-0-0" className={ "node-modified" }>*/}
                                    {/*<TreeNode title="Control Points" className={ "node-deleted" } />*/}
                                {/*</TreeNode>*/}
                            {/*</TreeNode>*/}
                            {/*<TreeNode title="Navigation Elements" disabled={ true } />*/}
                            {/*<TreeNode title="Page Elements" disabled={ true } />*/}
                            {/*<TreeNode title="Service Elements" key="0-1-1" selectable={ false } disabled={ true }>*/}
                                {/*<TreeNode title="Service Element" key="0-0-0-0" className={ "node-modified" } />*/}
                                {/*<TreeNode title="Service Element" className={ "node-deleted" } />*/}
                                {/*<TreeNode title="Service Element" className={ "node-new" } />*/}
                            {/*</TreeNode>*/}
                            {/*<TreeNode title="Type Elements" disabled={ true } />*/}
                            {/*<TreeNode title="Tag Elements" disabled={ true } />*/}
                            {/*<TreeNode title="Value Elements" disabled={ true }>*/}
                                {/*<TreeNode title="Value Element - US States" key="0-0-0-0" className={ "node-modified" }>*/}
                                    {/*<TreeNode title="Default ObjectData" className={ "node-deleted" }>*/}
                                        {/*<TreeNode title={ "Object Data - Drop Down" }>*/}
                                            {/*<TreeNode title="Properties" className={ "node-deleted" }>*/}
                                                {/*<TreeNode title="Property - Value" className={ "node-deleted" }>*/}

                                                {/*</TreeNode>*/}
                                            {/*</TreeNode>*/}
                                        {/*</TreeNode>*/}
                                    {/*</TreeNode>*/}
                                {/*</TreeNode>*/}
                            {/*</TreeNode>*/}

                        {/*</TreeNode>*/}
                    {/*</Tree>*/}
                </div>
                <div className="col-sm">
                    { showNode }
                </div>
            </div>
        );
    }
}

export default DiffTree;
