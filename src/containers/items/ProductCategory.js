/**
 * Controller class for Product Category Item component. Contains all methods and properties, which used by this module.
 */
import EntityContainer from "./Entity";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';

export default class ProductCategoryItemContainer extends EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("productCategory");
    }

    static getComponent() {
        const productCategory = new ProductCategoryItemContainer();
        return connect(productCategory.mapStateToProps.bind(productCategory),productCategory.mapDispatchToProps.bind(productCategory))(Item.ProductCategory);
    }
}