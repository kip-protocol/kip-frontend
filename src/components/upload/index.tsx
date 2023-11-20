import { useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'

import './index.less'
import { uploadCover, uploadFile } from '@/api'
import { Progress } from '@nextui-org/react'

enum AcceptType {
  Image = 0,
  Document = 1,
}

type DropFile = File & {
  preview?: string
}

type UploadProps = {
  // Upload component accept file MIME
  accept?: Accept
  // Upload component accept file type
  acceptType?: AcceptType
  // Max size of upload file(unit: bytes)
  maxSize?: number
  // Upload component tip
  tip?: string
  // Upload component width, default is 100%
  width?: number
  // Upload component height, default is auto
  height?: number
  // Event of upload
  onUpload: (key: string) => void
}

const Upload = ({
  accept = {
    'image/*': ['.png', '.jpeg'],
  },
  acceptType = AcceptType.Image,
  maxSize = 1024 * 1024 * 5,
  tip = 'PNG or JPEG. Max 5MB',
  height,
  onUpload,
}: UploadProps) => {
  const [file, setFile] = useState<DropFile>()
  const [loading, setLoading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    maxFiles: 1,
    onDrop: async (acceptedFile, rejectedFile) => {
      setLoading(true)
      if (rejectedFile.length) {
        window.alert(rejectedFile[0].errors[0].message)
        setLoading(false)
        return
      }

      if (acceptedFile.length && acceptType === AcceptType.Image) {
        const [err, result] = await uploadCover(acceptedFile[0])
        if (err) {
          window.alert('Upload failed, please try again')
        } else {
          onUpload(result.data)
          setFile(
            Object.assign(acceptedFile[0], {
              preview: URL.createObjectURL(acceptedFile[0]),
            })
          )
        }
      }

      if (acceptedFile.length && acceptType === AcceptType.Document) {
        const [err, result] = await uploadFile(acceptedFile[0])
        if (err) {
          window.alert('Upload failed, please try again.')
        } else {
          onUpload(result.data)
          setFile(acceptedFile[0])
        }
      }

      setLoading(false)
    },
  })

  const Prewview = () => {
    return (
      <div className="kip-dropzone__preview">
        {acceptType === AcceptType.Image ? (
          <img className="kip-dropzone__preview-img" src={file!.preview} />
        ) : (
          <div className="kip-dropzone__preview-doc">
            <p>File Name: {file!.name}</p>
            <p className="kip-dropzone__preview-tip">
              Click here to upload again
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div {...getRootProps({ className: 'kip-dropzone' })} style={{ height }}>
      {loading ? (
        <Progress
          size="sm"
          isIndeterminate
          label="Uploading..."
          aria-label="Loading..."
          className="max-w-md"
        />
      ) : file ? (
        <Prewview />
      ) : (
        <>
          <input {...getInputProps({ className: 'kip-dropzone__input' })} />
          <p className="kip-dropzone__placeholder">
            Drop your files OR <span>Click here to browse</span>
          </p>
          <p className="kip-dropzone__tip">{tip}</p>
        </>
      )}
    </div>
  )
}

export default Upload
