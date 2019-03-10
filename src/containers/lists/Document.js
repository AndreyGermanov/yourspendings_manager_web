import EntityListContainer from './Entity';
import moment from 'moment-timezone';
import actions from '../../actions/Actions';
import Store from '../../store/Store';

/**
 * Controller class for Document List containers. All descendant document container classes extend this class.
 */
export default class DocumentListContainer extends EntityListContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Params passed from tag properties
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps), {
            periodStart: (state["periodStart"] && state["periodStart"][this.model.itemName]) ?
                state["periodStart"][this.model.itemName] : moment().startOf('year').unix(),
            periodEnd: (state["periodEnd"] && state["periodEnd"][this.model.itemName]) ?
                state["periodEnd"][this.model.itemName] : moment().endOf('year').unix(),
            periodSelectionDialogVisible: state.periodSelectionDialogVisible
        });
    }


    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch),{
            changePeriodField: (field_name,date) => this.changePeriodField(field_name,date)
        });
    }

    /**
     * Method used to refresh list items from backend. It makes request to backend,
     * including search filter, current page and sort order and sets "list" state variable
     * based on returned result
     * @param options: Filter and other options to generate list
     */
    updateList(options={}) {
        const props = this.getProps();
        options["condition"] = "u.date >= '"+moment(props.periodStart*1000).format("YYYY-MM-DD HH:mm:ss")+"' AND "+
            "u.date <= '"+moment(props.periodEnd*1000).format("YYYY-MM-DD HH:mm:ss")+"'";
        super.updateList(options);
    }

    /**
     * Method used to change periodStart and periodEnd fields
     * @param field_name: Name of field to change (either "periodStart" or "periodEnd"
     * @param date: Value to set to this field
     */
    changePeriodField(field_name,date) {
        const state = Store.getState();
        const periodField = state[field_name] ? state[field_name] : {};
        periodField[this.model.itemName] = moment(date).unix();
        Store.store.dispatch(actions.changeProperty(field_name,periodField));
        this.updateList();
    }
}