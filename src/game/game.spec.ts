import { Game, mockGameFactory } from '@/game'
import { Grid } from '@/grid'
import { GameInputComponent } from './components'

describe('>>> Game', () => {
  let game: Game

  beforeEach(() => {
    game = mockGameFactory()
    window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb())
  })


  it('should start update loop next frame after awake', () => {
    const spy = jest.spyOn(game, 'Update')
    game.Awake()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should awake and update all Components', () => {
    const spyAwakeGameClickComp = jest.spyOn(GameInputComponent.prototype, 'Awake')
    const spyUpdateGameClickComp = jest.spyOn(GameInputComponent.prototype, 'Update')

    expect(spyAwakeGameClickComp).not.toBeCalled()
    expect(spyUpdateGameClickComp).not.toBeCalled()

    game.Awake()
    expect(spyAwakeGameClickComp).toBeCalled()

    game.Update()
    expect(spyUpdateGameClickComp).toBeCalled()
  })

  it('should awake and update all children', () => {
    const spyGridAwake = jest.spyOn(Grid.prototype, 'Awake')
    const spyGridUpdate = jest.spyOn(Grid.prototype, 'Update')

    expect(spyGridAwake).not.toBeCalled()
    expect(spyGridUpdate).not.toBeCalled()

    game.Awake()
    expect(spyGridAwake).toBeCalled()

    game.Update()
    expect(spyGridUpdate).toBeCalled()
  })
})
