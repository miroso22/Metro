const cache = {
    metroSystems = new Map()
    stations = new Map()
    lines = new Map()
    passengers = new Map()
    administrators = new Map()
    advertisements = new Map()
    advertisers = new Map()
    complaints = new Map()
    contracts = new Map()
    routes = new Map()
    trains = new Map()
    workers = new Map()
}
function update() {
    for (const data of cache) {
        const iterator = map[Symbol.iterator]()
        for (let item of iterator) {
            item = Object.create(item, item.name)
        }
    }
}

setTimeOut(update, 60000)