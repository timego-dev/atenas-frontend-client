export interface DocumentChipResultDto {
  chipOutput?: string;
  actions: DocumentVerificationActionDto[];
}

export interface DocumentVerificationActionDto {
  verificationCategory?: string;
  verificationName?: string;
  verificationType?: string;
  threshold: number;
  score: number;
  outputs: DocumentVerificationOutputDto[];
  resultValue: number;
}

export interface DocumentVerificationOutputDto {
  name?: string;
  base64ImageId?: string;
  text?: string;
}
