import { TAKE_PHOTO } from '@/assets/javascript/constants'
const blobsBuffer = {}

let _localStream = null
export function setLocalStream(localStream) {
  _localStream = localStream
}
export function getLocalStream() {
  return _localStream
}

export async function onDataChannelMessage(dataChannelEvent) {
  console.log('onDataChannel', dataChannelEvent)
  if (dataChannelEvent.data === TAKE_PHOTO) {
    const imageCapture = new ImageCapture(_localStream.getVideoTracks()[0])
    const blob = await imageCapture.takePhoto()
    const dataUrl = await blobToDataURL(blob)
    const chunks = dataUrlToChunkedArray(dataUrl)
    sendChunkedArray(chunks, dataChannelEvent.target)
  } else {
    try {
      const data = JSON.parse(dataChannelEvent.data)
      if (data.size) {
        collectChunk(data)
      }
    } catch (e) {
      console.log(e)
      /* do nothing */
    }
  }
}

function saveToDisk(data, fileName) {
  const a = document.createElement('a')
  a.style = 'display: none'
  document.body.appendChild(a)
  a.href = data
  a.download = fileName
  a.click()
}

function collectChunk(chunk) {
  if (!blobsBuffer[chunk.id]) {
    blobsBuffer[chunk.id] = []
  }
  const collection = blobsBuffer[chunk.id]
  collection.push(chunk)

  if (isFullfilledCollection(collection)) {
    blobsBuffer[chunk.id] = null
    const dataUrl = unwrapChanks(collection).join('')
    saveToDisk(dataUrl, '1.png')
  }
}

function isFullfilledCollection(collection) {
  if (!collection.length) return false
  const collectionSize = collection[0].size
  const map = {}
  collection.forEach((chunk) => (map[chunk.index] = 1))
  for (let i = 0; i < collectionSize; i++) {
    if (!map[i]) {
      return false
    }
  }
  return true
}

export function dataUrlToChunkedArray(dataUrl, chunkSize = 10000) {
  const chunks = []
  while (dataUrl.length > chunkSize) {
    const chunk = dataUrl.slice(0, chunkSize)
    dataUrl = dataUrl.slice(chunkSize)
    chunks.push(chunk)
  }
  if (dataUrl.length) chunks.push(dataUrl)

  return chunks
}

export function sendChunkedArray(chunkedArray, dataChannel) {
  const wrappedChunks = wrapChunks(chunkedArray)
  const stringifiedWrappedChunks = wrappedChunks.map((wrappedChunk) =>
    JSON.stringify(wrappedChunk)
  )
  for (let i = 0; i < stringifiedWrappedChunks.length; i++) {
    dataChannel.send(stringifiedWrappedChunks[i])
    // await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

// TODO swap Math random to nanoId
export function wrapChunks(chunks) {
  const id = Math.random()
  return chunks.map((chunk, index) => ({
    chunk,
    id,
    index,
    size: chunks.length
  }))
}

export function unwrapChanks(wrappedChunks) {
  const sortedChunks = wrappedChunks.sort(
    (wrappedChunkA, wrappedChunkB) => wrappedChunkA.index - wrappedChunkB.index
  )

  return sortedChunks.map((wrappedChunk) => wrappedChunk.chunk)
}

export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

//* *blob to dataURL**
export function blobToDataURL(blob) {
  const a = new FileReader()
  return new Promise((resolve) => {
    a.onload = function(e) {
      resolve(e.target.result)
    }
    a.readAsDataURL(blob)
  })
}
