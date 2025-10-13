import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { apiProducts } from './utils/data.ts';
import { IBuyer, IOrderRequest, IProduct } from './types/index.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events.ts';
import { Basket } from './components/View/Basket.ts';
import { Gallery } from './components/View/Gallery.ts';
import { Header } from './components/View/Header.ts';
import { Modal } from './components/View/Modal.ts';
import { OrderSuccess } from './components/View/OrderSuccess.ts';
import { Card } from './components/View/Cards/Card.ts';
import { CardBasket } from './components/View/Cards/CardBasket.ts';
import { CardCatalog } from './components/View/Cards/CardCatalog.ts';
import { CardPreview } from './components/View/Cards/CardPreview.ts';
import { Form } from './components/View/Forms/Form.ts';
import { ContactsForm } from './components/View/Forms/ContactsForm.ts';
import { OrderForm } from './components/View/Forms/OrderForm.ts';
import { ensureElement, cloneTemplate } from './utils/utils.ts';

const productsModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

const events = new EventEmitter();

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('.modal'));

const orderSuccessTempl = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTempl = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTempl = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTempl = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTempl = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTempl = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTempl = ensureElement<HTMLTemplateElement>('#contacts');

const basket = new Basket(events, cloneTemplate(basketTempl));
const orderForm = new OrderForm(events, cloneTemplate(orderFormTempl));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsFormTempl));
const orderSuccess = new OrderSuccess(events, cloneTemplate(orderSuccessTempl));


function renderCatalog() {
  const products = productsModel.getProductsList();
  const items = products.map((p) => {
    const card = new CardCatalog(events, cloneTemplate(cardCatalogTempl));
    return card.render({
      id: p.id,
      title: p.title,
      image: p.image,
      category: p.category,
      price: p.price,
    });
  });
  gallery.render({ catalog: items });
}

productsModel.on('catalog:changed', () => renderCatalog());

events.on('card:open', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
    
  if (!product) return;
 
  const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTempl));
  
  cardPreview.id = product.id;
  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = product.image;
  cardPreview.description = product.description;
   
  if (product.price === null) {
      cardPreview.disableButton();
  } else {
    const inCart = cartModel.hasProduct(product.id);
    cardPreview.inCart = inCart;
  }
    
  modal.content = cardPreview.render();
  modal.open();

});


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
















