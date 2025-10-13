import { Component } from '../../base/Component.ts';
import { ensureElement } from '../../../utils/utils.ts';
import { IProduct } from '../../../types/index.ts';

export type TCard = Pick<IProduct, 'title' | 'price' | 'id'>;

export class Card<T = {}> extends Component<TCard & T>  {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  public idElement: string = '';

  constructor(container: HTMLElement) {
    super(container);
    
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set id(id: string) {
    this.idElement = id;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}