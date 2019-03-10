import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import Form,{Button,Input,Select} from '../../components/ui/Form';
import StorageConfig from '../../config/Storage';

/**
 * Component used to manage "Purchase" item page
 */
export default class Purchase extends Document {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        return [
            <div className="col-sm-6" key="f1">
                <div className="form-group">
                    <label className="col-sm-2">{labels["date"]}</label>
                    <div className="col-sm-10">{item["date"]}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2">{labels["place"]}</label>
                    <div className="col-sm-10">{item["place"].name}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2">{labels["user"]}</label>
                    <div className="col-sm-10">{item["user"].email}</div>
                </div>
            </div>,
            <div className="col-sm-6" key="f2">
                <div className="col-sm-12">{this.renderImages(item,labels)}</div>
                <div className="col-sm-12">
                    <label>{labels["purchaseDiscounts"]}</label>
                </div>
            </div>,
            <div className="col-sm-12" key="f3">{this.renderProducts(item,labels)}</div>,
            <div className="form-group col-sm-12" align="center" key="f4">
                <Button onPress={() => this.props.saveToBackend()} text={t("Save")}
                        iconClass="glyphicon glyphicon-ok"/>
            </div>
        ]
    }

    renderImages(item,labels) {
        if (!item.images.length) return "";
        let link = StorageConfig.imagePath+
            encodeURIComponent("/"+item.user.uid+"/"+item.uid+"/"+item.images[item.purchaseImageIndex].uid+".jpg")
            +"?alt=media";
        return [
            <label key="f0" className="col-sm-12">
                {labels["images"]} ({item.purchaseImageIndex+1} {t("of")} {item.images.length})
            </label>,
            <div className="col-sm-6" key="f1">
                <Button onPress={() => this.props.decrementPurchaseImage()}
                        text="" iconClass="glyphicon glyphicon-arrow-left"/>
            </div>,
            <div className="col-sm-6 pull-right" key="f2">
                <Button onPress={() => this.props.incrementPurchaseImage()} className="btn btn-primary pull-right"
                        text="" iconClass="glyphicon glyphicon-arrow-right"/>
            </div>,
            <div className="col-sm-12" key="f3" style={{textAlign:'center'}}>
                <a href={link} target="_blank"><img src={link} className="purchaseImage"/></a>
            </div>
        ]
    }

    renderProducts(item,labels) {
        return [
            <div className="row" key="f1">
                <label className="col-sm-1">{labels["products"]}</label>
                <Button iconClass="glyphicon glyphicon-plus" className="btn btn-success" text={t("Add")}
                    onPress={() => this.props.addProduct()}
                />
            </div>,
            <table key="f2" className="table table-bordered">
                <tbody>
                    {this.renderProductsHeader()}
                    {this.renderProductsTableRows(item)}
                </tbody>
            </table>
        ]
    }

    renderProductsHeader() {
        const labels = this.props.getProductTableLabels();
        return (
            <tr>
                <td>{labels["name"]}</td>
                <td>{labels["category"]}</td>
                <td>{labels["price"]}</td>
                <td>{labels["count"]}</td>
                <td>{labels["unit"]}</td>
                <td>{t("Summa")}</td>
                <td>{labels["discount"]}</td>
                <td>{t("Total")}</td>
                <td>{t("Actions")}</td>
            </tr>
        )
    }

    renderProductsTableRows(item) {
        return item.products.map((product,index) => this.renderProductsTableRow(product,index))
    }

    renderProductsTableRow(product,index) {
        let props = {errors: this.props.errors["products"] ? this.props.errors["products"]: {}};
        return (
            <tr key={"product_"+index}>
                <td><Input name="name" value={product.name} ownerProps={props}
                       onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                </td>
                <td><Select name="category" value={product.category} items={this.props.categories_list} ownerProps={props}
                    onChange={(name,value)=>this.props.changeTableField("purchaseProduct","products",index,name,value)}/>
                </td>
                <td><Input name="price" value={product.price} ownerProps={props}
                   onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                </td>
                <td><Input name="count" value={product.count} ownerProps={props}
                           onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                </td>
                <td>{product.unit}</td>
                <td>{product.price*product.count}</td>
                <td>{product.discount}</td>
                <td>{product.price*product.count-product.discount}</td>
                <td>
                    <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeProduct(index)}
                    />
                </td>
            </tr>
        )
    }
}