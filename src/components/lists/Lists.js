/**
 * Collection of Lists.
 */

import Entity from './Entity';

class ProductCategoryList extends Entity {}
class RoleList extends Entity {}

export class Lists {
    static ProductCategory = ProductCategoryList;
    static Role = RoleList;
}

export const ProductCategory = ProductCategoryList;
export const Role = RoleList;
