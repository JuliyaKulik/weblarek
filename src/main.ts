import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { apiProducts } from './utils/data.ts';
import { IBuyer } from './types/index.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { IOrderRequest } from './types';

const productsModel = new Catalog();
productsModel.setProductsList(apiProducts.items);
console.log('Массив товаров из каталога:' , productsModel.getProductsList());

apiProducts.items.map(item => {
  const itemId = item.id;
  console.log('Поиск товара по id: ', itemId);
  const foundedItem =  productsModel.getProductById(itemId);
  console.log('founded item: ', foundedItem);
});

const selectedItem = productsModel.getProductsList()[0];
const selectedItem2 = productsModel.getProductsList()[1];

productsModel.setSelectedProduct(selectedItem);
console.log('Выбранный товар из каталога: ', productsModel.getSelectedProduct());

const cartModel = new Cart();

cartModel.addProductInCart(selectedItem);
cartModel.addProductInCart(selectedItem2);

console.log('Добавили товар в корзину: ', cartModel.getProductsList());
console.log('Проверка на наличие товара в корзине:', cartModel.hasProduct(selectedItem.id));
console.log('Общая стоимость товаров в корзине:', cartModel.getTotalPrice());
console.log('Общее количество товаров в корзине:', cartModel.getTotalProductsInCart());

cartModel.removeProductInCart(selectedItem);
console.log('Удалили товар из корзины: ', cartModel.getProductsList());

cartModel.clearCart();
console.log('Почистили корзину: ', cartModel.getProductsList());

const buyerModel = new Buyer();

const buyer: IBuyer = {
  payment: 'card',
  email: 'ivan1994@mail.ru',
  phone: '+375445005757',
  address: 'Belarus',
};

buyerModel.setBuyerData(buyer);
console.log('Получены все данные покупателя: ', buyerModel.getBuyerData());

buyerModel.setBuyerPayment('');
console.log('Данные покупателя с изменением одного поля: ', buyerModel.getBuyerData());
buyerModel.setBuyerAddress('     ');
console.log('Данные покупателя измененими полей: ', buyerModel.getBuyerData());

buyerModel.validateBuyerData();
console.log('Валидация данных: ', buyerModel.validateBuyerData());

buyerModel.clear();
console.log('Данные покупателя удалены: ', buyerModel.getBuyerData());

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

larekApi
  .fetchProductsList()
  .then((products) => {
    console.log('Полученно данных с сервера: ', products.length);
    productsModel.setProductsList(products);
    console.log('Каталог сохранен в массив: ', productsModel.getProductsList());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });

  
















