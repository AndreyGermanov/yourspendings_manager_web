import React from 'react';
import _ from 'lodash';
import ScreenComponent from './ScreenComponent';
import PropTypes from 'prop-types'

/**
 * Component which renders button
 */
class Button extends ScreenComponent {

    static propTypes = Object.assign({},{
        // Text of button
        text: PropTypes.string,
        // Style of button view
        style: PropTypes.object,
        // Button click handler
        onPress: PropTypes.func,
        // Class of button
        className: PropTypes.string,
        // Class of button icon
        iconClass: PropTypes.string
    },ScreenComponent.propTypes);

    /**
     * Method which shows component on the screen
     * @returns Rendered component
     */
    render() {
        const props = this.getProps();
        return (
            <a className={props.className} style={props.style}
               onClick={() => props.onPress()}>
                {props.iconClass ? <i className={props.iconClass} style={{paddingRight:'5px'}}/> : null }
                {props.text}
            </a>
        )
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        const props = super.getProps();
        const result = _.cloneDeep(props);
        result.text = props.text ? props.text : '';
        result.style = Object.assign({cursor:'pointer'},result.style ? result.style : {});
        result.className = result.className ? result.className: "btn btn-primary";
        result.iconClass = result.iconClass ? result.iconClass : "";
        result.onPress = props.onPress ? props.onPress : () => null;
        return result;
    }
}

export default Button;