/**
 * Collection of Lists.
 */

import Entity from './Entity';

class ProductCategoryList extends Entity {}
class RoleList extends Entity {}
class UserList extends Entity {}

export class Lists {
    static ProductCategory = ProductCategoryList;
    static Role = RoleList;
    static User = UserList;
}

export const ProductCategory = ProductCategoryList;
export const Role = RoleList;
export const User = UserList;
