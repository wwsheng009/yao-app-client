import type { YaoApplication } from "./yao";

export class YaoClient {
    client!: YaoApplication;

    with(y: YaoApplication) {
        this.client = y;
        return this;
    }
}