import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  public productDetail: any;
  public productVariant: any;
  public cartProduct: any[] = [];
  public cartCalculator: any[] = [];
  constructor(private dialogRef: MatDialogRef<AddToCartComponent>,
    @Inject(MAT_DIALOG_DATA) private data) {
    this.productDetail = data.productDetails;
    this.productVariant = data.productVariant;
    this.prepareCart()
  }
  ngOnInit(): void {
  }

  prepareCart() {
    this.cartProduct = this.data.productList.filter((element) => element.id == this.productDetail.id &&
      element.options.some((subElement) => subElement.id == this.productVariant.id))
      .map(element => {
        return Object.assign({}, element, { options: element.options.filter(subElement => subElement.id == this.productVariant.id) });
      });
    this.cartCalculator = this.cartProduct.map(function (el) {
      var o = Object.assign({}, el);
      o.count = 1;
      return o;
    })
  }

  checkoutCart() {
    this.dialogRef.close(this.cartProduct);
  }

  addItem(product) {
    for (let i = 0; i < this.cartCalculator.length; i++) {
      if (this.cartCalculator[i].options.indexOf(product) > -1) {
        this.cartCalculator[i]['count'] = this.cartCalculator[i]['count'] + 1;
      } else {
        this.cartCalculator[i]['count'] = 0;
      }
    }
  }

  getCartTotal() {
    for (let i = 0; i < this.cartCalculator.length; i++) {
      if (this.cartCalculator[i].count > 0) {
        let sum = parseInt(this.cartCalculator[i].count) * parseInt(this.cartCalculator[i].price)
        return sum
      }
    }
  }

  removeItem(product) {
    for (let i = 0; i < this.cartCalculator.length; i++) {
      if (this.cartCalculator[i].count >= 1) {
        this.cartCalculator[i].count = this.cartCalculator[i].count - 1;
      } else {
      }
    }
  }


}
