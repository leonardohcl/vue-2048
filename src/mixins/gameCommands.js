import { useKeypress } from 'vue3-keypress'
import { useSwipe } from '@/mixins/swipe'

const COMMAND_KEYS = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  right: 'right',
  left: 'left',
  top: 'up',
  bottom: 'down',
}

export function useGameCommands(game, swipeTarget = '', moveCallback = null) {
  const COOLDOWN = {
    active: false,
    timeout: null,
  }

  const canMove = (dir) => {
    if (COOLDOWN.active) return false
    if (game.paused || game.gameOver || game.winner) return false
    return dir ? game.canMove[dir] : true
  }

  const startCooldown = () => {
    COOLDOWN.active = true
    if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout)
    COOLDOWN.timeout = setTimeout(() => {
      COOLDOWN.active = false
    }, game.updateDelay)
  }

  const move = async (dir) => {
    if (!canMove(dir)) return
    startCooldown()
    await game.move(dir)
    if(moveCallback) moveCallback(dir)
}

const undo = async () => {
    if (!canMove()) return
    startCooldown()
    await game.undo()
    if(moveCallback) moveCallback('undo')
  }

  const keyboardCommand = (cmd) => {
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
    const swipeCommand = (cmd) => {
      move(COMMAND_KEYS[cmd])
    }

    useSwipe(swipeTarget, swipeCommand)
  }

  return {
    move,
    undo,
    canMove
  }
}
