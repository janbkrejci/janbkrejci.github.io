class ODB {
  constructor(Ipfs, OrbitDB) {
    this.OrbitDB = OrbitDB
    this.node = new Ipfs({
      preload: { enabled: false },
      repo: './ipfs',
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] }
      }
    })

    this.node.on('error', (e) => { throw (e) })
    this.node.on('ready', this._init.bind(this))
  }

  async _init() {
    this.orbitdb = await this.OrbitDB.createInstance(this.node)

    this.defaultOptions = {
      accessController: { write: [this.orbitdb.identity.id] }
    }

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: 'hash', //podle jakého pole se bude indexovat
    }

    this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
    
    await this.pieces.load()

    this.onready()
  }

  async addNewPiece(hash, instrument = 'Piano') {
    //const existingPiece = this.getPieceByHash(hash)
    //if (existingPiece) {
      //await this.updatePieceByHash(hash, instrument)
      //return
    //}

    const cid = await this.pieces.put({ hash, instrument })
    return cid
  }

  //test
  async go() {
    const cid = this.addNewPiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ")
    //const content = await this.node.dag.get(cid)
    //console.log(content.value.payload)
  }
}

try {
  const Ipfs = require('ipfs')
  const OrbitDB = require('orbit-db')

  module.exports = exports = new ODB(Ipfs, OrbitDB)
} catch (e) {
  window.DB = new ODB(window.Ipfs, window.OrbitDB)
}