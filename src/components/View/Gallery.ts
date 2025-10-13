import { Component } from '../base/Component.ts';
import { ensureElement } from '../../utils/utils.ts';

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

   constructor(container?: HTMLElement) {
    // Если контейнер не передан, находим его по селектору
    super(container || ensureElement<HTMLElement>('.gallery'));
    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}