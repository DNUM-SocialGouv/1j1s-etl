import { Internshi } from "@maintenance/src/repository/internship.repository";
import { StagePurgeAll } from "@maintenance/src/usecases/stages-purge-all.usecase";
import { Usecase } from "@shared/src/application-service/usecase";
import { expect, StubbedType, stubInterface } from "@shared/test/configuration";
import sinon from "sinon";
import { InternshipFixture } from "@maintenance/test/fixture/internshipFixture";

describe("StagePurgeAllTest", () => {
    let stagePurgeAll: Usecase;
    let httpService: StubbedType<Internshi>;

    context("Lorsque je souhaites purger les données liées aux stages sur le CMS", () => {
        it("je récupère les offres à supprimer", async () => {
            httpService = stubInterface<Internshi>(sinon);
            stagePurgeAll = new StagePurgeAll(httpService);
            httpService.getAll.resolves([]);

            await stagePurgeAll.executer();
            
            expect(httpService.getAll.getCall(0).args).to.have.deep.members(["jobteaser"]);
            expect(httpService.getAll.getCall(1).args).to.have.deep.members(["stagefr-compresse"]);
            expect(httpService.getAll.getCall(2).args).to.have.deep.members(["stagefr-decompresse"]);
        });

        it("je supprime les offres", async () => {
            httpService = stubInterface<Internshi>(sinon);
            stagePurgeAll = new StagePurgeAll(httpService);
            const internshipsFixture = [
                InternshipFixture.build("1"),
                InternshipFixture.build("2"),
            ];
            httpService.getAll.resolves(internshipsFixture);

            await stagePurgeAll.executer();

            expect(httpService.deleteAll).to.have.been.calledOnceWith([
                InternshipFixture.build("1"),
                InternshipFixture.build("2"),
                InternshipFixture.build("1"),
                InternshipFixture.build("2"),
                InternshipFixture.build("1"),
                InternshipFixture.build("2"),
            ]);
        });
    });
});
