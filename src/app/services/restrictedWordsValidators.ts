import { FormControl } from "@angular/forms";

export function restrictedWords(words: Array<string>) {
  return (control: FormControl): { [key: string]: any } => {
    if (!words) { return null; } else {
      const invalidwords = words.map(w => control.value.includes(w) ? w : null).filter(w => w != null);
      return invalidwords && invalidwords.length > 0 ? { 'restrictedWords': invalidwords.join(', ') } : null;
    }
  }
}
