/**
 * Controller class for Dimension Unit component. Contains all methods and properties, which used by this module.
 */
import EntityContainer from "./Entity";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';

export default class DimensionUnitItemContainer extends EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("dimensionUnit");
    }

    static getComponent() {
        const item = new DimensionUnitItemContainer();
        return connect(item.mapStateToProps.bind(item),item.mapDispatchToProps.bind(item))(Item.DimensionUnit);
    }
}