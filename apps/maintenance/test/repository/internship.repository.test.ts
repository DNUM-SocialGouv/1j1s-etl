import { Internship } from "@maintenance/src/internship.type";

import {expect, StubbedType, stubClass, stubInterface} from "@shared/test/configuration";
import {InternshipFixture} from "@maintenance/test/fixture/internshipFixture";
import {CMSInternshipRepository} from "@maintenance/src/repository/internship.repository";
import {StrapiHttpClient} from "@shared/src/infrastructure/gateway/client/strapi-http-client";

describe("CMSInternshipRepositoryTest", () => {
  context("Lorsque je souhaite récupérer les offres de stage", () => {
    it("je récupère les offres de stage", async () => {
      // Given
      const expected: Array<Internship> = [
        InternshipFixture.build("1"),
      ];
      const flow = "jobteaser";
      const url = "http://localhost:1337/api";
      const fieldsToRetrieve = "id";
      // TODO : ajouter la config dans StrapiHttpClient ET CMSInternshipRepository

      const strapiHttpClient = stubClass(StrapiHttpClient);

      // When
      const cmsRepository = new CMSInternshipRepository(strapiHttpClient);
      const result = await cmsRepository.getAll(flow);

      // Then
      expect(result).to.deep.equals(expected);
    });
  });
});
