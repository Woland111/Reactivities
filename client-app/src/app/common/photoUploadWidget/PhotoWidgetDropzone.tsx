import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'

const dropzoneStyle = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    height: '200px',
    paddingTop: '30px',
    textAlign: 'center' as 'center'
}

const dropzoneActive = {
    borderColor: 'green'
}

interface IProps {
    setFiles: (files: object[]) => void
}

const PhotoWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })))
  }, [setFiles])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...dropzoneStyle, ...dropzoneActive} : dropzoneStyle} >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drag image here" />
    </div>
  )
}

export default PhotoWidgetDropzone