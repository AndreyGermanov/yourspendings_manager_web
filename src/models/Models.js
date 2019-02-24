import EntityModel from './Entity';
import ProductCategoryModel from './ProductCategory';

export default class Models {
    static ProductCategory = ProductCategoryModel;

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