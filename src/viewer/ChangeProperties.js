import React, {Component} from 'react';

class ChangeProperties extends Component {
    render() {
        if (this.props.visible === false) {
            return (null);
        }

        return (
            <div className={"card"} >
                <div className="card-body">
                    <div className="panel panel-default">
                        <div className="panel-heading">Diferences</div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Property</th>
                                <th>Source Value</th>
                                <th>Target Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Provides Files</td>
                                <td>false</td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer text-right"><button className={"btn btn-link"} onClick={this.props.closeCallback}>Close</button></div>
            </div>
        );
    }
}

export default ChangeProperties;
