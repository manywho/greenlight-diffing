import React, { Component } from 'react';
import '../App.css';
import './DiffViewer.css';
import 'rc-tree/assets/index.css';
import Tree, { TreeNode } from 'rc-tree';
import { CHANGE_ADDITION, CHANGE_DELETION, CHANGE_MODIFICATION, CHANGE_UNKNOWN, determineChangeType } from '../Diffs';
import { createPrettyPathName, findName } from "../Paths";

class DiffTree extends Component {
    state = {
        selectedKeys: [],
        selectedNode: null
    };

    onClickNode = (keys, e) => {
        this.props.onClickNode(e.node.props.name, e.node.props.value, keys[0]);
    };

    renderChangeType = (key, value, index, path) => {
        switch (determineChangeType(value)) {
            case CHANGE_ADDITION:
                return <TreeNode key={ path } name={ key } title={ findName(this.props.snapshotB, path) } className="node-new" value={ value } />;
            case CHANGE_DELETION:
                return <TreeNode key={ path } name={ key } title={ findName(this.props.snapshotA, path) } className="node-deleted" value={ value } />;
            case CHANGE_MODIFICATION:
                return <TreeNode key={ path } name={ key } title={ findName(this.props.snapshotA, path) } className="node-modified" value={ value } />;
            case CHANGE_UNKNOWN:
                return null;
            default:
                if (value._t === "a") {
                    // Excluding _t here seems weird...
                    const tree = Object.entries(value).filter(([innerKey]) => innerKey !== "_t").map(([innerKey, innerValue], innerIndex) => {
                        return this.renderChangeType(key, innerValue, innerIndex, path + "." + innerKey);
                    });

                    return (
                        <TreeNode key={ path } name={ key } title={ findName(this.props.snapshotB, path) } value={ value }>
                            { tree }
                        </TreeNode>
                    )
                } else {
                    const tree = Object.entries(value).filter(([innerKey]) => innerKey !== "_t").map(([innerKey, innerValue], innerIndex) => {
                        return this.renderChangeType(innerKey, innerValue, innerIndex, path + "." + innerKey);
                    });

                    return (
                        <TreeNode key={ path } name={ key } title={ findName(this.props.snapshotB, path) } className="node-modified" value={ value }>
                            { tree }
                        </TreeNode>

                    )
                }
        }
    };

    renderTree = (diff, selectedElementType) => {
        let nodes;
        if (diff instanceof Array) {
            nodes = this.renderChangeType(selectedElementType, diff, 0, selectedElementType);
        } else {
            nodes = Object.entries(diff).filter(([innerKey]) => innerKey !== "_t").map(([key, value], index) => {
                return this.renderChangeType(key, value, index, selectedElementType + '.' + key);
            });
        }

        return <Tree className="text-capitalize" onSelect={ this.onClickNode } showIcon={ false }>{ nodes }</Tree>
    };

    render() {
        const diff = this.props.diff[this.props.selectedElementType];

        const tree = diff
            ? this.renderTree(diff, this.props.selectedElementType)
            : <ul><li>No changes</li></ul>;

        return (
            <div className="row">
                <div className="col-sm">
                    { tree }
                </div>
            </div>
        );
    }
}

export default DiffTree;
