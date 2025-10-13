import { IBuyer, TPayment, IErrors } from '../../types/index.ts';
import { EventEmitter } from "../base/Events";

export class Buyer extends EventEmitter {
  protected  payment: TPayment = 'card';
  protected  email: string = '';
  protected  phone: string = '';
  protected  address: string = '';

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    this.emit('buyer:changed');
  }

  setBuyerPayment(value: TPayment) { 
    this.payment = value;
    this.emit('buyer:changed'); 
  }

  setBuyerEmail(value: string) {
    this.email = value;
    this.emit('buyer:changed');
  }

  setBuyerPhone(value: string) {
    this.phone = value;
    this.emit('buyer:changed');
  }

  setBuyerAddress(value: string) {
    this.address = value;
    this.emit('buyer:changed');
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('buyer:changed'); 
    this.emit('buyer:cleared');
  }

  validateBuyerData(): IErrors {
    const errors: IErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    } 

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите емэйл';
    }

    if(!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }

    if(!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
}