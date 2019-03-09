/**
 * Collection of Lists.
 */

import Entity from './Entity';

class ProductCategoryList extends Entity {
    /**
     * Method returns style for specified cell in table
     * @param fieldName - Field name
     * @param fieldValue - Field value
     * @param item - Full row of table data
     * @returns Style object
     */
    getStyleForField(fieldName,fieldValue,item) {
        if (fieldName === "name") return {paddingLeft:(8+item['level']*10)}
        return {};
    }
}
class RoleList extends Entity {}
class UserList extends Entity {}
class ShopList extends Entity {}
class PurchaseUserList extends Entity {}
class DiscountList extends Entity {}

export class Lists {
    static ProductCategory = ProductCategoryList;
    static Role = RoleList;
    static User = UserList;
    static Shop = ShopList;
    static PurchaseUser = PurchaseUserList;
    static Discount = DiscountList;
}

export const ProductCategory = ProductCategoryList;
export const Role = RoleList;
export const User = UserList;
export const Shop = ShopList;
export const PurchaseUser = PurchaseUserList;
export const Discount = DiscountList;
