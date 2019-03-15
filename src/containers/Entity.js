import Store from '../store/Store';

/**
 * Controller class for Entity base component. Contains all methods and properties, which used by any model
 * management module
 */
class EntityContainer {

    constructor() {
        this.model = null;
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: properties, sent to item in tag
     * @returns Object of properties
     */
    mapStateToProps(state,ownProps) {
        return {
            model: this.model,
            isLogin: state.isLogin,
            isUpdating: state.isUpdating,
            errors: state.errors
        }
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return {
            getFieldLabels: () => this.getFieldLabels()
        }
    }

    /**
     * Method returns array of properties, the same array that available in this component
     * @returns Object of properties
     */
    getProps(inputState) {
        const state = inputState ? inputState : Store.getState();
        return this.mapStateToProps(state,null);
    }

    /**
     * Method used to get label texts for all item fields
     * @returns object where keys are field names and values are labels
     */
    getFieldLabels() {
        return this.model.getFieldLabels();
    }

}

export default EntityContainer;