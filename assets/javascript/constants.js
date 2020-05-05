export const ROLE_PHOTOGRAPH = 'ROLE_PHOTOGRAPH'
export const ROLE_CAMERA = 'ROLE_CAMERA'
export const ROLE_MONITOR = 'ROLE_MONITOR'

export const TAKE_PHOTO = 'TAKE_PHOTO'
export const OK = 'OK'

export const ROLE_PATH_MAP = {
  ROLE_MONITOR: '/monitor',
  ROLE_CAMERA: '/camera',
  ROLE_PHOTOGRAPH: '/'
}

export const PATH_ROLE_MAP = {
  '/monitor': ROLE_MONITOR,
  '/camera': ROLE_CAMERA,
  '/': ROLE_PHOTOGRAPH
}

export const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19305' },
  { urls: 'stun:stun1.l.google.com:19305' },
  { urls: 'stun:stun2.l.google.com:19305' },
  { urls: 'stun:stun3.l.google.com:19305' },
  { urls: 'stun:stun4.l.google.com:19305' },
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
]
