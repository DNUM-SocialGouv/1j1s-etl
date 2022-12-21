export class Devise {
  private readonly _value: string;

  constructor(value: string) {
    switch (value) {
      case "EUR":
        this._value = "€";
        break;
      case "GPB":
        this._value = "£";
        break;
      case "USD":
        this._value = "$";
        break;
      default:
        this._value = "non renseignée";
        break;
    }
  }

  get value(): string {
    return this._value;
  }

}
