export function capitalizeText(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
}