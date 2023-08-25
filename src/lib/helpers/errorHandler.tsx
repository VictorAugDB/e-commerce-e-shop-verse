export function errorHandler(err: unknown): Error {
  if (err instanceof Error) {
    if (process.env.NODE_ENV !== 'production') {
      return err
    } else {
      return new Error('Internal server error.')
    }
  } else {
    return new Error('Internal server error.')
  }
}
