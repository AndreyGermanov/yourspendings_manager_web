/**
 * Controller class for Product Category Item component. Contains all methods and properties, which used by this module.
 */
import EntityContainer from "./Entity";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
const $ = require('jquery');

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
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            drawProductCategoryDropdownItem: this.drawProductCategoryDropdownItem
        });
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        super.updateItem(uid, () => {
            this.model.setListForDropdown(callback);
        })
    }

    /**
     * Method renders product category dropdown item
     * @param listItem - Selected dropdown item
     * @returns HTMLElement
     */
    drawProductCategoryDropdownItem(listItem) {
        if (!listItem.id) return null;
        let item = this.props.items.filter((it) => it.id === parseInt(listItem.id))[0];
        if (!item.item) return null;
        return $("<div style='margin-left:"+(10*parseInt(item.item.level))+"px'>"+item.text+"</div>")
    }
}