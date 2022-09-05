import { Node } from '@/node'
import { HouseDrawComponent } from './components'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Settings } from '@/settings'
import { Nation } from '@/nation'
import { Game } from '@/game'

export class House extends Entity implements IBuilding {
  private _population = 0
  private _templateEml: HTMLElement
  private _evacuationAmountElm: HTMLElement
  private _evacuateBtn: HTMLButtonElement
  private _onEvacuate = ():void => this.Evacuate()

  public get Population(): number {
    return this._population
  }

  public get Node(): Node {
    return this._node
  }

  private get _canEvacuate(): boolean {
    return this._nation.TimeTillNextEvacuation < 1 && this.GetEvacuationAmount() > 0
  }

  constructor(private readonly _node: Node, private readonly _nation: Nation){
    super()

    this._population = Settings.buildings.house.population
  }

  public Awake(): void {
    this.AddComponent(new HouseDrawComponent())

    // safe to cast since im sure elm is there... oh sweet naiveté!
    this._templateEml = document.body.querySelector('#houseTemplate') as HTMLElement
    this._evacuationAmountElm = this._templateEml.querySelector('#evacAmount') as HTMLElement
    this._evacuateBtn = this._templateEml.querySelector('#evacBtn') as HTMLButtonElement

    super.Awake()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)
  }

  public Move(people: number, to: IBuilding): void {
    if(people > this._population){
      return
    }

    to.Add(people)
    this._population -= people
  }

  public Add(people: number): void {
    this._population += people
  }

  public Destroy(): void {
    this._nation.ReduceTotalPopulation(this._population)
    console.log(`House destroyed, ${this._population} people died`)
  }

  public ShowModal(): void {
    this._evacuationAmountElm.innerText = this.GetEvacuationAmount().toString()
    this._evacuateBtn.addEventListener('click', this._onEvacuate)

    Game.GetInstance().ShowModal(this._templateEml)

    if(!this._canEvacuate){
      this._evacuateBtn.setAttribute('disabled', 'disabled')
    } else {
      this._evacuateBtn.removeAttribute('disabled')
    }
  }

  private HideModal(): void {
    this._evacuateBtn.removeEventListener('click', this._onEvacuate)
    this._evacuateBtn.removeAttribute('disabled')

    Game.GetInstance().HideModal()
  }


  private Evacuate():void {
    if(!this._canEvacuate){
      return
    }

    this.HideModal()

    this._nation.Evacuate(this.GetEvacuationAmount())
    this._population -= this.GetEvacuationAmount()

    if(this._population < 0){
      this._population = 0
    }
  }

  private GetEvacuationAmount(): number {
    let amount = Settings.evacuationAmount
    if(this._population < amount){
      amount = this._population
    }

    return amount
  }
}
