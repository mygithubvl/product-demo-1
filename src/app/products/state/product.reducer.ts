// import { Product } from "../product";
// import * as fromRoot from '../../state/app.state';

// export interface State extends fromRoot.State {
//     products: ProductState;
//   }

// // State for this feature (Product)
// export interface ProductState {
//     showProductCode: boolean;
//     currentProduct: Product;
//     products: Product[];
//   }
  

// export function productReducer(state: ProductState, action: any): ProductState {
//     switch (action.type) {

//         case 'TOGGLE_PRODUCT_CODE':
//             console.log('existing state: ' + JSON.stringify(state));
//             console.log('payload: ' + action.payload);

//             return {
//                 ...state,
//                 showProductCode: action.payload
//             };

//         default:
//             return state;
//     }
// }

import { Product } from '../product';

/* NgRx */
import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as ProductActions from './product.actions';
import * as AppState from '../../state/app.state';

// Extends the app state to include the product feature.
// This is required because products are lazy loaded.
// So the reference to ProductState cannot be added to app.state.ts directly.
export interface State extends AppState.State {
  products: ProductState;
}

// State for this feature (Product)
export interface ProductState {
  showProductCode: boolean;
  currentProduct: Product;
  products: Product[];
}

const initialState: ProductState = {
  showProductCode: true,
  currentProduct: {
      id: null,
      productName: '',
      productCode: '',
      description: '',
      starRating: 0
  },
  products: []
};

// SELECTORS ====================================================
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
  getProductFeatureState,
  (state: any) => 
    state.productReducer.showProductCode
);

export const getCurrentProduct = createSelector(
  getProductFeatureState,
  (state: any) => 
    state.productReducer.currentProduct
);

export const getProducts = createSelector(
  getProductFeatureState,
  (state: any) => 
    state.productReducer.products
);


//  REDUCER ====================================================
export const productReducer = createReducer<ProductState>(
  initialState,
  on(ProductActions.toggleProductCode, (state): ProductState => {

    console.log("vl: state = ", state);
    return {
      ...state,
      showProductCode: !state.showProductCode
    };
  }),
  on(ProductActions.setCurrentProduct, (state, action): ProductState => {
    return {
      ...state,
      currentProduct: action.product
    };
  }),
  on(ProductActions.clearCurrentProduct, (state): ProductState => {
    return {
      ...state,
      currentProduct: {
          id: null,
          productName: '',
          productCode: '',
          description: '',
          starRating: 0
      }
    };
  }),
  on(ProductActions.initializeCurrentProduct, (state): ProductState => {
    return {
      ...state,
      currentProduct: {
        id: 0,
        productName: '',
        productCode: 'New',
        description: '',
        starRating: 0
      }
    };
  })
);
