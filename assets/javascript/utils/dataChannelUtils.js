import { nanoid } from 'nanoid'
import { TAKE_PHOTO } from '@/assets/javascript/constants'
import { eventBus } from '@/assets/javascript/utils/eventBus'
const blobsBuffer = {}

let _localStream = null
export function setLocalStream(localStream) {
  _localStream = localStream
}
export function getLocalStream() {
  return _localStream
}

const canvasElement = document.createElement('canvas')
const ctx = canvasElement.getContext('2d')

export async function onDataChannelMessage(
  dataChannelEvent,
  dataChannelToSend
) {
  if (dataChannelEvent.data === TAKE_PHOTO) {
    const blob = await new Promise((resolve) => {
      const video = document.querySelector('video') // Workaround: Here we need to get HTML5Video element for cheap image capture in safari. Using querySelector is not an obvious/stable way, but it fast to implement.
      canvasElement.width = video.videoWidth
      canvasElement.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      canvasElement.toBlob(resolve)
    })

    const dataUrl = await blobToDataURL(blob)
    const chunks = dataUrlToChunkedArray(dataUrl)
    sendChunkedArray(chunks, dataChannelToSend)
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
  eventBus.$emit('saveToDisk')
}

export async function takeAndSavePhotoFromLocalStream() {
  const blob = await new Promise((resolve, reject) => {
    const video = document.querySelector('#main-stream-id') // Workaround: Here we need to get HTML5Video element for cheap image capture in safari. Using querySelector is not an obvious/stable way, but it fast to implement.
    if (!video) reject(new Error('no video found'))
    canvasElement.width = video.videoWidth
    canvasElement.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    canvasElement.toBlob(resolve)
  })

  const dataUrl = await blobToDataURL(blob)
  saveToDisk(dataUrl, 'L_' + generateName())
}

function generateName() {
  let numberString = localStorage.getItem('photoNumber')
  if (!numberString) {
    localStorage.setItem('photoNumber', 0)
    numberString = '0'
  }
  let numberInt = Number.parseInt(numberString)
  numberInt += 1
  localStorage.setItem('photoNumber', numberInt)

  numberString = numberInt.toString()

  while (numberString.length < 4) numberString = '0' + numberString

  return `IMG${numberString}.png`
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
    saveToDisk(dataUrl, 'O_' + generateName())
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

export async function sendChunkedArray(chunkedArray, dataChannel) {
  const wrappedChunks = wrapChunks(chunkedArray)
  const stringifiedWrappedChunks = wrappedChunks.map((wrappedChunk) =>
    JSON.stringify(wrappedChunk)
  )
  for (let i = 0; i < stringifiedWrappedChunks.length; i++) {
    dataChannel.send(stringifiedWrappedChunks[i])
    await new Promise((resolve) => setTimeout(resolve, 1))
  }
}

export function wrapChunks(chunks) {
  const id = nanoid()
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

export function blobToDataURL(blob) {
  const a = new FileReader()
  return new Promise((resolve) => {
    a.onload = function(e) {
      resolve(e.target.result)
    }
    a.readAsDataURL(blob)
  })
}
