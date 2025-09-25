import { IBuyer, TPayment } from '../../types/index.ts'

export class Buyer {
  private payment: TPayment = 'card';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setBuyerData(data: IBuyer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }

  setBuyerPayment(value: TPayment) { 
    this.payment = value; 
  }

  setBuyerEmail(value: string) {
    this.email = value;
  }

  setBuyerPhone(value: string) {
    this.phone = value;
  }

  setBuyerAddress(value: string) {
    this.address = value;
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
  }

  validateBuyerData(): { payment?: string; email?: string; phone?: string; address?: string } {
    const errors: { payment?: string; email?: string; phone?: string; address?: string } = {};
    
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