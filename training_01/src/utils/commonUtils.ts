export const range = ({ size }: { size?: number }) => {
    if (size) {
        const itemsInRange = []
        for (let i = 1; i <= size; i++) {
            itemsInRange.push(i)
        }
        return itemsInRange
    }
}
