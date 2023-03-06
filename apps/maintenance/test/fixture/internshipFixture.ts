import { Internship } from "@maintenance/src/internship.type";

export class InternshipFixture {
  public static build(id?: string): Internship {
    return {
      id: id || "123",
    };
  }
}
