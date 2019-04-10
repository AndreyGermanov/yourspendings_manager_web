/**
 * Controller class for Report component. Contains all methods and properties, which used by this module.
 */
import Item from '../../../components/items/reports/Report';
import {connect} from 'react-redux';
import Store from "../../../store/Store";
import EntityContainer from "../../Entity";

export default class ReportContainer extends EntityContainer {

    static getComponent() {
        const item = new ReportContainer();
        return connect(item.mapStateToProps.bind(item),item.mapDispatchToProps.bind(item))(Item);
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Parameters from component's tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            reportData: state.reportData ? state.reportData: [],
            openedRows: state.openedRows ? state.openedRows: {}
        })
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            switchRow: (rowNumber) => this.switchRow(rowNumber),
        });
    }

    /**
     * Method runs when user expands or collapses row in report
     * @param rowNumber - Number of row
     */
    switchRow(rowNumber) {
        let openedRows = this.getProps().openedRows;
        if (typeof(openedRows[rowNumber]) === "undefined") openedRows[rowNumber] = false;
        openedRows[rowNumber] = !openedRows[rowNumber];
        Store.changeProperty("openedRows",openedRows)
    }

}