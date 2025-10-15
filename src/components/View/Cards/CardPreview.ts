import { IEvents } from '../../base/Events.ts';
import { ensureElement } from '../../../utils/utils.ts';
import { IProduct } from '../../../types/index.ts';
import { Card, TCard } from '../Cards/Card.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants.ts';

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = Pick<IProduct, 'category' | 'image' | 'description' > & TCard & {
  inCart?: boolean;
};

export class CardPreview extends Card<TCardPreview> {
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected imageElement: HTMLImageElement;
  protected _inCart: boolean = false;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
      
    this.cardButton.addEventListener('click', () => {
      this.events.emit('basket:check', { 
        card: this.id,
        callback: (currentlyInCart: boolean) => {
          if (currentlyInCart) {
            this.events.emit('card:delete', { card: this.id });
          } else {
            this.events.emit('card:add', { card: this.id });
          }
        }
      });
    });
  }
  
  set category(value: string) {
    this.categoryElement.textContent = value;
      for (const key in categoryMap) {
        this.categoryElement.classList.toggle(
          categoryMap[key as CategoryKey],
          key === value);
      }
  }
  
  set image(value: string) {
    const pngImage = value.replace('.svg', '.png');
    this.setImage(this.imageElement, `${CDN_URL}/${pngImage}`, this.title || '');
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCart(value: boolean) {
    this._inCart = value; 
    this.updateButtonState();
  }

  private updateButtonState() {
    if (this.price === null) {
      this.cardButton.disabled = true;
      this.cardButton.textContent = 'Недоступно';
    } else if (this._inCart) {
      this.cardButton.disabled = false;
      this.cardButton.textContent = 'Удалить из корзины';
    } else {
      this.cardButton.disabled = false;
      this.cardButton.textContent = 'Купить';
    }
  }

  disableButton() {
    this.cardButton.disabled = true;
    this.cardButton.textContent = 'Недоступно';
  }
}
