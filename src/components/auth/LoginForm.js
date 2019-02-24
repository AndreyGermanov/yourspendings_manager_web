import React,{Component} from 'react'
import SimpleFormField from '../ui/SimpleFormField'

export default class LoginForm extends Component {

    render() {
        return (
            <div className="panel panel-primary col-md-6 screen-center">
                <div className="panel-heading">
                    <div className="panel-title">Login</div>
                </div>
                <div className="panel-body">
                    {this.props.errors.general ?
                        <div className="alert alert-danger">{this.props.errors.general}</div>
                    : ""}
                    <form className="form-horizontal">
                        <SimpleFormField name="loginName" type="text" label="Login" value={this.props.loginName}/>
                        <SimpleFormField name="loginPassword" type="password" label="Password" value={this.props.loginPassword}/>
                        <a className="btn btn-primary" onClick={()=>this.props.login()}>Login</a>
                    </form>
                </div>
            </div>
        )
    }
}