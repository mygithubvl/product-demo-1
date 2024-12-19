import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { select, Store } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import { getShowProductCode } from '../state/product.reducer';
import * as ProductActions from '../state/product.actions';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
  , standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage?: string;

  displayCode?: boolean;

  products?: Product[];

  // Used to highlight the selected product in the list
  selectedProduct?: Product | null;
  sub?: Subscription;

  constructor(private store: Store<fromProduct.State>,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.sub = this.productService.selectedProductChanges$.subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products = products,
      error: err => this.errorMessage = err
    });

    //TODO: Unsubscribe
    // this.store.pipe(select('products')).subscribe(
    // // this.store.select('products').subscribe(
    //   products => {
    //     if(products) {
    //         console.log("vl: products = " + JSON.stringify(products));
    //         console.log(`vl: showProductCode = ${products.showProductCode}`);
    //       this.displayCode = products.showProductCode;
    //         console.log("vl: this.displayCode = " + this.displayCode);
    //     }
    //   }
    // )
    this.store.select(getShowProductCode).subscribe(
      showProductCode => {
        console.log("vl: subscribe  showProductCode = ", showProductCode);
        this.displayCode = showProductCode
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // checkChanged(event: Event): void {
  //   // this.displayCode = !this.displayCode;
  //   const value = (<HTMLInputElement>event.target).checked;
  //   this.store.dispatch({
  //     type: 'TOGGLE_PRODUCT_CODE',
  //     payload: value
  //   });
  // }

  checkChanged(): void {
    this.store.dispatch(ProductActions.toggleProductCode());
  }


  newProduct(): void {
    this.productService.changeSelectedProduct(this.productService.newProduct());
  }

  productSelected(product: Product): void {
    this.productService.changeSelectedProduct(product);
  }

}
