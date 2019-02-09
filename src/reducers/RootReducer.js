import actions from '../actions/Actions';
import Store from '../store/Store';
import t from '../utils/translate'
import _ from 'lodash';
import React from 'react';

/**
 * Root reducer. Used to apply actions of all reducers to application state
 */
export const modules = {
    shops: { order:1, title:t("Shops") },
    purchases: { order:2, title:t("Purchases") },
    purchaseUsers: {order:3, title:t("Purchase Users")},
    users: { order:4, title: t("Users") }
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
    errors:{},
    profile: {},
    modules: {}
};

/**
 * Root reducer function
 * @param state: Current state before change
 * @param action: Action, which should be applied to state
 * @returns new state after apply action
 */
export default function rootReducer(state=initialState,action) {
    let newState = _.cloneDeep(state);
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
