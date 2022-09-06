import { IComponent } from '@/utils'
import { Settings } from '@/settings'
import { EnemyState } from '../../state'
import { Enemy } from '../../enemy'

export class EnemyExplosionComponent implements IComponent {
  public Entity: Enemy

  private _elapsedSinceExplosion = 0

  public Awake(): void {
    //
  }

  public Update(deltaTime: number): void {
    if(this.Entity.State !== EnemyState.Exploding){
      return
    }

    if(this._elapsedSinceExplosion >= Settings.enemy.explosionTime){
      this.Entity.Kill()
      return
    }

    this._elapsedSinceExplosion += deltaTime
  }
}
