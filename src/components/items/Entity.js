import React,{Component} from "react";
import {Panel} from "react-bootstrap";
import t from '../../utils/translate/translate';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import Form,{Button} from '../ui/Form';
import HeaderContainer from '../../containers/Header';
library.add(faStroopwafel);

/**
 * Base class used to represent data model either as list view or detail view
 * All concrete views extends from it
 */
class Entity extends Component {

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateItem(this.props.uid);
    }

    /**
     * Main method used to render this view
     * @returns Array of Rendered components
     */
    render() {
        if (!this.props.item) return null;
        const item = this.props.initItem(this.props.item);
        const labels = this.props.getFieldLabels();
        const Header = HeaderContainer.getComponent();
        return [
            <Header key="f1"/>,
            <div key="f2">
                {this.renderActionButtons()}
                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {this.props.getItemPresentation(item)}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        {this.renderStatusMessage()}
                        <Form ownerProps={this.props}>
                            {this.renderForm(item,labels)}
                        </Form>
                    </Panel.Body>
                </Panel>
            </div>
        ]
    }

    /**
     * Method renders buttons above detail view form
     * @returns Rendered set of buttons
     */
    renderActionButtons() {
        const result = [];
        result.push(<Button key="back_btn" className="btn btn-primary list-nav" text={t("Назад")}
                            onPress={() => window.location.href = '#'+this.props.collectionName}
                            iconClass="glyphicon glyphicon-arrow-left"/>);
        return <div style={{paddingBottom:'10px'}}>{result}</div>;
    }

    /**
     * Method used to render status message above form with "Success" or "Error" depending on current state
     * @returns {*} Rendered component
     */
    renderStatusMessage() {
        let className = "";
        let message = "";
        const errors = this.props.errors;
        if (errors["general"] && errors["general"].length) {
            className = "alert alert-danger";
            message = errors["general"];
        } else if (this.props.itemSaveSuccessText) {
            className = "alert alert-success";
            message = this.props.itemSaveSuccessText;
        }
        if (message)
            return <div className={className}>{message}</div>
    }

    /**
     * Method used to render contents of form in detail view
     * @param item: Entity to display in the form
     * @param labels: Object of labels for items
     * @returns array of rendered components
     */
    renderForm(item,labels) {
        return []
    }
}

export default Entity;