import { ensureElement } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';
import { Form, TForm } from '../Forms/Form.ts';
import { TPayment } from '../../../types/index.ts';

type TOrderForm = {
  addressElement: HTMLInputElement;
  cashButton: HTMLButtonElement;
  cardButton: HTMLButtonElement;
} & TForm

export class OrderForm extends Form<TOrderForm> {
  protected addressElement: HTMLInputElement;
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cashButton.classList.remove('button_alt-active');
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.addEventListener('click', () => {
      this.setPayment('cash');
      this.validateOrderForm();
    });
    
    this.cardButton.addEventListener('click', () => {
      this.setPayment('card');
      this.validateOrderForm();
    });
    
    this.addressElement.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'address', value: this.addressElement.value });
      this.validateOrderForm();
    });

     this.nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.nextButton.disabled) return;
      this.events.emit('order:next');
    });
  }

  private setPayment(payment: TPayment): void {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');

    if (payment === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (payment === 'cash') {
      this.cashButton.classList.add('button_alt-active');
    }
    
    this.events.emit('order:change', { field: 'payment', value: payment });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');

    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
    }
  }

  set addressValue(value: string) {
    this.addressElement.value = value;
  }

  validateOrderForm(): boolean {
    const addressValid = this.addressElement.value.trim().length > 0;
    const paymentSelected = this.cardButton.classList.contains('button_alt-active') || 
                            this.cashButton.classList.contains('button_alt-active');
    
    this.isButtonValid = addressValid && paymentSelected;
    
    if (!addressValid) {
      this.errors = 'Укажите адрес доставки';
    } else if (!paymentSelected) {
      this.errors = 'Не выбран вид оплаты';
    } else {
      this.errors = '';
    }
    
    return this.isButtonValid;
  }
}
