import React from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import Error from './FieldErrorMessage';
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'

/**
 * Component used to display Input field in the form
 */
class FormInputField extends FormField {

    static propTypes = Object.assign({},{
        // Is input field multiline (true or false)
        multiline: PropTypes.bool,
        // Should input field work in password enter mode
        password: PropTypes.bool,
        // Placeholder
        placeholder: PropTypes.string
    },FormField.propTypes);

    /**
     * Method renders component on the screen
     * @returns Array Rendered component
     */
    render() {
        const props = this.getProps();
        const inputType = props.password ? 'password' : 'text';
        return [
            props.label ?
                <label className="control-label col-sm-2" key="f1">
                    {props.label}
                </label> : '',
            <div className={props.containerClass} style={props.containerStyle} key="f2">
                {!props.multiline ?
                    <input className={props.inputClass} style={props.inputStyle} value={props.value}
                           onChange={(value) => props.onChange(props.name, value)} type={inputType}
                            placeholder={props.placeholder}/> :
                    <textarea className={props.inputClass} style={props.inputStyle} value={props.value}
                              ref = {(ref) => this.ref = ref}
                              onChange={(value) => props.onChange(props.name, value)}/>
                }
                <Error fieldName={props.name} ownerProps={props.ownerProps} className={props.errorClass}
                       style={props.errorStyle}/>
            </div>
        ]
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.mulitline = result.mulitline ? result.multiline: false;
        result.password = result.password ? result.password : false;
        result.placeholder = result.placeholder ? result.placeholder : '';
        result.codeMirror = result.codeMirror ? result.codeMirror: null
        return result;
    }

    /**
     * Method runs after component appeared on the screen
     */
    componentDidMount() {
        const props = this.getProps();
        if (this.ref && props.codeMirror) {
            this.editor = CodeMirror.fromTextArea(this.ref,props.codeMirror)
            this.editor.on("change",() => {
               props.onChange(props.name,this.editor.getValue())
            })
        }
    }

    /**
     * Method runs each time when state data updated
     */
    componentDidUpdate() {
        const props = this.getProps();
        if (this.editor && !this.editor.getValue()) this.editor.setValue(props.value);
    }
}

export default FormInputField;