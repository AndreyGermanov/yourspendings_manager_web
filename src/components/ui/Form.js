import ScreenComponent from './ScreenComponent';
import InputField from './FormInputField';
import CheckboxField from './FormCheckboxField';
import SelectField from './FormSelectField';
import DateTimeField from './FormDateTimeField';
import ButtonComponent from './Button';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Container component used to render form
 */
export default class Form extends ScreenComponent {

    static propTypes = Object.assign({},{
        // Styles of object
        style: PropTypes.object,
        className: PropTypes.string
    },ScreenComponent.propTypes);

    /**
     * Method used to render component
     * @returns Rendered component
     */
    render() {
        const self = this;
        const props = this.getProps();
        return (
            <form className={props.className} style={props.style}>
                {React.Children.map(self.props.children, child => {
                    return <div {...child.props}>{self.setOwnerProps(child)}</div>;
                },this)}
            </form>
        )
    }

    /**
     * Method used to set ownerProps of current component to provided element and to all children recursively
     * @param element: Source element
     * @returns {Object} Element with ownerProps option appended
     */
    setOwnerProps(element) {
        const self = this;
        const props = this.getProps();
        return React.Children.map(element.props.children, child => {
            if (!child || !child.props || child.type === 'label' || child.type === 'a' || child.type === 'div') {
                return child;
            } else if (!child.props["ownerProps"]) {
                if (child.children) {
                    const clone_element =  React.cloneElement(child,{ownerProps:props.ownerProps});
                    const children = self.setOwnerProps(clone_element);
                    return <clone_element {...clone_element.props}>{children}</clone_element>
                } else {
                    return React.cloneElement(child,{ownerProps:props.ownerProps});
                }
            } else {
                if (child.children) {
                    return self.setOwnerProps(child);
                } else {
                    return child;
                }
            }
        },this)
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        let result = super.getProps();
        result.style = result.style ? result.style : {};
        result.className = result.className ? result.className: 'form-horizontal';
        return result;
    }
}

export const Input = InputField;
export const Select = SelectField;
export const DateTime = DateTimeField;
export const Button = ButtonComponent;
export const Checkbox = CheckboxField;