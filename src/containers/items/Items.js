import ProductCategoryContainer from './ProductCategory';
import RoleContainer from './Role';
import UserContainer from './User';

/**
 * Factory to get instances of Item containers and connected components
 */
export class Items {

    // Cache of created instances
    static instances = {};

    static createInstanceOf(modelName) {
        switch (modelName) {
            case "productCategory": return new ProductCategoryContainer();
            case "role": return new RoleContainer();
            case "user": return new UserContainer();
            default: return null;
        }
    }

    /**
     * Returns instance of Detail view container for specified database model
     * @param modelName: Name of model
     */
    static getInstanceOf(modelName) {
        if (!Items.instances[modelName])
            Items.instances[modelName] = Items.createInstanceOf(modelName);
        return Items.instances[modelName];
    }

    /**
     * Returns instance of wired Container component
     * @param modelName: Name of model
     */
    static getComponentOf(modelName) {
        switch (modelName) {
            case "productCategory": return ProductCategoryContainer.getComponent();
            case "role": return RoleContainer.getComponent();
            case "user": return UserContainer.getComponent();
            default: return null;
        }
    }

}