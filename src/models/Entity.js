import t from "../utils/translate/translate";
import Backend from '../backend/Backend';

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
    getCount(options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        Backend.request('/'+this.itemName+'/count',options,'GET',null,null, function(error,response) {
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
    getList(options,callback) {
        if (typeof(callback)!=='function')
            callback = ()=>null;
        Backend.request('/'+this.itemName,options,'GET',null,null, function(error,response) {
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
            }).catch(function(error) {
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
        Backend.request('/'+this.itemName+'/'+itemID,options,'GET',null,null, function(error,response) {
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
     * @param options: Array of field values of item
     * @param callback: Callback function which called after execution completed. It can contain either "errors"
     * object with validation errors for each field, or "result" object with all saved fields (including "uid") of item.
     */
    saveItem(options,callback) {
        if (typeof(callback)!=='function') callback = ()=>null;
        let method = this.getSaveItemMethod(options);
        let url = this.getSaveItemUrl(options);
        let data = this.getSaveItemData(options);
        if (!data) {
            callback(null,{'errors':{'general': t("Системная ошибка")}});
            return;
        }
        data = this.cleanDataForBackend(data);
        Backend.request(url,data,method,null,null, function(error, response) {
            if (!response || response.status !== 200 || error) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(obj) {
                callback(null,obj);
            });
        });
    }


    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend(item) {
        const result = {};
        if (item.uid && item.uid !== "new") {
            result["uid"] = item.uid;
        }
        for (let field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === "uid")
                continue;
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
        let url = '/'+this.itemName;
        if (data['uid']) {
            url += "/"+data['uid'].toString().replace(/#/g,"").replace(/:/g,"_");
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
        if (data['uid'])
            delete data["uid"];
        return data
    }

    /**
     * Function used to validate item before save to database
     * @param item: Item data to validate
     * @returns Array of found errors or null if nothing found
     */
    validate(item) {
        const errors = {};
        let has_errors = false;
        for (const field_name in item) {
            if (!item.hasOwnProperty(field_name) || field_name === 'uid')
                continue;
            if (this.fieldsToValidate.length && this.fieldsToValidate.indexOf(field_name) === -1)
                continue;
            const error = this.validateItemField(field_name,item[field_name]);
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
     * @returns {string}: Either string with error message or empty string if no error
     */
    validateItemField(field_name,field_value) {
        if (!field_value || typeof(field_value) === "undefined") {
            field_value = "";
        }
        if (typeof(this["validate_"+field_name])==="function") {
            return this["validate_"+field_name](field_value);
        }
        return "";
    }

    /**
     * Method used to delete items from database.
     * @param idList: Array of item UIDs to delete
     * @param callback: Callback function which called after execution completed
     */
    deleteItems(idList,callback) {
        const itemList = idList.map(function(item) {
            return item.replace(/#/g,'').replace(/:/g,'_');
        });
        if (!itemList || !itemList.length) return;
        Backend.request("/"+this.itemName+"/"+itemList.join(","),{},'DELETE',null,null, function(err,response) {
            if (!response || response.status !== 200) {
                callback(null,{'errors':{'general': t("Системная ошибка")}});
                return;
            }
            response.json().then(function(jsonObject) {
                callback(null,jsonObject);
            })
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