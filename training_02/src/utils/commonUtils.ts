export const range = ({ size }: { size?: number }) => {
    if (size) {
        const itemsInRange = []
        for (let i = 1; i <= size; i++) {
            itemsInRange.push(i)
        }
        return itemsInRange
    }
}

export const camelize = ({ str }: { str: string }) => {
    
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}