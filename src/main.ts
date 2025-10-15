import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { IOrderRequest, TPayment } from './types/index.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events.ts';
import { Basket } from './components/View/Basket.ts';
import { Gallery } from './components/View/Gallery.ts';
import { Header } from './components/View/Header.ts';
import { Modal } from './components/View/Modal.ts';
import { OrderSuccess } from './components/View/OrderSuccess.ts';
import { CardBasket } from './components/View/Cards/CardBasket.ts';
import { CardCatalog } from './components/View/Cards/CardCatalog.ts';
import { CardPreview } from './components/View/Cards/CardPreview.ts';
import { ContactsForm } from './components/View/Forms/ContactsForm.ts';
import { OrderForm } from './components/View/Forms/OrderForm.ts';
import { ensureElement, cloneTemplate } from './utils/utils.ts';

const events = new EventEmitter();

const productsModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

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
  const items = products.map((item) => {
    const card = new CardCatalog(events, cloneTemplate(cardCatalogTempl));
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
  gallery.render({ catalog: items });
}

productsModel.on('catalog:changed', () => renderCatalog());

function openCardPreview(id: string) {
  const product = productsModel.getProductById(id);
  if(!product) return;

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
  };

  modal.content = cardPreview.render();
  modal.open();
}

events.on('card:open', (data: { card: string }) => {
  openCardPreview(data.card);
});

function renderBasket() {
  const products = cartModel.getProductsList();
  const items = products.map((item, index) => {
    const card = new CardBasket(events, cloneTemplate(cardBasketTempl));
    card.index = index + 1;
    return card.render(item);
  });
  basket.items = items;
  basket.total = cartModel.getTotalPrice();
}

events.on('basket:open', () => {
  const basketContent = basket.render();

  modal.content = basketContent;
  modal.open();
});

events.on('basket:check', (data: { card: string; callback: (inCart: boolean) => void }) => {
  const inCart = cartModel.hasProduct(data.card);
  data.callback(inCart);
});

events.on('card:add', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product) {
    cartModel.addProduct(product);
  }
});

events.on('card:delete', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product) {
    cartModel.removeProduct(product);
  }
});

function updatePreviewButton(cardId: string, inCart: boolean) {
  const currentPreview = document.querySelector('.modal_active .card_full');
  if (currentPreview && currentPreview.id === cardId) {
    const button = currentPreview.querySelector('.card__button') as HTMLButtonElement;
    if (button) {
      button.textContent = inCart ? 'Удалить из корзины' : 'Купить';
    }
  }
}

cartModel.on('basket:changed', () => {
  renderBasket();
  header.counter = cartModel.getTotalProducts();

  const currentPreview = document.querySelector('.modal_active .card_full');
  if (currentPreview) {
    const productId = currentPreview.id;
    const inCart = cartModel.hasProduct(productId);
    updatePreviewButton(productId, inCart);
  }
});

events.on('basket:ready', () => {
  if (cartModel.getTotalProducts() === 0) {
    return;
  }
  
  buyerModel.clear();
  const buyer = buyerModel.getBuyerData();
  orderForm.payment = buyer.payment;
  orderForm.addressValue = buyer.address;

  modal.content = orderForm.render();
  modal.open();
});

buyerModel.on('form:errors', (errors: any) => {
  orderForm.validateForm(errors);
  contactsForm.validateForm(errors);
});

events.on('order:change', (data: { field: string; value: string }) => {
  if (data.field === 'payment') {
    buyerModel.setBuyerPayment(data.value as TPayment);
  } else if (data.field === 'address') {
    buyerModel.setBuyerAddress(data.value);
  } else if (data.field === 'email') {
    buyerModel.setBuyerEmail(data.value);
  } else if (data.field === 'phone') {
    buyerModel.setBuyerPhone(data.value);
  }
});

events.on('order:next', () => {
  const errors = buyerModel.validateOrder();
  
  if (errors.address || errors.payment) {
    const errorMessages = [];
    if (errors.address) errorMessages.push(errors.address);
    if (errors.payment) errorMessages.push(errors.payment);
  
    orderForm.errors = errorMessages.join(', ');
    return;
  }
 
  const buyer = buyerModel.getBuyerData();
  contactsForm.emailValue = buyer.email;
  contactsForm.phoneValue = buyer.phone;
  
  modal.content = contactsForm.render();
});


events.on('contacts:submit', () => {
  const errors = buyerModel.validateContacts();
  
 if (errors.email || errors.phone) {
    const errorText = [];
    if (errors.email) errorText.push(errors.email);
    if (errors.phone) errorText.push(errors.phone);
  
    contactsForm.errors = errorText.join(', ');
    return;
  }

  const orderData: IOrderRequest = {
    payment: buyerModel.getBuyerData().payment,
    email: buyerModel.getBuyerData().email,
    phone: buyerModel.getBuyerData().phone,
    address: buyerModel.getBuyerData().address,
    total: cartModel.getTotalPrice(),
    items: cartModel.getProductsList().map(product => product.id)
  }

  larekApi
    .submitOrder(orderData)
    .then(() => {
      cartModel.clearCart();
      buyerModel.clear();
      orderSuccess.total = orderData.total;
      modal.content = orderSuccess.render();
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});
    
events.on('success:closed', () => {
  modal.close();
});

larekApi
  .fetchProductsList()
  .then((products) => {
    productsModel.setProductsList(products);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });
















