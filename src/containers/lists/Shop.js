import {connect} from "react-redux";
import {List} from '../../components/Components';
import EntityListContainer from './Entity';
import Models from '../../models/Models';

/**
 * Controller class for Shop List component. Contains all methods and properties, which used by this module.
 */
export default class ShopListContainer extends EntityListContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("shop");
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
            "listColumns": this.getListColumns(["name","latitude","longitude","user"]),
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'name',direction:'ASC'}
        })
    }

    static getComponent() {
        const list = new ShopListContainer();
        return connect(list.mapStateToProps.bind(list),list.mapDispatchToProps.bind(list))(List.Shop);
    }
}