export class EmailExistsError extends Error {
  constructor () {
    super('This email is already in use')
    this.name = 'EmailExistsError'
  }
}
