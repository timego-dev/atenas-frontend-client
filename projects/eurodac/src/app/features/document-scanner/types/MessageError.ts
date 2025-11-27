import { DocumentReaderErrorCodes } from './DocumentReaderErrorCodes';

export class MessageError {
  constructor(
    public ErrorCode?: DocumentReaderErrorCodes,
    public Mensaje?: string
  ) {}
}
