import actions from '../actions/Actions';
import Store from '../store/Store';
import t from '../utils/translate/translate'
import React from 'react';

/**
 * Root reducer. Used to apply actions of all reducers to application state
 */
export const modules = {
    shops: { order:1, title:t("Shops") },
    purchases: { order:2, title:t("Purchases") },
    purchaseUsers: {order:3, title:t("Purchase Users")},
    productCategories: {order:4,title:t("Product Categories")},
    discounts: {order:5,title:t("Discounts")},
    users: { order:6, title: t("Users") },
    roles: {order:7, title: t("Roles")},
};

export const roles = {
    "ROLE_USER": t("User"),
    "ROLE_ADMIN": t("Administrator")
};

/**
 * Global application state
 */
export const initialState = {
    isLogin: false,
    isMainScreenLoading:false,
    loginName:"",
    loginPassword:"",
    profile: {},
    modules: {},
    updateCounter: 0,
    list: {},
    item: {},
    errors: {},
    itemSaveSuccessText: "",
    isUpdating: false,
    sortOrder: {},
    listFilter: {},
    pageNumber: {"users":1},
    selectedItems: {},
    itemsPerPage: {"users":10},
    numberOfItems: {"users":16},
    registerEmailSent: false,
    resetPasswordEmailSent: false,
    resetPasswordComplete: false
};

/**
 * Root reducer function
 * @param state: Current state before change
 * @param action: Action, which should be applied to state
 * @returns new state after apply action
 */
export default function rootReducer(state,action) {
    if (!state) state = {
        isLogin: false,
        isMainScreenLoading:false,
        loginName:"",
        loginPassword:"",
        profile: {},
        modules: {},
        updateCounter: 0,
        list: {},
        item: {},
        errors: {},
        itemSaveSuccessText: "",
        isUpdating: false,
        sortOrder: {},
        listFilter: {},
        pageNumber: {"users":1},
        selectedItems: {},
        itemsPerPage: {"users":10},
        numberOfItems: {"users":16},
        registerEmailSent: false,
        resetPasswordEmailSent: false,
        resetPasswordComplete: false
    };
    let newState = require('lodash').cloneDeep(state);
    switch (action.type) {
        case actions.types.CHANGE_PROPERTY:
            newState = changeProperty(action.name,action.value,newState);
            break;
        case actions.types.CHANGE_PROPERTIES:
            for (let name in action.properties) changeProperty(name,action.properties[name],newState);
            break;
        default:
            break;
    }
    return newState;
}

const changeProperty = function(name,value,newState) {
    eval("newState"+Store.getPropertyNameExpression(name)+ " = _.cloneDeep(value);");
    return newState
};
