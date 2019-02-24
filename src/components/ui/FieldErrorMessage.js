import React from 'react';
import PropTypes from 'prop-types';
import ScreenComponent from './ScreenComponent';

/**
 * Component used to display Error message related to field
 */
class FieldErrorMessage extends ScreenComponent {

    static propTypes = Object.assign({},{
        fieldName: PropTypes.string.isRequired
    },ScreenComponent.propTypes);

    /**
     * Method to render component body
     */
    render() {
        const errors = this.props.ownerProps.errors;
        return errors[this.props.fieldName] && errors[this.props.fieldName].length ?
            <span className={this.props.className} style={this.props.style}>{errors[this.props.fieldName]}</span> : null
    }
}

export default FieldErrorMessage;