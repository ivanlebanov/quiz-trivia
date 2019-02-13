import * as types from "@/store/types";

export default {
  rooms: (state, id) => {
    return state.rooms;
  },
  currentRoom: (state, id) => {
    return state.currentRoom;
  },
};
