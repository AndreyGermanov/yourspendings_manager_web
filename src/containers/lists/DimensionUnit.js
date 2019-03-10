import {connect} from "react-redux";
import {List} from '../../components/Components';
import EntityListContainer from './Entity';
import Models from '../../models/Models';

/**
 * Controller class for Discount List component. Contains all methods and properties, which used by this module.
 */
export default class DimensionUnitListContainer extends EntityListContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("dimensionUnit");
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
            "listColumns": this.getListColumns(["name"]),
            "sortOrder": (result["sortOrder"] && result["sortOrder"].field) ?
                result["sortOrder"] : {field:'name',direction:'ASC'}
        })
    }

    static getComponent() {
        const list = new DimensionUnitListContainer();
        return connect(list.mapStateToProps.bind(list),list.mapDispatchToProps.bind(list))(List.DimensionUnit);
    }
}