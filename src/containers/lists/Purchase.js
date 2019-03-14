import {connect} from "react-redux";
import {List} from '../../components/Components';
import DocumentListContainer from './Document';
import Models from '../../models/Models';

/**
 * Controller class for Purchase List component. Contains all methods and properties, which used by this module.
 */
export default class PurchaseListContainer extends DocumentListContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("purchase");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: params from component tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        const result = super.mapStateToProps(state,ownProps);
        return Object.assign(result, {
            "listColumns": this.getListColumns(["date","place","user"]),
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'date',direction:'ASC'}
        })
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            sync: () => this.sync()
        });
    }

    static getComponent() {
        const list = new PurchaseListContainer();
        return connect(list.mapStateToProps.bind(list),list.mapDispatchToProps.bind(list))(List.Purchase);
    }

    /**
     * "Sync" button onClick handler
     */
    sync() {
        this.model.sync(() => {
            this.updateList()
        })
    }
}