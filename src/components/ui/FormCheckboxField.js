import React from 'react';
import FormField from './FormField';

/**
 * Component used to display Checkbox field in the form
 */
class FormCheckboxField extends FormField {

    static propTypes = Object.assign({},{
    },FormField.propTypes);

    /**
     * Method renders component on the screen
     * @returns Array Rendered component
     */
    render() {
        const props = this.getProps();
        return [
            <input key={"cb_"+props.name+"_1"} style={{marginRight:5}}
                   onChange={(value) => props.onChange(props.name, value)} type="checkbox"
                   checked={props.value}/>,
            props.label ?
                <label key={"cb_"+props.name+"_2"}>
                    {props.label}
                </label> : ''
        ]
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        return result;
    }
}

export default FormCheckboxField;