/**
 * Collection of Items.
 */

import ProductCategoryItem from "./ProductCategory";
import RoleItem from './Role';
import UserItem from './User';

export class Items {
    static ProductCategory = ProductCategoryItem;
    static Role = RoleItem;
    static User = UserItem;
}

export const ProductCategory = ProductCategoryItem;
export const Role = RoleItem;
export const User = UserItem;
