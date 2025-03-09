import { Connection } from "mongoose"

declare global {
    var mongoose: {
        connect: Connection | null,
        promise: Promise<Connection> | null
    }
}

export {} // This is a hack to prevent TS from throwing an error