/**
 * Collection of Items.
 */

import ProductCategoryItem from "./ProductCategory";
import RoleItem from './Role';
import UserItem from './User';
import ShopItem from './Shop';
import PurchaseUserItem from './PurchaseUser';
import DiscountItem from './Discount';

export class Items {
    static ProductCategory = ProductCategoryItem;
    static Role = RoleItem;
    static User = UserItem;
    static Shop = ShopItem;
    static PurchaseUser = PurchaseUserItem;
    static Discount = DiscountItem;
}

export const ProductCategory = ProductCategoryItem;
export const Role = RoleItem;
export const User = UserItem;
export const Shop = ShopItem;
export const PurchaseUser = PurchaseUserItem;
export const Discount = DiscountItem;
