import actions from '../actions/Actions';
import _ from 'lodash';
import React from 'react';

/**
 * Root reducer. Used to apply actions of all reducers to application state
 */
export const Screens = {
    LOGIN: "SCREENS_LOGIN",
    SIGNUP: "SCREENS_SIGNUP",
    SHOPS: "SCREENS_SHOP"
};

/**
 * Global application state
 */
export const initialState = {
    isLogin: false,
    isMainScreenLoading:false,
    loginName:"",
    loginPassword:"",
    errors:{}
};

/**
 * Root reducer function
 * @param state: Current state before change
 * @param action: Action, which should be applied to state
 * @returns new state after apply action
 */
export default function rootReducer(state=initialState,action) {
    const newState = _.cloneDeep(state);
    switch (action.type) {
        case actions.types.CHANGE_PROPERTY:
            newState[action.name] = _.cloneDeep(action.value);
            break;
        case actions.types.CHANGE_PROPERTIES:
            for (let name in action.properties) newState[name] = _.cloneDeep(action.properties[name]);
            break;
        default:
            break;
    }
    return newState;
}