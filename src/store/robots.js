import { save, load, forget } from '@/utils/local-memory'
import RobotFactory from '@/model/NeuralNetwork/RobotFactory'

const recordPrefix = 'vue2048',
  factoriesId = `${recordPrefix}.factories`

const availableFactories = load(factoriesId) || []

const formatFactoryId = (id) => `${factoriesId}.${id}`

const loadFactories = () =>
  availableFactories.map((id) => {
    const records = load(formatFactoryId(id))
    return RobotFactory.fromRecords(records)
  })

const saveFactoryList = () => {
  save(factoriesId, availableFactories)
}

const addToFactoryList = (id) => {
  if (availableFactories.find((x) => x === id)) return
  availableFactories.push(id)
  saveFactoryList()
}

const removeFromFactoryList = (id) => {
  const idx = availableFactories.findIndex((x) => x === id)
  if (idx >= 0) availableFactories.splice(idx, 1)
  saveFactoryList()
}

const saveFactory = (factory) => {
  save(formatFactoryId(factory.id), factory.records)
  addToFactoryList(factory.id)
}

const deleteFactory = (id) => {
  forget(formatFactoryId(id))
  removeFromFactoryList(id)
}

export default {
  namespaced: true,
  state: {
    factories: loadFactories(),
  },
  getters: {
    getFactory: (state) => (id) => state.factories.find((x) => x.id == id),
    factories: (state) => state.factories.map((x) => x.id),
  },
  mutations: {
    saveFactory: (state, factory) => {
      state.factories.push(factory)
      saveFactory(factory)
    },
    removeFactory: (state, id) => {
      const idx = state.factories.findIndex((factory) => factory.id === id)
      if (idx < 0) return
      state.factories.splice(idx, 1)
      deleteFactory(id)
    },
  },
}
