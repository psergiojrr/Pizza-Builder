import { notification } from 'antd'

const getErrorMessage = (error: string | unknown): string => {
  let message = 'Something went wrong'

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string }
    if (err.message) {
      message = err.message
    } else {
      try {
        message = JSON.stringify(error)
      } catch {
        message = (error as Object).toString()
      }
    }
  }

  return message
}

const notify = (params: {
  title: string
  message: string
  level: 'success' | 'error'
  duration?: number
}) => {
  notification[params.level]({
    message: params.title,
    description: params.message,
    duration: params.duration,
    style: { paddingRight: '45px' },
  })
}

const notifySuccess = (message: string, title: string = 'Success!', duration: number = 4.5) => {
  notify({
    level: 'success',
    title,
    message,
    duration,
  })
}

const notifyError = (error: string | unknown, title: string = 'Error!', duration: number = 4.5) => {
  const message = getErrorMessage(error)
  notify({
    level: 'error',
    title,
    message,
    duration,
  })
}

export const useNotifier = () => {
  return {
    notifySuccess,
    notifyError,
  }
}
