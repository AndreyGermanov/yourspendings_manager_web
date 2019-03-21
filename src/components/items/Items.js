/**
 * Collection of Items.
 */

import ProductCategoryItem from "./ProductCategory";
import RoleItem from './Role';
import UserItem from './User';
import ShopItem from './Shop';
import PurchaseUserItem from './PurchaseUser';
import DiscountItem from './Discount';
import PurchaseItem from './Purchase';
import DimensionUnitItem from './DimensionUnit';
import ReportItem from './Report';

export class Items {
    static ProductCategory = ProductCategoryItem;
    static Role = RoleItem;
    static User = UserItem;
    static Shop = ShopItem;
    static PurchaseUser = PurchaseUserItem;
    static Discount = DiscountItem;
    static Purchase = PurchaseItem;
    static DimensionUnit = DimensionUnitItem;
    static Report = ReportItem;
}

export const ProductCategory = ProductCategoryItem;
export const Role = RoleItem;
export const User = UserItem;
export const Shop = ShopItem;
export const PurchaseUser = PurchaseUserItem;
export const Discount = DiscountItem;
export const Purchase = PurchaseItem;
export const DimensionUnit = DimensionUnitItem;
export const Report = ReportItem;