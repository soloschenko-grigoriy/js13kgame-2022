import { Game } from '@/game'
import { IComponent } from '@/utils'

export class GameHUDComponent implements IComponent {
  public Entity: Game

  private _elm: HTMLElement
  private _populationElm: HTMLElement

  public Awake(): void {
    const elm = document.body.querySelector<HTMLElement>('#hud')
    if(elm){
      this._elm = elm
    }

    const _populationElm = document.body.querySelector<HTMLElement>('#population')
    if(_populationElm){
      this._populationElm = _populationElm
    }
  }

  public Update(deltaTime: number): void {
    this._populationElm.innerText = this.Entity.Nation.Population.toString()
  }
}
