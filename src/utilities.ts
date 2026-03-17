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
    const suggestions: string[] = []

    if (!lengthCheck)
        suggestions.push("Make your password longer")
    if (!lowercaseCheck)
        suggestions.push("Include lowercase letters")
    if(!uppercaseCheck)
        suggestions.push("Include uppercase letters")
    if(!numberCheck)
        suggestions.push("Include numbers")
    if(!specialCheck)
        suggestions.push("Include special characters")

    return { lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions }
}