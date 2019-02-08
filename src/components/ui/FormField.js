import React,{Component} from 'react';
import Store from '../../store/Store';

export default class FormField extends Component {
    render() {
        const errors = Store.getState()["errors"];
        return (
            <div className="form-group">
                <label className="control-label col-md-2">{this.props.label}</label>
                <div className="col-md-10">
                    <input type={this.props.type} className="form-control" value={this.props.value}
                           onChange={(e)=> Store.changeProperty(this.props.name,e.target.value)}/>
                    <span className="error">{errors[this.props.name]}</span>
                </div>
            </div>
        )
    }
}