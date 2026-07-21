export interface AIProvider {
  generateJson<T>(prompt: string, systemInstruction?: string): Promise<T>;
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
}
