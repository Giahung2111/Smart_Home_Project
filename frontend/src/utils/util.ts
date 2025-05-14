export const getRandomRole = () => {
    return Math.random() < 0.5 ? "admin" : "user";
};

export const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`;
}

export const getShortenName = (name: string | undefined | null) => {
    if (!name) return '';
    const upperCaseString = name.toUpperCase();
    const firstCharacter = upperCaseString[0];
    const words = name.trim().split(' ');
    const lastWord = words[words.length - 1];
    const lastCharacter = lastWord[0].toUpperCase();
    const shortName = firstCharacter + lastCharacter;
    return shortName;
}