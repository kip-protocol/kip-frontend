export type CollectionTuple = [
  bigint,
  string,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
]

export type Collection = {
  cover?: string
  id: number
  creator: string
  supply: number
  price: bigint
  royalty: number
  category: number
  queryCount: number
  mintCount: number
}

export const buildCollection = (collection: CollectionTuple): Collection => {
  return {
    id: parseInt(collection[0].toString(), 10),
    creator: collection[1],
    supply: parseInt(collection[2].toString(), 10),
    price: BigInt(collection[3]),
    royalty: parseInt(collection[4].toString(), 10),
    category: parseInt(collection[5].toString(), 10),
    queryCount: parseInt(collection[6].toString(), 10),
    mintCount: parseInt(collection[7].toString(), 10),
  }
}

export type QuestionTuple = [
  bigint,
  bigint,
  string,
  string,
  string,
  bigint,
  boolean
]

export type Question = {
  id: number
  questionId: number
  question: string
  queryor: string
  owner: string
  time: number
  isMint: boolean
}

export const buildQueryHistory = (question: QuestionTuple): Question => {
  return {
    id: parseInt(question[0].toString(), 10),
    questionId: parseInt(question[1].toString(), 10),
    question: question[2],
    queryor: question[3],
    owner: question[4],
    time: parseInt(question[5].toString(), 10),
    isMint: question[6],
  }
}

export const getMsg = (addr: string) => {
  return `Please sign in this message to prove you owned the EOA ${addr}`
}
