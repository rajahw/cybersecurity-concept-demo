/* 
    PASSWORD REQUIREMENTS:
    >= 16 chars
    uppercase letter
    lowercase letter
    number
    special char
  
    SCORE THRESHOLDS:
    > 90 = STRONG
    > 75 = GOOD
    > 60 = FAIR
    <= 60 = WEAK
*/
  
export function analyzePassword(password: string) {
    const lengthCheck = password.length >= 16
    const lowercaseCheck = /[a-z]/.test(password)
    const uppercaseCheck = /[A-Z]/.test(password)
    const numberCheck = /[0-9]/.test(password)
    const specialCheck = /[^A-Za-z0-9]/.test(password)

    /*const suggestions: string[] = []*/

    return { lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck }
}