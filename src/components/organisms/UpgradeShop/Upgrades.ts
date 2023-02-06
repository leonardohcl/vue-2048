import { Base2Item, RegularItem } from "@/model/Game Utils/Item";

/**
 * These are the upgrades available for the current game design,
 * 
 * Their prices take in consideration an average of 20 coins
 * per run in the early game and 40 coins in the late game
 **/
export default [
    new Base2Item({
        id: "winningBlock",
        name: "Final Block",
        baseValue: 64,
        capacity: 7,
        prices: [45, 175, 325, 415],
        defaultPrice: 500
    }),
    new RegularItem({
        id: "historySize",
        icon: "fas fa-brain",
        name: "Memory",
        prices: [500, 750, 750, 1000],
        capacity: 5,
    }),
    new RegularItem({
        id: "width",
        name: "Width",
        baseValue: 3,
        capacity: 5,
        prices: [150, 350, 600, 750, 900],
        icon: "fas fa-arrows-left-right"
    }),
    new RegularItem({
        id: "height",
        name: "Height",
        baseValue: 3,
        capacity: 5,
        prices: [150, 350, 600, 750, 900],
        icon: "fas fa-arrows-up-down"
    }),
]