import { IProduct } from '../../types/index.ts'

export class Cart {
  private productsList: IProduct [] = [];

  getProductsList(): IProduct [] {
    return this.productsList;
  }

  addProductInCart(product: IProduct): void {
    this.productsList.push(product);
  }

  removeProductInCart(product: IProduct): void {
    this.productsList = this.productsList.filter(p => p.id !== product.id);
  }

  clearCart(): void {
    this.productsList = [];
  }

  getTotalPrice(): number {
    return this.productsList.reduce((sum, product) => sum + (product.price ?? 0), 0);
  }

  getTotalProductsInCart(): number {
    return this.productsList.length;
  }

  hasProduct(id: string): boolean {
    return this.productsList.some(product => product.id === id);
  }
}