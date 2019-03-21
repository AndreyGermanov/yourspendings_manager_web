import ProductCategoryContainer from './ProductCategory'
import RoleContainer from './Role';
import UserContainer from './User';
import ShopContainer from './Shop';
import PurchaseUserContainer from './PurchaseUser';
import DiscountContainer from './Discount';
import PurchaseContainer from './Purchase';
import DimensionUnitContainer from './DimensionUnit';
import ReportContainer from './Report';

/**
 * Factory to get instances of List containers and connected components
 */
export class Lists {

    static instances = {};

    static createInstanceOf(modelName) {
        switch (modelName) {
            case "productCategory": return new ProductCategoryContainer();
            case "role": return new RoleContainer();
            case "user": return new UserContainer();
            case "shop": return new ShopContainer();
            case "purchaseUser": return new PurchaseUserContainer();
            case "discount": return new DiscountContainer();
            case "purchase": return new PurchaseContainer();
            case "dimensionUnit": return new DimensionUnitContainer();
            case "report": return new ReportContainer();
            default: return null;
        }
    }

    /**
     * Returns instance of List view container for specified database model
     * @param modelName: Name of model
     */
    static getInstanceOf(modelName) {
        if (!Lists.instances[modelName])
            Lists.instances[modelName] = Lists.createInstanceOf(modelName);
        return Lists.instances[modelName];
    }

    static getComponentOf(modelName) {
        switch (modelName) {
            case "productCategory": return ProductCategoryContainer.getComponent();
            case "role": return RoleContainer.getComponent();
            case "user": return UserContainer.getComponent();
            case "shop": return ShopContainer.getComponent();
            case "purchaseUser": return PurchaseUserContainer.getComponent();
            case "discount": return DiscountContainer.getComponent();
            case "purchase": return PurchaseContainer.getComponent();
            case "dimensionUnit": return DimensionUnitContainer.getComponent();
            case "report": return ReportContainer.getComponent();
            default: return null;
        }
    }
}