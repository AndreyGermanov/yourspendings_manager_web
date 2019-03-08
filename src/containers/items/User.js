/**
 * Controller class for Product Category Item component. Contains all methods and properties, which used by this module.
 */
import EntityContainer from "./Entity";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
import Store from '../../store/Store';

export default class UserItemContainer extends EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("user");
    }

    static getComponent() {
        const item = new UserItemContainer();
        return connect(item.mapStateToProps.bind(item),item.mapDispatchToProps.bind(item))(Item.User);
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Parameters from component's tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            "roles_list": state.roles_list ? state.roles_list : []
        })
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback) {
        super.updateItem(uid, () => {
            this.getRolesList((roles_list) => {
                Store.changeProperty('roles_list', roles_list);
            })
        })
    }

    /**
     * Method used to fetch list of user roles from backend and populate appropriate property in state
     * which then used to display list of user roles in dropdowns
     * @param callback
     */
    getRolesList(callback) {
        if (!callback) callback = () => null;
        const Role = Models.getInstanceOf("role");
        Role.getList({}, function(err, response) {
            let roles_list = [];
            if (err || typeof(response) !== "object") {
                Store.changeProperty('roles_list', roles_list);
                callback();
                return;
            }
            roles_list = [{id:0,text:""}].concat(
                response.map(function (item) {
                    return {id: item['uid'], text: item["name"]};
                })
            );
            callback(roles_list);
        });
    }
}