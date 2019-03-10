import t from "../utils/translate/translate";
import Backend from '../backend/Backend';
import Models from './Models';
import async from 'async';
import _ from 'lodash';
import Store from '../store/Store';

/**
 * Base class for database models, used in application
 */
class Entity {

    constructor() {
        this.itemName = "entity";
        this.collectionName = "entities";
        this.itemTitle = t("Объект");
        this.collectionTitle = t("Объекты");
        // Fields of model, which will be validated for errors before save to backend.
        this.fieldsToValidate = [];
        // Fields of model, which will be validated for errors while edit in the form
        this.fieldsToValidateInline = [];
        // Fields of model, which should not be persisted to backend
        this.transientFields = [];
        // Fields of model, which are relationships. Key is name of field.
        // Each field description has following format:
        // {
        //      type: <Models.RelationTypes enum value>,
        //      target: <String with name of related model>
        // }
        this.relationFields = {};
        // Set of basic permissions for items of this model
        this.permissions = [Models.Permissions.create,Models.Permissions.update,Models.Permissions.delete];
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns object item with populated values
     */
    initItem(item) {
        if (!item || typeof(item)!=="object") item = {};
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() { return {} }

    /**
     * Method returns title of item in Detail View form
     * @param item - Item to get title form
     * @returns {string} Generated title
     */
    getItemPresentation(item) {
        return this.itemTitle
    }

    /**
     * Method returns number of items in collection
     * @param options: params to query.
     * @param callback: Method which called after request. Contains "err" and "result" variables. Err can contain
     * error, result contains number of items in collection
     */
    getCount(options,callback=()=>{}) {
        let params = { method: 'POST', body: JSON.stringify(options), headers: {'Content-Type':'application/json'}};
        Backend.request('/api/'+this.itemName+'/count',params, function(error,response) {
            if (error) {
                callback(error,0);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,0);
                return;
            }
            response.text().then(function(text) {
                if (!isNaN(text)) {
                    callback(null,parseInt(text,10));
                } else {
                    callback(null,0);
                }
            }).catch(function() {
                callback(null, 0);
            })
        })
    }

    /**
     * Method used to fetch list of items from models collection
     * @param options: Options to filter, limit, skip and sort order
     * @param callback: Function called after operation finishes
     */
    getList(options,callback=()=>{}) {
        let params = { method: 'POST', body: JSON.stringify(options), headers: {'Content-Type':'application/json'}};
        Backend.request('/api/'+this.itemName+"/list",params, function(error,response) {
            if (error) {
                callback(error);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,[]);
                return;
            }
            response.json().then(function (list) {
                callback(null,list);
            }).catch((error)=> {
                callback(error,[]);
            });
        })
    }

