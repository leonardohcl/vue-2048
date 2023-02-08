import { ITutorial } from "@/model/Game Utils/Tutorial";

const routine: ITutorial = {
  title: "Save/Load",
  routine: [
    {
      highlight: ".memory-manager__save",
      dialog: {
        content: "If you want you can also save your progess so far",
      },
      dialogPosition: { vertical: "bottom", horizontal: "right-inset" },
    },
    {
      highlight: ".memory-manager__load",
      dialog: {
        content: "Or restore a previous saved game",
        append: true
      },
    },
  ],
};

export default routine;
