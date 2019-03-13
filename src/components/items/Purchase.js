import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import {Button,Input,Select} from '../../components/ui/Form';
import StorageConfig from '../../config/Storage';
import moment from 'moment-timezone';

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
                    <div className="col-sm-10">{moment(item["date"]).format("YYYY-MM-DD HH:mm:ss")}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2">{labels["place"]}</label>
                    <div className="col-sm-10">{item["place"].name}</div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2">{labels["user"]}</label>
                    <div className="col-sm-10">{item["user"].email}</div>
                </div>
                <div className="row">{this.renderDiscounts(item,labels)}</div>
            </div>,
            <div className="col-sm-6" key="f2">
                <div className="col-sm-12">{this.renderImages(item,labels)}</div>
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
                <Button iconClass="glyphicon glyphicon-plus" className="btn btn-xs btn-success" text={t("Add")}
                    onPress={() => this.props.addProduct()}
                />
            </div>,
            <table key="f2" className="table table-bordered table-condensed">
                <tbody>
                    {this.renderProductsHeader()}
                    {this.renderProductsTableRows(item)}
                    {this.renderProductsFooter(item)}
                </tbody>
            </table>
        ]
    }

    renderProductsHeader() {
        const labels = this.props.getProductTableLabels();
        return (
            <tr>
                <th style={{width:"50%"}}>{labels["name"]}</th>
                <th>{labels["price"]}/{labels["count"]}/{labels["discount"]}</th>
                <th>{labels["unit"]}</th>
                <th>{t("Summa")}</th>
                <th>{t("Actions")}</th>
            </tr>
        )
    }

    renderProductsTableRows(item) {
        return item.products.map((product,index) => this.renderProductsTableRow(product,index))
    }

    renderProductsTableRow(product,index) {
        let props = {errors: this.props.errors["products"] ? this.props.errors["products"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        let category = product.category.uid ? product.category.uid : product.category;
        let unit = product.unit.uid ? product.unit.uid : product.unit;
        let totals = this.calculateProductRow(product)
        return (
            <tr key={"product_"+index}>
                <td>
                    <Select inputClass="tableInput" name="category" value={category} items={this.props.categories_list}
                            ownerProps={{errors:props.errors[index]}}
                            containerClass="tableInputContainer"
                            onChange={(name,value)=>this.props.changeTableField("purchaseProduct","products",index,name,value)}/>
                    <Input name="name" value={product.name} containerClass="tableInputContainer" multiline={true}
                           ownerProps={{errors:props.errors[index]}}
                           inputClass="tableInput"
                       onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                </td>
                <td><Input inputClass="tableInput"  name="price" value={product.price} containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                   onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                    <Input inputClass="tableInput"  name="count" value={product.count} containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                           onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                    <Input inputClass="tableInput"  name="discount" value={product.discount}  containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                           onChange={(name,text)=>this.props.changeTableField("purchaseProduct","products",index,name,text)}/>
                </td>
                <td><Select inputClass="tableInput"  name="unit" value={unit} items={this.props.units_list}
                            ownerProps={{errors:props.errors[index]}}
                            containerClass="tableInputContainer"
                            onChange={(name,value)=>this.props.changeTableField("purchaseProduct","products",index,name,value)}/></td>
                <td>
                    <label>{t("Summa")}:</label>&nbsp;{totals.summa.toFixed(2)}<br/>
                    <label>{t("Total")}:</label>&nbsp;{totals.total.toFixed(2)}
                </td>
                <td>
                    <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeProduct(index)}
                    />
                </td>
            </tr>
        )
    }

    calculateProductRow(product) {
        let price = 0;
        let count = 0;
        let discount = 0;
        if (!isNaN(product.price)) price = product.price;
        if (!isNaN(product.count)) count = product.count;
        if (!isNaN(product.discount)) discount = product.discount;
        return {summa: price*count, total: price*count - discount}
    }

    renderProductsFooter(item) {
        if (!item.products.length) return null;
        let totals = item.products.map(product => {
            let totals = this.calculateProductRow(product);
            totals["discount"] = !isNaN(product.discount) ? product.discount : 0
            return totals;
        }).reduce((accum,value) => {
            if (!accum) accum = {summa:0,total:0,discount:0};
            return {summa:accum.summa+value.summa,total:accum.total+value.total,discount:accum.discount+value.discount}
        })
        if (!totals) return null;
        return (
            <tr>
                <td colSpan={5}>
                    <label>{t("Summa")}</label>:{totals.summa.toFixed(2)}&nbsp;
                    <label>{t("Total")}</label>:{totals.total.toFixed(2)}&nbsp;
                    <label>{t("Discount")}</label>:{totals.discount.toFixed(2)}
                </td>
            </tr>
        )
    }

    renderDiscounts(item,labels) {
        return [
            <div className="row" key="f1">
                <label className="col-sm-3">{labels["purchaseDiscounts"]}</label>
                <Button iconClass="glyphicon glyphicon-plus" className="btn-xs btn btn-success" text={t("Add")}
                        onPress={() => this.props.addDiscount()}
                />
            </div>,
            <table key="f2" className="table table-bordered table-condensed">
                <tbody>
                {this.renderDiscountsHeader()}
                {this.renderDiscountsTableRows(item)}
                {this.renderDiscountsFooter(item)}
                </tbody>
            </table>
        ]
    }

    renderDiscountsHeader() {
        const labels = this.props.getDiscountTableLabels();
        return (
            <tr>
                <th style={{width:"50%"}}>{labels["discount"]}</th>
                <th>{labels["amount"]}</th>
                <th>{t("Actions")}</th>
            </tr>
        )
    }

    renderDiscountsTableRows(item) {
        return item.purchaseDiscounts.map((discount,index) => this.renderDiscountsTableRow(discount,index))
    }

    renderDiscountsTableRow(discount,index) {
        let props = {errors: this.props.errors["purchaseDiscounts"] ? this.props.errors["purchaseDiscounts"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        let discountType = discount.discount.uid ? discount.discount.uid : discount.discount;
        return (
            <tr key={"discount_"+index}>
                <td>
                    <Select inputClass="tableInput" name="discount" value={discountType} items={this.props.discounts_list}
                        ownerProps={{errors:props.errors[index]}}
                        containerClass="tableInputContainer"
                        onChange={(name,value)=>this.props.changeTableField("purchaseDiscount","purchaseDiscounts",index,name,value)}/>
                </td>
                <td><Input inputClass="tableInput"  name="amount" value={discount.amount} containerClass="tableInputContainer"
                       ownerProps={{errors:props.errors[index]}}
                       onChange={(name,text)=>this.props.changeTableField("purchaseDiscount","purchaseDiscounts",index,name,text)}/>
                </td>
                <td>
                    <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeDiscount(index)}
                    />
                </td>
            </tr>
        )
    }

    renderDiscountsFooter(item) {
        if (!item.purchaseDiscounts.length) return null;
        let totals = item.purchaseDiscounts.map(discount => discount.amount).reduce((accum,value) => {
            if (!accum) accum = 0;
            return !isNaN(parseFloat(value)) ? parseFloat(accum) + parseFloat(value) : parseFloat(accum)
        });
        totals = parseFloat(totals);
        if (isNaN(totals)) return null;
        return (
            <tr>
                <td colSpan={5}>
                    <label>{t("Total")}</label>:{totals.toFixed(2)}&nbsp;
                </td>
            </tr>
        )
    }

}