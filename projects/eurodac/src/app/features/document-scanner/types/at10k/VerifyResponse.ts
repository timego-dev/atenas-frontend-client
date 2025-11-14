import { MatchPair } from './MatchPair';

export class VerifyResponse {
  public scores: Array<MatchPair>;

  constructor(verifyResponse: VerifyResponse) {
    this.scores = verifyResponse.scores;
  }
}
