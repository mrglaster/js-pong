class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Vector2(
            this.x + other.x,
            this.y + other.y
        )
    }

    mul(scalar) {
        return new Vector2(
            this.x * scalar,
            this.y * scalar
        )
    }

    static random(minX, maxX, minY, maxY) {
        const x = Math.random() * (maxX - minX) + minX
        const y = Math.random() * (maxY - minY) + minY
        return new Vector2(x, y)
    }
}