import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import _ from 'lodash';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  public productList: any[] = [];
  public productListRes: any[] = [];
  public toShowVariant: boolean[] = [];
  public positions = [
    new ConnectionPositionPair({
      originX: 'end',
      originY: 'top'
    }, {
      overlayX: 'end',
      overlayY: 'bottom'
    },
      0,
      50)

  ];
  public tagArray: any[] = [];
  public selected: boolean = true;

  constructor(private productService: ProductService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProductList()
  }
  ngAfterViewInit() {

  }
  loadProductList() {
    this.productService.getProductList().subscribe(res => {
      if (res) {
        this.productListRes = res;
        this.productList = res;
        let temptagArray = this.productList.map(x => {
          let obj = {}
          obj['tagName'] = x.tag;
          obj['state'] = false;
          return obj
        });
        this.tagArray = _.uniqBy(temptagArray, 'tagName');
      }
    })
  }

  calculateDiscount(cp, mp) {
    let discount = Math.floor(((mp - cp) / mp) * 100);
    return `(${discount}% OFF)`;
  }

  showVariant(product) {
    if (product.options.length > 0) {
      this.toShowVariant[product.id] = true
    } else {
      this.toShowVariant[product.id] = false;
    }
  }

  addToCart(product, variant) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = {};
    dialogConfig.data.productList= this.productListRes
    dialogConfig.data.productDetails = product;
    dialogConfig.data.productVariant = variant;
    const dialogRef = this.dialog.open(AddToCartComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(data => {

    })
  }

  addFilter(tag, ev: MatChipSelectionChange) {
    tag.state = ev.selected;
    if (ev.selected) {
      this.productList = this.productList.filter(x => x.tag == tag.tagName)
    } else {
      this.productList = this.productListRes;
      this.selected = true;
    }
  }

  sortAscending() {
    this.productList = this.productList.sort(function (a, b) {
      return a.price - b.price
    })
  }

  sortDescending() {
    this.productList = this.productList.sort(function (a, b) {
      return b.price - a.price
    })
  }

}
