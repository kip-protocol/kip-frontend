import {
  AskRequest,
  AskResponse,
  BaseResponse,
  CreateCollectionRequest,
  GetAnswerRequest,
  GetAnswerResponse,
  GetAnswerURIRequest,
  GetAnswerURIResponse,
  GetCanAskRequest,
  GetCanAskResponse,
  GetCollectionsCoverResponse,
  GetURIRequest,
  GetURIResponse,
  UploadResponse,
} from '@/types'
import { HTTP } from '@/utils/requests'

const request = new HTTP({
  baseURL: 'https://kip-test.kipley.ai',
  timeout: 10 * 1000,
})

const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return await request.post<BaseResponse<UploadResponse>>(
    '/file/uploadFile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 20 * 1000,
    }
  )
}

const uploadCover = async (file: File) => {
  const formData = new FormData()
  formData.append('cover', file)
  return await request.post<BaseResponse<UploadResponse>>(
    '/file/uploadCover',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 20 * 1000,
    }
  )
}

const getURI = async (data: GetURIRequest) => {
  return await request.post<BaseResponse<GetURIResponse>>(
    '/collection/getURI',
    data
  )
}

const getAnswerURI = async (data: GetAnswerURIRequest) => {
  return await request.post<BaseResponse<GetAnswerURIResponse>>(
    '/collection/getAnswerURI',
    data
  )
}

const createCollection = async (data: CreateCollectionRequest) => {
  return await request.post<BaseResponse<boolean>>(
    '/collection/createCollection',
    data
  )
}

const getCollectionsCover = async (data: { ids: number[] }) => {
  return await request.post<BaseResponse<GetCollectionsCoverResponse[]>>(
    '/collection/getCollectionsCover',
    data
  )
}

const ask = async (data: AskRequest) => {
  return await request.post<BaseResponse<AskResponse>>('/query/ask', data, {
    timeout: 20 * 1000,
  })
}

const getAnswer = async (data: GetAnswerRequest) => {
  return await request.post<BaseResponse<GetAnswerResponse>>(
    '/query/getAnswer',
    data
  )
}

const getCanAsk = async (data: GetCanAskRequest) => {
  return await request.post<BaseResponse<GetCanAskResponse>>(
    '/query/getCanAsk',
    data
  )
}

export {
  uploadFile,
  uploadCover,
  getURI,
  getAnswerURI,
  createCollection,
  getCollectionsCover,
  ask,
  getAnswer,
  getCanAsk,
}
