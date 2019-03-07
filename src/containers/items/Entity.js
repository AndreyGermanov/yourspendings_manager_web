import Store from '../../store/Store';
import _ from 'lodash';
import actions from '../../actions/Actions';
import t from '../../utils/translate/translate';
import EntityContainer from '../Entity';
import Models from '../../models/Models';

/**
 * Base controller class for all object detail views. Contains all methods and properties, which used by all
 * descendant lists
 */
export default class EntityItemContainer extends EntityContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Link to component properties (defined in component tag attributes)
     * @returns Object of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            uid: ownProps ?  ownProps.uid : "",
            item: state.item[this.model.itemName] ? state.item[this.model.itemName] : {},
            itemSaveSuccessText: state.itemSaveSuccessText,
            collectionName: this.model.collectionName
        })
    }

    /**
     * Function defines methods which of controller methods will be available inside component, that controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch),{
            initItem: (item) => this.initItem(item),
            updateItem: (uid) => this.updateItem(uid),
            changeItemField: (field_name,e) => this.changeItemField(field_name,e),
            saveToBackend: () => this.saveToBackend(),
            getItemPresentation: (item) => this.getItemPresentation(item)
        })
    }

    /**
     * Method used to initialize item, which is displayed in view by populating
     * all empty or undefined properties with default values
     * @param item: Input item
     * @returns item, with all fields defined
     */
    initItem(item) {
        return this.model.initItem(item);
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        if (!uid) return;
        const self = this;
        if (!callback) callback = () => null;
        const state = Store.getState();
        const item = _.cloneDeep(state.item);
        if (uid === "new") {
            item[this.model.itemName] = this.initItem({});
            Store.store.dispatch(actions.changeProperty('item',item));
            callback();
            return;
        }
        Store.store.dispatch(actions.changeProperties({"isUpdating":true,"errors":{}}));
        this.model.getItem(uid,{},(err,result) => {
            if (err)
                result = {};
            item[self.model.itemName] = result;
            Store.store.dispatch(actions.changeProperties({'item':item,'isUpdating':false}));
            callback()
        });
    }

    /**
     * Method used to change field value in "item" property of global application state
     * @param field_name: Name of field to change
     * @param e: Link to DOM item of input field from which get value
     */
    changeItemField(field_name,e) {
        let value = null;
        if (typeof(this.model["parseItemField_"+field_name]) === "function") {
            value = this.model["parseItemField_" + field_name].bind(this)(e);
        }
        else if (e && e.target)
            value = e.target.value;
        const state = Store.getState();
        const item = _.cloneDeep(state.item);
        if (!item[this.model.itemName])
            item[this.model.itemName] = {};
        if (item[this.model.itemName][field_name] === value) {
            return;
        }
        const errors = _.cloneDeep(state.errors);
        item[this.model.itemName][field_name] = value;
        if (!this.model.fieldsToValidateInline.length ||  this.model.fieldsToValidateInline.indexOf(field_name)!==-1)
            errors[field_name] = this.model.validateItemField(field_name,value,item[this.model.itemName]);
        Store.store.dispatch(actions.changeProperties({"item":item,"errors":errors}));
    }

    /**
     * Method used to save current entity data to backend. Handler of "Save" button
     * @param callback: Function which called after finish
     */
    saveToBackend(callback) {
        const self = this;
        if (!callback) callback = () => null;
        if (!this.validateItem()) {
            callback();
            return;
        }
        Store.store.dispatch(actions.changeProperty('isUpdating',true));
        this.model.saveItem(this.getDataToSave(), function(err,result) {
            self.processSaveToBackendResponse(err,result,callback)
        })
    }

    /**
     * Method used to validate current item before save to backend
     * @returns {boolean} True if validated successfully and false otherwise
     */
    validateItem() {
        const item = this.getDataToSave();
        Store.store.dispatch(actions.changeProperty("errors",{}));
        const errors = this.model.validate(item);
        if (errors !== null) {
            Store.store.dispatch(actions.changeProperty("errors",errors));
            return false;
        }
        return true;
    }

    /**
     * Method prepares item data to save to backend.
     * @returns {*} Item to save
     */
    getDataToSave() {
        return this.getProps().item;
    }

    /**
     * Utility method used to process response from server after "saveToBackend" operation
     * @param err: Error, returned by seriver (if any)
     * @param result: Result from server
     * @param callback: Function which called after complete
     */
    processSaveToBackendResponse(err,result,callback) {
        Store.store.dispatch(actions.changeProperty('isUpdating',false));
        if (this.processSaveToBackendErrorResponse(err,result)) {
            callback();
            return
        }
        this.processSaveToBackendSuccessResponse(err,result,callback);
    }

    /**
     * Utility function used to check and process response from server in case of errors
     * @param err: Error, returned by seriver (if any)
     * @param result: Result from server
     * @returns Boolean: True if error response returned or false otherwise
     */
    processSaveToBackendErrorResponse(err,result) {
        if (err || !result || result["errors"]) {
            if (!result || !result["errors"])
                result = {'errors':{'general':t("Системная ошибка")}};
            Store.store.dispatch(actions.changeProperty('errors',result['errors']));
            return true
        }
        return false
    }

    /**
     * Utility function used to check and process response from server in case of success
     * @param err: Error, returned by seriver (if any)
     * @param result: Result from server
     * @param callback: Function which called after complete
     */
    processSaveToBackendSuccessResponse(err,result,callback) {
        if (!callback) callback = () => null;
        const item = this.getProps().item;
        const stateItem = Store.getState().item;

        if (!item["uid"]) {
            stateItem[this.model.itemName] = result;
            Store.store.dispatch(actions.changeProperties({uid: result["uid"], item: stateItem}));
        }
        this.displaySuccessText("Операция успешно завершена");
        callback();
    }

    /**
     * Method displays text about successful save to backend
     * @param text: Text to display
     */
    displaySuccessText(text) {
        Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",t(text)));
        setTimeout(function() {
            Store.store.dispatch(actions.changeProperty("itemSaveSuccessText",""));
        },3000);
    }

    /**
     * Method used to fetch list of companies from backend and populate appropriate property in state
     * which then used to display list of companies in dropdowns
     * @param callback
     */
    getCompaniesList(callback) {
        if (!callback) callback = () => null;
        const Company = Models.getInstanceOf("company");
        Company.getList({}, function(err, response) {
            let companies_list = [];
            if (err || typeof(response) !== "object") {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
                callback();
                return;
            }
            companies_list = [{value:0,label:""}].concat(
                response.map(function (item) {
                    return {id: item['uid'], text: item["name"]};
                })
            );
            callback(companies_list);
        });
    }

    /**
     * Method generates title, which is written on header
     * @param item: Item for which title generated
     * @returns string Generated title
     */
    getItemPresentation(item) {
        return this.model.getItemPresentation(item);
    }
}