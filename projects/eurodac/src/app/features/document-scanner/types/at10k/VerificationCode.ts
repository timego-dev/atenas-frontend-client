export enum VerificationCode {
    /// <summary>
    /// Document Data
    /// </summary>
    PassportExpiry, TextMatch, DataIntegrity,
    /// <summary>
    /// MRZ
    /// </summary>
    CheckDigitComp, CheckDigit, ValidCountry, InvalidValue,
    /// <summary>
    /// Chip
    /// </summary>
    ChipActiveAuthentication, ChipPassiveAuthentication, ChipAccess, ChipAuthentication, ChipPresent, DG1DS,
    /// <summary>
    /// Document Image
    /// </summary>
    ImageMatch, UV,
    /// <summary>
    /// FingerprintQuality
    /// </summary>
    FingerprintQualityCheck,
    FingerprintFakeDetection, // Huellas falsas
    /// <summary>
    /// FingerprintSegmentation
    /// </summary>
    FingerprintHandMixCheck, // Mano cambiada
    FingerprintAmbiguousSlap, // Cruza de dedos entre dos manos
    FingerprintCompletation // Pocas huellas
}
