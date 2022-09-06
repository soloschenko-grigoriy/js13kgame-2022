import { IComponent } from '@/utils'
import { Settings } from '@/settings'
import { Turret } from '@/buildings'
import { BuildingState } from '../../state'

export class TurretExplosionComponent implements IComponent {
  public Entity: Turret

  private _elapsedSinceExplosion = 0

  public Awake(): void {
    //
  }

  public Update(deltaTime: number): void {
    if(this.Entity.State !== BuildingState.Exploding){
      return
    }

    if(this._elapsedSinceExplosion >= Settings.buildings.turret.explosionTime){
      this.Entity.Destroy()
      return
    }

    this._elapsedSinceExplosion += deltaTime
  }
}
