import { IProduct } from '../../types/index.ts';

export class Catalog {
  private productsList: IProduct [] = [];
  private selectedProduct: IProduct | null = null;

  setProductsList(products: IProduct[]): void {
    this.productsList = products;
  }

  getProductsList(): IProduct [] {
    return this.productsList;
  }

  getProductById(id: string): IProduct | null {
    return this.productsList.find(product => product.id === id) || null;
  }

  selectProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

}