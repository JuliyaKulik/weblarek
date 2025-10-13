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
    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });
    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'card' });
    });
    this.addressElement.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'address', value: this.addressElement.value });
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');
        
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
      } else {
        this.cashButton.classList.add('button_alt-active');
        }
  }

  set addressValue(value: string) {
    this.addressElement.value = value;
  }
}