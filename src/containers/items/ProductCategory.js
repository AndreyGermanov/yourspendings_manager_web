/**
 * Controller class for Product Category Item component. Contains all methods and properties, which used by this module.
 */
import EntityContainer from "./Entity";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
import Store from "../../store/Store";

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

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Parameters from component's tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            "categories_list": state.categories_list ? state.categories_list : []
        })
    }
    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        super.updateItem(uid, () => {
            this.getCategoriesList((categories_list) => {
                Store.changeProperty('categories_list', categories_list);
            })
        })
    }

    /**
     * Method used to fetch list of product categories from backend and populate appropriate property in state
     * which then used to display list of product categories in dropdowns
     * @param callback
     */
    getCategoriesList(callback) {
        if (!callback) callback = () => null;
        const ProductCategory = Models.getInstanceOf("productCategory");
        ProductCategory.getList({}, function(err, response) {
            let categories_list = [];
            if (err || typeof(response) !== "object") {
                Store.changeProperty('categories_list', categories_list);
                callback();
                return;
            }
            categories_list = [{id:0,text:""}].concat(
                response.map(function (item) {
                    return {id: item['uid'], text: item["name"]};
                })
            );
            callback(categories_list);
        });
    }
}