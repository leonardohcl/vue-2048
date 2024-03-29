import { ITutorial } from "@/model/Game Utils/Tutorial";

const StandardGameplayTutorial: ITutorial = {
  title: "Rules",
  routine: [
    {
      highlight: { x: "center", y: "center" },
      dialog: {
        content:
          "2048 is a puzzle game where the objective is to slide blocks on the board to combine them and create a block with the number 2048.",
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: "center", horizontal: "center" },
    },
    {
      dialog: {
        content:
          "The game board is a grid with blocks of different numbers. You can slide the blocks up, down, left, or right to combine them.",
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      highlight: { x: "center", y: "center" },
      dialog: {
        content:
          "When you move the blocks, they will slide in that direction until they hit either a wall or another block.",
        append: true,
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: "center", horizontal: "center" },
    },
    {
      dialog: {
        content:
          "When two blocks with the same number touch, they merge into a single block with the combined value.",
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          "You win the if you can keep merging blocks until you reach the 2048 block.",
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          "The game is over when you can no longer move the blocks and there are no more possible combinations.",
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
  ],
};

export default StandardGameplayTutorial;
