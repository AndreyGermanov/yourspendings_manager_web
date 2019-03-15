import {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Component used to define any component which should be displayed on the screen
 * and have link to owning component properties
 */
class ScreenComponent extends Component {

    static propTypes = {
        ownerProps: PropTypes.object // Link to "props" of owner component
    };
    /**
     * Method to render component body of component
     */
    render() {
        return null
    }

    /**
     * Method used to fill default values for "props" of component
     * @returns this.props filled with default values
     */
    getProps() {
        return Object.assign({},this.props);
    }

}

export default ScreenComponent;