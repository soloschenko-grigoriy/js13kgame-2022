import { Node } from '@/node'
import { HouseDrawComponent } from './components'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Settings } from '@/settings'
import { Nation } from '@/nation'

export class House extends Entity implements IBuilding {
  private _population = 0
  private _modalElm: HTMLElement
  private _templateEml: HTMLElement
  private _closeModalBtn: HTMLButtonElement
  private _evacuateBtn: HTMLButtonElement
  private _evacuationAmountElm: HTMLElement
  private _onClose = ():void => this.HideModal()
  private _onEvacuate = ():void => this.Evacuate()

  private _isModalOpen = false

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
    this._modalElm = document.body.querySelector('.modal') as HTMLElement
    this._templateEml = document.body.querySelector('#houseTemplate') as HTMLElement
    this._evacuationAmountElm = document.body.querySelector('#evacAmount') as HTMLElement
    this._closeModalBtn = document.body.querySelector('.closeModal') as HTMLButtonElement
    this._evacuateBtn = document.body.querySelector('#evacBtn') as HTMLButtonElement
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(!this._isModalOpen){
      return
    }

    if(!this._canEvacuate){
      this._evacuateBtn.setAttribute('disabled', 'disabled')
    } else {
      this._evacuateBtn.removeAttribute('disabled')
    }
  }

  public Destroy(): void {
    this._nation.ReduceTotalPopulation(this._population)
    console.log(`House destroyed, ${this._population} people died`)
  }

  public ShowModal(): void {
    this._evacuationAmountElm.innerText = this.GetEvacuationAmount().toString()

    this._modalElm.appendChild(this._templateEml)
    this._modalElm.classList.remove(Settings.hiddenClassName)
    this._templateEml.classList.remove(Settings.hiddenClassName)

    this._closeModalBtn.addEventListener('click', this._onClose)
    this._evacuateBtn.addEventListener('click', this._onEvacuate)

    this._isModalOpen = true
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

  private HideModal(): void {
    this._isModalOpen = false

    this._modalElm.classList.add(Settings.hiddenClassName)
    this._templateEml.classList.add(Settings.hiddenClassName)

    document.body.appendChild(this._templateEml)

    this._closeModalBtn.removeEventListener('click', this._onClose)
    this._evacuateBtn.removeEventListener('click', this._onEvacuate)
  }

  private GetEvacuationAmount(): number {
    let amount = Settings.evacuationAmount
    if(this._population < amount){
      amount = this._population
    }

    return amount
  }
}
