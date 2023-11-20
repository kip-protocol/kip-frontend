import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react'
import moment from 'moment'
import Header from '@/assets/header.jpg'

import './index.less'
import React, { useEffect, useState } from 'react'
import { CONTRACT_MAP } from '@/web3'
import {
  Collection,
  Question,
  QuestionTuple,
  buildCollection,
  buildQueryHistory,
  getMsg,
} from '@/utils/helper'
import { formatUnits, parseUnits } from 'ethers'
import { useAccount, useSignMessage, useSwitchNetwork } from 'wagmi'
import { KIPQueryAddress } from '@/config'
import { ask, getAnswer, getAnswerURI, getCanAsk } from '@/api'
import { useWithdraw } from './hooks/useWithdraw'
import { useApprove } from './hooks/useApprove'
import { useQuery } from './hooks/useQuery'
import { useMint } from './hooks/useMint'

type Metadata = {
  name: string
  image: string
  description: string
}

type CollectionWithMetadata = Metadata & Collection

type QueryHistoryItemProps = Question & {
  onMint: () => void
}

const QueryHistoryItem = ({
  questionId,
  question,
  time,
  isMint,
  onMint,
}: QueryHistoryItemProps) => {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const { data, signMessage } = useSignMessage()
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { writeWithSetURI, isSuccess, isLoading } = useMint(
    questionId,
    address!
  )

  useEffect(() => {})

  const handleGetAnswer = async () => {
    if (address) {
      const msg = getMsg(address)
      signMessage({ message: msg })
    }
  }

  const handleMint = async () => {
    setLoading(true)
    const [err, res] = await getAnswerURI({ name: question })
    if (!err && res.data) {
      writeWithSetURI(res.data)
    } else {
      window.alert('Get info failed, try again.')
      setLoading(false)
      return
    }
  }

  useEffect(() => {
    if (data) {
      getAnswer({
        questionId,
        address: address!,
        message: getMsg(address!),
        signature: data,
      }).then(([err, res]) => {
        if (!err && res.data) {
          setAnswer(res.data)
          onOpen()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (isSuccess) {
      onMint()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <div className="kip-query-item">
      <div className="kip-query__info">
        <div className="kip-query__question">{question}</div>
        <div className="kip-query__other">
          <span className="kip-query__time">
            {moment(new Date(time * 1000), 'YYYY-MM-DD HH:mm:ss').fromNow()}
          </span>
          <Link className="kip-query__answer" onClick={handleGetAnswer}>
            View answer
          </Link>
        </div>
      </div>
      <div className="kip-query__func">
        {!isMint && (
          <Button
            color="primary"
            isLoading={loading || isLoading}
            onClick={handleMint}
          >
            Mint
          </Button>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Answer</ModalHeader>
          <ModalBody>
            <p>Question: {question}</p>
            <p>Answer: {answer}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

const Detail = () => {
  // Query form
  const [questionId, setQuestionId] = useState(0)
  const [answer, setAnswer] = useState('')
  const [askIsLoading, setAskIsLoading] = useState(false)

  const [canAskQuestion, setCanAskQuestion] = useState('')
  const [approved, setApproved] = useState(false)
  const [paid, setPaid] = useState(false)

  // User info
  const { address } = useAccount()
  const [balance, setBalance] = useState(0n)

  // Collection info
  const [collection, setCollection] = useState<CollectionWithMetadata>()
  const [questions, setQuestions] = useState<Question[]>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { switchNetwork } = useSwitchNetwork()

  const {
    withdrawAmount,
    setWithdrawAmount,
    write: withdrawWrite,
    isSuccess: withdrawIsSuccess,
    isLoading: withdrawIsLoading,
  } = useWithdraw()

  const {
    setAllowanceAmount,
    write: approveWrite,
    isSuccess: approveIsSuccess,
    isLoading: approveIsLoading,
  } = useApprove()

  const {
    question,
    setQuestion,
    write: queryWrite,
    isSuccess: queryIsSuccess,
    isLoading: queryIsLoading,
  } = useQuery(0)

  const { data: signature, signMessage } = useSignMessage({
    message: question,
  })

  useEffect(() => {
    switchNetwork?.(80001)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const parseSearch = () => {
    const search = window.location.search
    const queryMap = new Map<string, string>()
    search
      .replace('?', '')
      .split('&')
      .map((keyValue) => {
        queryMap.set(keyValue.split('=')[0], keyValue.split('=')[1])
      })
    return queryMap
  }

  const init = (id: number) => {
    Promise.all([
      handleGetInfo(id),
      handleGetQueryHistory(id),
      handleGetBalance(),
      handleGetAllowance(),
      handleGetCanAsk(id, address!),
    ]).then(
      ([
        { collection, metadata },
        questions,
        balance,
        allowance,
        canAskQuestion,
      ]) => {
        setCollection({
          ...collection,
          ...metadata,
        })
        setQuestions(questions)
        setBalance(balance)
        setCanAskQuestion(canAskQuestion)
        setQuestion(canAskQuestion)
        if (allowance < collection.price) {
          setAllowanceAmount(collection.price)
        }
        setApproved(allowance >= collection.price)
      }
    )
  }

  const handleGetInfo = async (id: number) => {
    const uri = await CONTRACT_MAP.KIP.uri(id)
    const collection = await handleGetCollection(id)
    const metadata = await handleGetMetadata(uri)
    return { collection, metadata }
  }

  const handleGetCollection = async (id: number): Promise<Collection> => {
    const res = await CONTRACT_MAP.KIPQuery.getCollection(id)
    return buildCollection(res)
  }

  const handleGetMetadata = async (uri: string): Promise<Metadata> => {
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`)
    return await res.json()
  }

  const handleGetQueryHistory = async (id: number): Promise<Question[]> => {
    const questions = await CONTRACT_MAP.KIPQuery.getQuestions(id)
    return questions.map((question: QuestionTuple) =>
      buildQueryHistory(question)
    )
  }

  const handleGetBalance = async () => {
    return await CONTRACT_MAP.KIPQuery.getBalance(address)
  }

  const handleGetAllowance = async () => {
    console.log(await CONTRACT_MAP.KIPToken.allowance(address, KIPQueryAddress))
    return await CONTRACT_MAP.KIPToken.allowance(address, KIPQueryAddress)
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (amount > balance) {
      return
    }
    withdrawWrite?.()
  }

  const handleApproval = async (e: React.MouseEvent) => {
    e.preventDefault()
    approveWrite?.()
  }

  const handleQuery = async (e: React.MouseEvent) => {
    e.preventDefault()
    queryWrite?.()
    CONTRACT_MAP.KIPQuery.on('Query', (...args) => {
      const _questionId = parseInt(args[1], 10)
      setQuestionId(_questionId)
      CONTRACT_MAP.KIPQuery.off('Query')
    })
  }

  const handleGetCanAsk = async (collectionId: number, queryor: string) => {
    const [err, res] = await getCanAsk({ collectionId, queryor })
    if (!err && res.data !== null) {
      return res.data
    } else {
      return ''
    }
  }

  const handleAsk = async (e: React.MouseEvent) => {
    e.preventDefault()
    setAskIsLoading(true)
    const msg = getMsg(address!)
    signMessage({
      message: msg,
    })
  }

  useEffect(() => {
    if (signature) {
      ask({
        collectionId: collection!.id,
        questionId: questionId,
        question,
        address: address!,
        message: getMsg(address!),
        signature: signature,
      })
        .then(([err, res]) => {
          if (!err && res.data) {
            setAnswer(res.data)
          }
        })
        .finally(() => {
          setAskIsLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  useEffect(() => {
    const query = parseSearch()
    init(parseInt(query.get('id')!, 10))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (withdrawIsSuccess) {
      window.alert('Withdraw success')
      handleGetBalance().then((res) => {
        setBalance(res)
      })
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawIsSuccess])

  useEffect(() => {
    if (approveIsSuccess) {
      window.alert('Approve Done')
      handleGetAllowance().then((res) => {
        setApproved(res >= collection!.price)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveIsSuccess])

  useEffect(() => {
    if (queryIsSuccess) {
      window.alert('Query Done')
      setPaid(true)
    }
  }, [queryIsSuccess])

  return (
    <div className="p-detail">
      <img className="kip-bg-header" src={Header} />
      <div className="kip-main">
        <div className="kip-main__left">
          <img className="kip-cover" src={collection?.image} />
          <Link
            className="kip-withdraw"
            color="primary"
            underline="always"
            onClick={(e) => {
              e.preventDefault()
              onOpen()
            }}
          >
            Withdraw
          </Link>
        </div>
        <div className="kip-main__right">
          <div className="kip-info">
            <div className="kip-info__name">{collection?.name || '-'}</div>
            <div className="kip-info__owner">
              <Link
                href={`https://testnets.opensea.io/${collection?.creator}`}
                target="_blank"
              >
                Owner: {collection?.creator.slice(2, 8).toUpperCase() || '-'}
              </Link>
            </div>
            <div className="kip-info__description">
              <div className="kip-label">Description</div>
              <div className="kip-value">{collection?.description || '-'}</div>
            </div>
            <div className="kip-info__price">
              <div className="kip-label">Price per Query</div>
              <div className="kip-value">
                ${collection?.price ? formatUnits(collection.price, 18) : 0}{' '}
                USDT
              </div>
            </div>
          </div>
          <div className="kip-ask mt-8 mb-4">
            <Input
              className="pr-0"
              placeholder="Ask me anything"
              value={question}
              onValueChange={setQuestion}
              readOnly={!!canAskQuestion}
              endContent={
                <>
                  {!approved && !canAskQuestion && (
                    <Button
                      color="primary"
                      isLoading={approveIsLoading}
                      onClick={(e) => handleApproval(e)}
                    >
                      Approval
                    </Button>
                  )}
                  {approved && !canAskQuestion && !paid && (
                    <Button
                      color="primary"
                      isLoading={queryIsLoading}
                      onClick={(e) => handleQuery(e)}
                    >
                      Pay
                    </Button>
                  )}
                  {(paid || !!canAskQuestion) && (
                    <Button
                      color="primary"
                      isLoading={askIsLoading}
                      onClick={(e) => handleAsk(e)}
                    >
                      Ask
                    </Button>
                  )}
                </>
              }
            />
            {answer && <h1 className="my-8">Answer: {answer}</h1>}
          </div>
          <div className="kip-history">
            <Tabs variant="underlined">
              <Tab key="history" title="Query History">
                {questions?.map((question) => (
                  <QueryHistoryItem
                    key={question.questionId}
                    {...question}
                    onMint={() => init(parseInt(parseSearch().get('id')!, 10))}
                  />
                ))}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Withdraw bonus</ModalHeader>
              <ModalBody>
                <p>Balance: ${formatUnits(balance, 18)}</p>
                <Input
                  type="number"
                  label="Amount"
                  labelPlacement="outside"
                  placeholder="Please enter amount to withdraw"
                  value={withdrawAmount}
                  onValueChange={setWithdrawAmount}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={parseUnits(withdrawAmount || '0', 18) > balance}
                  isLoading={withdrawIsLoading}
                  onPress={handleWithdraw}
                >
                  Withdraw
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Detail
