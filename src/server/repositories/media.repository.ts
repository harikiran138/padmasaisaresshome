import { BaseRepository } from "./base.repository";
import Media, { IMedia } from "@/models/Media";
import { Document } from "mongoose";

export class MediaRepository extends BaseRepository<IMedia & Document> {
    constructor() {
        super(Media);
    }
}
