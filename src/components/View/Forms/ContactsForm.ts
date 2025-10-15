import { ensureElement } from '../../../utils/utils.ts';
import { IEvents } from '../../base/Events.ts';
import { Form, TForm } from '../Forms/Form.ts';

type TContactsForm = {
  emailElement: HTMLInputElement;
  phoneElement: HTMLInputElement;
} & TForm

export class ContactsForm extends Form<TContactsForm> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

   constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.emailElement.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'email', value: this.emailElement.value });
      this.validateContactsForm();
    });
    
    this.phoneElement.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'phone', value: this.phoneElement.value });
      this.validateContactsForm();
    });

    this.nextButton.textContent = 'Оплатить';
    this.nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.nextButton.disabled) return;
      this.events.emit('contacts:submit');
    });
  }

  set emailValue(value: string) {
    this.emailElement.value = value;
  }

  set phoneValue(value: string) {
    this.phoneElement.value = value;
  }

  validateContactsForm(): boolean {
    const emailValid = this.emailElement.value.trim().length > 0;
    const phoneValid = this.phoneElement.value.trim().length > 0;
    
    this.isButtonValid = emailValid && phoneValid;
    
    if (!emailValid && !phoneValid) {
      this.errors = 'Заполните email и телефон';
    } else if (!emailValid) {
      this.errors = 'Укажите email';
    } else if (!phoneValid) {
      this.errors = 'Укажите телефон';
    } else {
      this.errors = '';
    }
    
    return this.isButtonValid;
  }
}


