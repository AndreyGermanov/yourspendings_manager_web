import EntityModel from './Entity';
import ProductCategoryModel from './ProductCategory';
import RoleModel from './Role';

export default class Models {
    static ProductCategory = ProductCategoryModel;
    static Role = RoleModel;

    // Initialized instances pool
    static instances = {};

    /**
     * Method returns model class based on model name
     * @param modelName: Name of model
     * @returns {Entity}
     */
    static getModelClass(modelName) {
        switch (modelName) {
            case "productCategory": return ProductCategoryModel;
            case "role": return RoleModel;
            default: return EntityModel;
        }
    }

    /**
     * Method returns instance of model based on model name
     * @param modelName: Name of model
     * @returns {Entity}
     */
    static getInstanceOf(modelName) {
        if (!Models.instances[modelName])
            Models.instances[modelName] = new (Models.getModelClass(modelName))();
        return Models.instances[modelName];
    }
}