import EntityModel from './Entity';
import ProductCategoryModel from './ProductCategory';
import RoleModel from './Role';
import UserModel from './User';
import ShopModel from './Shop';
import PurchaseUserModel from './PurchaseUser';
import DiscountModel from './Discount';
import PurchaseModel from './Purchase';
import DimensionUnitModel from './DimensionUnit';
import PurchaseProductModel from './PurchaseProduct'
import PurchaseDiscountModel from './PurchaseDiscount';

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
            case "user": return UserModel;
            case "shop": return ShopModel;
            case "purchaseUser": return PurchaseUserModel;
            case "discount": return DiscountModel;
            case "purchase": return PurchaseModel;
            case "dimensionUnit": return DimensionUnitModel;
            case "purchaseProduct": return PurchaseProductModel;
            case "purchaseDiscount": return PurchaseDiscountModel;
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

    static RelationTypes = {
        OneToOne: "Models_RelationTypes_OneToOne",
        OneToMany: "Models_RelationTypes_OneToMany",
        ManyToOne: "Models_RelationTypes_ManyToOne",
        ManyToMany: "Models_RelationTypes_ManyToMany",
        HierarchyParent: "Models_RelationTypes_HierarchyParent"
    }

    static Permissions = {
        create: "Models_Permissions_Create",
        update: "Models_Permissions_Update",
        delete: "Models_Permissions_Delete",
    }

}