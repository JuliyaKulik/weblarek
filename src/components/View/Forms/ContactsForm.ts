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
    });
    this.phoneElement.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'phone', value: this.phoneElement.value });
    });
  }

  set emailValue(value: string) {
    this.emailElement.value = value;
  }

  set phoneValue(value: string) {
    this.phoneElement.value = value;
  }
}