    /**
     * Method used to fetch single item from backend
     * @param itemID: ID of item to fetch
     * @param options: various options which affect result
     * @param callback: Callback function called after execution
     */
    getItem(itemID,options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        if (!itemID) {
            callback(null,[]);
            return;
        }
        let params = { method: 'GET'};
        Backend.request('/api/'+this.itemName+'/item/'+itemID,params, function(error,response) {
            if (error) {
                callback(error);
                return;
            }
            if (!response || response.status !== 200) {
                callback(null,{});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject)
            }).catch(function() {
                try {
                    callback(null, {});
                } catch(e) {}
            })
        })
    }

    /**
     * Method used to save item to database. It can either add new item (POST) or update existing (PUT)
     * @param inputData: Array of field values of item
     * @param callback: Callback function which called after execution completed. It can contain either "errors"
     * object with validation errors for each field, or "result" object with all saved fields (including "uid") of item.
     */
    saveItem(inputData,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        let method = this.getSaveItemMethod(inputData);
        let url = this.getSaveItemUrl(inputData);
        let data = this.getSaveItemData(_.cloneDeep(inputData));
        if (!data) {
            callback(null,{'errors':{'general': t("Системная ошибка")}});
            return;
        }
        data = this.cleanDataForBackend(data);
        const params = {method:method,body:JSON.stringify(data),headers:{'Content-Type':'application/json'}};
        Backend.request(url,params, (error, response) => {
            if (!response || response.status >399 || error) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then((result) => {
                result.uid = result._links.self.href.split("/").pop();
                delete(result["_links"]);
                inputData.uid = result.uid;
                this.saveRelations(inputData, (relationFields) => {
                    if (relationFields && Object.keys(relationFields).length)
                        Object.keys(relationFields).forEach((fieldName) => result[fieldName] = relationFields[fieldName]);
                    else if(typeof(relationFields) !== "object") callback(null,{'errors':{'general': t("Системная ошибка")}});
                    callback(null,result);
                });
            });
        });
    }

    /**
     * Method used to save all relationship fields of current item.
     * @param inputData - Array of fields of item
     * @param callback: Callback function which called after execution completed.
     */
    saveRelations(inputData,callback) {
        let fieldValues = {};
        async.eachSeries(Object.keys(this.relationFields),(relationField,callback) => {
            const relation = this.relationFields[relationField];
            relation.field = relationField;
            if (!inputData[relationField]) {callback();return;}
            let targetModel = Models.getInstanceOf(relation.target);
            if (!relation.type || !targetModel) {callback();return;}
            let values = this.getRelationValues(relation,inputData[relationField]);
            if (!values) { callback(); return;}
            fieldValues[relationField] = values;
            this.saveRelation(inputData["uid"],relation,targetModel ,values, (error,response) => {
                if (response.status > 399 || error) { callback(true);return;}
                callback(fieldValues);
            })
        }, (error) => {
            callback(error)
        })
    }

    /**
     * Method used to get value of specified relation
     * @param relation - Relation description (from this.relationFields)
     * @param inputValue - Raw value which need to transform to correct value
     * @returns Transformed value of relationship field
     */
    getRelationValues(relation,inputValue) {
        if (!inputValue) return null;
        if (typeof(this["cleanField_"+relation.field])==="function") {
            inputValue = this["cleanField_"+relation.field](inputValue);
        }
        let values = null;
        switch (relation.type) {
            case Models.RelationTypes.OneToMany:
                if (typeof(inputValue) === "object" && inputValue.length) values = inputValue;
            case Models.RelationTypes.OneToOne:
                return inputValue;
            case Models.RelationTypes.ManyToOne:
                return inputValue;
        }
        return values;
    }

    /**
     * Methid used to save specified relation of specified item
     * @param item_id - ID of current item
     * @param relation - Relation description (from this.relationFields)
     * @param relationModel - Data model of relation
     * @param values - Values of related items
     * @param callback: Callback function which called after execution completed.
     */
    saveRelation(item_id,relation,relationModel,values,callback) {
        let url = "/api/"+this.collectionName+"/"+item_id+"/"+relation.field;
        if (relation.type === Models.RelationTypes.OneToMany || relation.type === Models.RelationTypes.ManyToMany) {
            let relationUrls = values.map((value) => Backend.getBaseUrl() + "/api/" + relationModel.collectionName + "/" + value);
            let params = {method: 'PUT', headers: {'Content-Type': 'text/uri-list'}, body: relationUrls.join("\n")};
            Backend.request(url, params, () => {
                let params = {
                    method: 'PATCH',
                    headers: {'Content-Type': 'text/uri-list'},
                    body: relationUrls.join("\n")
                };
                Backend.request(url, params, (error, response) => {
                    callback(error, response)
                })
            })
        } else {
            let url = "/api/"+this.collectionName+"/"+item_id;
            let relationUrl = Backend.getBaseUrl() + "/api/" + relationModel.collectionName + "/" + values;
            let params = {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: {}};
            params.body[relation.field] = relationUrl;
            params.body = JSON.stringify(params.body);
            Backend.request(url, params, (error, response) => {
                callback(error, response)
            })
        }
    }


    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend(item) {
        const result = {};
        if (item.uid && item.uid !== "new") { result["uid"] = item.uid;}
        this.transientFields.forEach((fieldName) => delete item[fieldName]);
        Object.keys(this.relationFields).forEach(fieldName => delete item[fieldName]);
        for (let field_name in item) {
            if (!item.hasOwnProperty(field_name)) continue;
            if (typeof(this["cleanField_"+field_name])==="function") {
                const value = this["cleanField_"+field_name](item[field_name]);
                if (value !== null) result[field_name] = value;
            } else if (typeof(item[field_name]) === 'string') {
                result[field_name] = item[field_name].trim();
            } else {
                result[field_name] = item[field_name];
            }
        }
        return result;
    }

    /**
     * Method returns API call URL for "saveItem" method based on data, which need to save to the server
     * @param data: Item data to send
     * @returns {string} URL for request
     */
    getSaveItemUrl(data) {
        let url = '/api/'+this.collectionName
        if (data['uid']) {
            url += "/"+data['uid'].toString();
        }
        return url
    }

    /**
     * Method returns API call Request method for "saveItem" method based on data, which need to save to the server
     * @param data: Item data to send
     * @returns {string} Request method (GET, PUT, POST etc)
     */
    getSaveItemMethod(data) {
        return data["uid"] ? 'PATCH' : 'POST'
    }

    /**
     * Method returns data for "saveItem" method, which will be sent to the server. Can be used to adjust data
     * @param data: Item data to send
     * @returns {*} Object to send to the server
     */
    getSaveItemData(data) {
        if (!data) return null;
        return data
    }

    /**
     * Method determines if current entity has specified permission (create, update, delete)
     * @param permission - permission. Value of enum: Models.Permissions
     * @returns {boolean} - True if entity has this permission or false otherwise
     */
    hasPermission(permission) { return this.permissions.indexOf(permission) !== -1}

    /**
     * Function used to validate item before save to database
     * @param item: Item data to validate
     * @returns Array of found errors or null if nothing found
     */
    validate(item) {
        let has_errors = false;
        const errors = {};
        if (!this.hasPermission(Models.Permissions.update) ||
            (!this.hasPermission(Models.Permissions.create) && (!item['uid'] || item['uid'] === 'new'))
        ) {
            errors['general'] = t("You do not have permission to edit this item");
            has_errors = true;
            return errors;
        }
        for (const field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === 'uid')
                continue;
            if (this.fieldsToValidate.length && this.fieldsToValidate.indexOf(field_name) === -1)
                continue;
            const error = this.validateItemField(field_name,item[field_name],item);
            if (error) {
                has_errors = true;
                errors[field_name] = error;
            }
        }
        return has_errors ? errors : null;
    }

    /**
     * Method used to validate specified field
     * @param field_name: Name of field to validate
     * @param field_value: Value to validate
     * @param item: All fields in current record
     * @returns {string}: Either string with error message or empty string if no error
     */
    validateItemField(field_name,field_value,item=null) {
        if (!field_value || typeof(field_value) === "undefined") {
            field_value = "";
        }
        if (typeof(this["validate_"+field_name])==="function") {
            return this["validate_"+field_name](field_value,item);
        }
        return "";
    }

    /**
     * Method used to delete items from database.
     * @param idList: Array of item UIDs to delete
     * @param callback: Callback function which called after execution completed
     */
    deleteItems(idList,callback) {
        if (!this.hasPermission(Models.Permissions.delete)) {
            callback(null,{'errors':{'general': t("You do not have permission to delete this item")}});
            return;
        }
        const itemList = idList.map(function(item) {
            return item;
        });
        if (!itemList || !itemList.length) return;
        const params = {method:'DELETE'}
        Backend.request("/api/"+this.itemName+"/item/"+itemList.join(","),params, function(err,response) {
            if (!response || response.status !== 200) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject);
            })
        });
    }

    /**
     * Method used to fetch list of items from backend and populate appropriate property in state
     * which then used to display list of items of this type in dropdowns
     * @param listProperty - State property to populate with list items
     * @param idField - Field of model used as an id for list option values
     * @param textField - Field of model used as an text for list option values
     * @param callback - Function called when operation finished
     */
    setListForDropdown(listProperty,idField,textField,callback) {
        if (!callback) callback = () => null;
        this.getList({}, function(err, response) {
            let list = [];
            if (err || typeof(response) !== "object") {
                Store.changeProperty(listProperty, list);
                callback();
                return;
            }
            list = [{id:0,text:""}].concat(
                response.map(function (item) {
                    return {id: item[idField], text: item[textField]};
                })
            );
            Store.changeProperty(listProperty, list);
            callback();
        });
    }

    /************************************************************
     * Generic functions used to clean values of various types, *
     * before pushing to database                               *
     ************************************************************/

    cleanStringField(value) {
        return value.toString().trim()
    }

    cleanIntField(value) {
        const result = parseInt(value,10);
        value = parseInt(value,10);
        if (!isNaN(result) && value === result) return result;
        return null;
    }

    cleanDecimalField(value) {
        const result = parseFloat(value);
        value = parseFloat(value);
        if (!isNaN(result) && value === result) return result;
        return null;
    }

    cleanEmailField(value) {
        value = value.toString().trim().toLowerCase();
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value)) return null;
        return value;
    }
}

export default Entity;