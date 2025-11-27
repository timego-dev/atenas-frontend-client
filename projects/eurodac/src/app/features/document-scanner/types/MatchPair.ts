export class MatchPair {
    /**
     * candidate finger number
     */
    public candidate: number;
    /**
     * probe finger number
     */
    public probe: number;
    /**
     * Normalized score
     */
    public score: number;

    constructor(matchPair: MatchPair) {
        this.candidate = matchPair.candidate;
        this.probe = matchPair.probe;
        this.score = matchPair.score;
    }
}
