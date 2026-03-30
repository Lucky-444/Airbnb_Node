import RoomCategory from "../db/models/roomCatagory";
import BaseRepository from "./base.repository";

export class RoomCategoryRepository extends BaseRepository<RoomCategory> {
  constructor() {
    super(RoomCategory);
  }
}
