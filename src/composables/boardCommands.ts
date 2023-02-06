import { useKeypress } from 'vue3-keypress'
import { useSwipe } from "@/composables/swipe"
import GameController from '@/model/2048 Standard/GameController'
import { MoveDirection } from '@/model/2048/interfaces/Game'

const COMMAND_KEYS: { [key: string]: MoveDirection } = {
  ArrowUp: MoveDirection.Up,
  ArrowRight: MoveDirection.Right,
  ArrowDown: MoveDirection.Down,
  ArrowLeft: MoveDirection.Left,
  right: MoveDirection.Right,
  left: MoveDirection.Left,
  top: MoveDirection.Up,
  bottom: MoveDirection.Down,
}

type BoardCommand = MoveDirection | "undo"

export function useGameCommands(game: GameController, swipeTarget = '', moveCallback?: (dir: BoardCommand, success: boolean, pointsAdded: number) => void) {
  const COOLDOWN: {
    active: boolean,
    timeout: NodeJS.Timeout | null
  } = {
    active: false,
    timeout: null,
  }

  const canMove = (dir?: MoveDirection) => {
    if (COOLDOWN.active) return false
    if (game.paused || !game.isRunning) return false
    return dir ? game.canMove[dir] : true
  }

  const startCooldown = () => {
    COOLDOWN.active = true
    if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout)
    COOLDOWN.timeout = setTimeout(() => {
      COOLDOWN.active = false
    }, game.updateDelay)
  }

  const move = async (dir: MoveDirection) => {
    let moved = false, pointsAdded = 0
    if (canMove(dir)) {
      startCooldown()
      const { success, pointsGained } = await game.move(dir)
      moved = success
      pointsAdded = pointsGained
    }
    if (moveCallback) moveCallback(dir, moved, pointsAdded)
  }

  const undo = async () => {
    if (!canMove()) return
    startCooldown()
    const {success, pointsLost} = await game.undo()
    if (moveCallback) moveCallback('undo', success, -pointsLost)
  }

  const keyboardCommand = (cmd: { event: { key: string } }) => {
    move(COMMAND_KEYS[cmd.event.key])
  }

  useKeypress({
    keyEvent: 'keydown',
    keyBinds: [
      'up',
      'down',
      'right',
      'left',
      'ArrowUp',
      'ArrowDown',
      'ArrowRight',
      'ArrowLeft',
    ].map((key) => ({
      keyCode: key,
      preventDefault: true,
      success: keyboardCommand,
    })),
  })

  if (swipeTarget) {
    const swipeCommand = (cmd: string) => {
      move(COMMAND_KEYS[cmd])
    }

    useSwipe(swipeTarget, swipeCommand)
  }

  return {
    move,
    undo,
    canMove,
  }
}
