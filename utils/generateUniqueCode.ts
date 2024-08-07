export const generateUniqueCode = (existingCodes: Set<string>): string =>{
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    let code: string;
    do {
        code = '';
        for (let i = 0; i < 2; i++) {
            code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        code += digits.charAt(Math.floor(Math.random() * digits.length));
        for (let i = 0; i < 4; i++) {
            code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
    } while (existingCodes.has(code));

    existingCodes.add(code);
    return code;
}

export default generateUniqueCode;