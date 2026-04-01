import zxcvbn from 'zxcvbn';

export function getCrackInfo(password: string) {
    const crackTime = zxcvbn(password).crack_times_display.offline_slow_hashing_1e4_per_second;
    const crackScore = zxcvbn(password).score;

    return {crackTime, crackScore};
}

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

        return {prefix, suffix};
   } catch (error) {
        console.error(error);
        return undefined;
   }
}

export async function encryptMessageRSA(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    try {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );
    
        const publicKey = keyPair.publicKey;
        const privateKey = keyPair.privateKey;

        const encrypted = await crypto.subtle.encrypt(
            {name: 'RSA-OAEP'},
            publicKey,
            data
        );

        const decoder = new TextDecoder();
        const encryptedMessage = decoder.decode(encrypted);
        const publicKeyArray = await crypto.subtle.exportKey('spki', publicKey);
        const publicKeyText = btoa(String.fromCharCode(...new Uint8Array(publicKeyArray)));
        const privateKeyArray = await crypto.subtle.exportKey('pkcs8', privateKey);
        const privateKeyText = btoa(String.fromCharCode(...new Uint8Array(privateKeyArray)));

        return {encryptedMessage, publicKeyText, privateKeyText};
   } catch (error) {
        console.error(error);
        return undefined;
   }
}

export async function encryptMessageAES(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    try {
        const key = await crypto.subtle.generateKey(
            {name: 'AES-GCM', length: 256},
            true,
            ['encrypt', 'decrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            {name: 'AES-GCM', iv},
            key,
            data
        );

        const byteArray = Array.from(new Uint8Array(encrypted));
        const encryptedMessage = byteArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        const keyArray = await crypto.subtle.exportKey('raw', key);
        const keyText = btoa(String.fromCharCode(...new Uint8Array(keyArray)));

        return {encryptedMessage, keyText};
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

        const {prefix, suffix} = hashResult;
        const response = await fetch('https://api.pwnedpasswords.com/range/' + prefix);

        if (!response.ok)
            throw new Error('Error: ' + response.status);

        const passwords = await response.text();
        const passwordArray = passwords.split('\n');

        return passwordArray.some(index => index.startsWith(suffix));
   } catch (error) {
        console.error(error);
        return undefined;
   }
}

export function analyzePasswordRequirements(password: string) {
    const lengthCheck = password.length >= 12;
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

    return {lengthCheck, lowercaseCheck, uppercaseCheck, numberCheck, specialCheck, suggestions};
}

export function getScore(lengthCheck: boolean, lowercaseCheck: boolean, uppercaseCheck: boolean, numberCheck: boolean, specialCheck: boolean, breachCheck: boolean | undefined) {
    let score = 0;
    
    if (lengthCheck)
        score += 15;
    if (lowercaseCheck)
        score += 15;
    if(uppercaseCheck)
        score += 15;
    if(numberCheck)
        score += 15;
    if(specialCheck)
        score += 15;
    if (breachCheck === false)
        score += 25;
    
    return score;
}

export interface Message {
    id: string;
    content: string;
    timestamp: number;
}

export interface TimeComponents {
    month: string;
    day: string;
    year: number;
    hours: string;
    minutes: string;
}

export function addMessage(content: string): Message {
    const messages = getMessages();
    const newMessage: Message = {
        id: Date.now().toString(),
        content,
        timestamp: Date.now()
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    return newMessage;
}

export function getMessages(): Message[] {
    try {
        const messages = localStorage.getItem('messages');
        return messages ? JSON.parse(messages) : [];
   } catch (error) {
        console.error('Error retrieving messages:', error);
        return [];
   }
}

export function deleteMessage(id: string) {
    const messages = getMessages();
    const filtered = messages.filter(msg => msg.id !== id);
    localStorage.setItem('messages', JSON.stringify(filtered));
}

export function formatTimestamp(timestamp: number): TimeComponents {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return {month, day, year, hours, minutes};
}

/* Searching not implemented. Remove if necessary.
export function searchMessages(query: string): Message[] {
    const messages = getMessages();
    const lowerQuery = query.toLowerCase();

    return messages.filter(msg => msg.content.toLowerCase().includes(lowerQuery));
}
*/