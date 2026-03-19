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

async function createPasswordHash(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    try {
        const hash = await crypto.subtle.digest('SHA-1', data);
        const byteArray = Array.from(new Uint8Array(hash));
        const hexArray = byteArray.map(bytes => bytes.toString(16).padStart(2, '0'));
        const hashText = hexArray.join('').toUpperCase();
        const prefix = hashText.slice(0, 5);
        const suffix = hashText.slice(5);

        return { prefix, suffix };
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function checkForBreach(password: string) {
    try {
        const hashResult = await createPasswordHash(password);
        if (!hashResult)
            return undefined;

        const { prefix, suffix } = hashResult;
        const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix);

        if (!response.ok)
            throw new Error('Error: ' + response.status);

        const passwords = await response.text();
        const passwordArray = passwords.split('\n');

        return passwordArray.some(index => index.startsWith(suffix))
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function analyzePasswordRequirements(password: string) {
    const lengthCheck = password.length >= 16;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCheck = /[^A-Za-z0-9]/.test(password);
    const suggestions: string[] = [];

    if (!lengthCheck)
        suggestions.push('Make your password longer');
    if (!lowercaseCheck)
        suggestions.push('Include lowercase letters');
    if(!uppercaseCheck)
        suggestions.push('Include uppercase letters');
    if(!numberCheck)
        suggestions.push('Include numbers');
    if(!specialCheck)
        suggestions.push('Include special characters');

    return { lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions };
}