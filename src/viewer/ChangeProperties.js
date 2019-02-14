import React, {Component} from 'react';

class ChangeProperties extends Component {
    state = {
        properties: [["Provides Files", "false", ""]]
    };

    render() {
        if (this.props.visible === false) {
            return (null);
        }

        let trProperties = [];

        this.state.properties.forEach((property) => trProperties.push(<tr><td>{property[0]}</td><td>{property[1]}</td><td>{property[2]}</td></tr>));

        return (
            <div className={"card card-properties"} >
                <div className="card-body">
                    <div className="panel panel-default">
                        <div className="panel-heading">Diferences</div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Property</th>
                                <th>Source</th>
                                <th>Target</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trProperties}
                            </tbody>
                        </table>
                    </div>
                    <code className={"api-path"}>API path: values/sfs/sfsf/s/f/s/fs///sf//sf</code>
                </div>
                <div className="card-footer text-right"><button className={"btn btn-link"} onClick={this.props.closeCallback}>Close</button></div>
            </div>
        );
    }
}

export default ChangeProperties;
