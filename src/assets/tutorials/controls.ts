import { ITutorial } from "@/model/Game Utils/Tutorial";

const tutorial: ITutorial = {
  title: "Controls",
  routine: [
    {
      highlight: ".board",
      highlightConfig: {padding: 10},
      dialog: {
        content:
          "To move the blocks, swipe your finger/mouse over the board in the direction you want the tiles to move.",
      },
      dialogPosition: { vertical: "top", horizontal: "center" },
    },
    {
      highlight: ".game__controls",
      highlightConfig: {padding: 10},
      dialog: {
        content:
          "You can also use the arrows on the keyboard or this buttons to move,",
      },
      dialogPosition: { vertical: "top", horizontal: "center" },
    },
    {
        dialog: {content: "They also show if a move is valid or not.", append: true}
    }    
  ],
};

export default tutorial;
