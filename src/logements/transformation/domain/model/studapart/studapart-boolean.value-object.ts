export class StudapartBoolean {
    private readonly _value: boolean;

    constructor(value: "0" | "1") {
        this._value = value === "1";
    }

    get value(): boolean {
        return this._value;
    }
}
