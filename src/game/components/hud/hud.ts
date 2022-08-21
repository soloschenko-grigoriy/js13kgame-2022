import { Game } from '@/game'
import { IComponent } from '@/utils'

export class GameHUDComponent implements IComponent {
  public Entity: Game

  private _elm: HTMLElement
  private _inDangerElm: HTMLElement
  private _savedElm: HTMLElement

  public Awake(): void {
    const elm = document.body.querySelector<HTMLElement>('#hud')
    if(elm){
      this._elm = elm
    }

    const inDangerElm = document.body.querySelector<HTMLElement>('#inDanger')
    if(inDangerElm){
      this._inDangerElm = inDangerElm
    }

    const savedElm = document.body.querySelector<HTMLElement>('#saved')
    if(savedElm){
      this._savedElm = savedElm
    }
  }

  public Update(deltaTime: number): void {
    this._inDangerElm.innerText = this.Entity.Nation.PeopleInDanger.toString()
    this._savedElm.innerText = this.Entity.Nation.PeopleSaved.toString()
  }
}
