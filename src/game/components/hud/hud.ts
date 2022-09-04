import { Game } from '@/game'
import { IComponent } from '@/utils'

export class GameHUDComponent implements IComponent {
  public Entity: Game

  private _elm: HTMLElement
  private _inDangerElm: HTMLElement
  private _savedElm: HTMLElement
  private _evacHelperElm: HTMLElement

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

    const evacHelperElm = document.body.querySelector<HTMLElement>('#evac')
    if(evacHelperElm){
      this._evacHelperElm = evacHelperElm
    }
  }

  public Update(deltaTime: number): void {
    this._inDangerElm.innerText = this.Entity.Nation.PeopleInDanger.toString()
    this._savedElm.innerText = this.Entity.Nation.PeopleSaved.toString()

    const timeTillEvac = this.Entity.Nation.TimeTillNextEvacuation
    if(timeTillEvac === 0){
      this._evacHelperElm.textContent = 'Evacuation bus is ready! Please send people to safety!'
    } else {
      this._evacHelperElm.textContent = `Time till next evacuation bus: ${timeTillEvac}`
    }
  }
}
