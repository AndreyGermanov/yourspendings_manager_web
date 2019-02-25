import ProductCategoryContainer from './ProductCategory'
import RoleContainer from './Role';

/**
 * Factory to get instances of List containers and connected components
 */
export class Lists {

    static instances = {};

    static createInstanceOf(modelName) {
        switch (modelName) {
            case "productCategory": return new ProductCategoryContainer();
            case "role": return new RoleContainer();
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
            default: return null;
        }
    }
}