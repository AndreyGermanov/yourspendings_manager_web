import React from 'react';
import PropTypes from 'prop-types';
import Error from './FieldErrorMessage';
import FormField from './FormField';
import 'jquery'
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
const jQuery = require("jquery");

/**
 * Component used to display Dropdown field in the form
 */
class FormSelectField extends FormField {

    static propTypes = Object.assign({}, {
        // Array of items to choose from. Each item is an object of format {value:"",label:""}
        items: PropTypes.array.isRequired,
        multiple: PropTypes.bool,
        templateResult:PropTypes.func
    },FormField.propTypes);

    /**
     * Method renders component on the screen
     * @returns Array Rendered component
     */
    render() {
        const props = this.getProps();
        let options = {};
        if (typeof(props.templateResult) === "function") {
            options["templateResult"] = props.templateResult.bind(this);
        }
        return [
            props.label ?
            <label className={props.labelClass} style={props.labelStyle} key="f1">
                {props.label}
            </label> : '',
            <div className={props.containerClass} style={props.containerStyle} key="f2">
                <Select2 ref="select2" value={props.value} style={props.inputStyle} options={options}
                         className={props.inputClass} data={props.items} multiple={props.multiple}
                         onClose={() => props.onClose()}
                         onSelect={() => props.onChange(props.name,jQuery(this.refs.select2.el).val())}
                         onUnselect={() => props.onChange(props.name,jQuery(this.refs.select2.el).val())}/>
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
        result.items = result.items ? result.items: [];
        result.multiple = result.multiple ? result.multiple : false;
        result.onClose = result.onClose ? result.onClose: () => {}
        return result;
    }

    /**
     * Utility method which used to return item of list by value
     * @param value: Value to search
     * @param items: Array of dropdown items to search in Each item is {value:'',label:''}
     * @returns {*}
     */
    static getItemByValue(value,items) {
        for (let i in items) {
            if (!items.hasOwnProperty(i))
                continue;
            if (items[i].id === value) {
                return items[i]
            }
        }
        return null;
    }
}

export default FormSelectField;