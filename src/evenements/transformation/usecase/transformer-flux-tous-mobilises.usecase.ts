import { FluxTransformation } from "@evenements/transformation/domain/flux";
import { Usecase } from "@shared/usecase";
import { EvenementsRepository } from "@evenements/transformation/domain/evenements.repository";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import { UnjeuneUneSolution } from "@evenements/transformation/domain/1jeune1solution";
import { DateService } from "@shared/date.service";

export class TransformerFluxTousMobilisesUsecase implements Usecase {
	constructor(
		private readonly evenementsRepository: EvenementsRepository,
		private readonly dateService: DateService,
	) {
	}

	public async executer<T>(flux: FluxTransformation): Promise<void | T> {
		const contenuDuFlux = await this.evenementsRepository.recuperer<TousMobilises.Contenu[]>(flux);

		const contenuTransforme: UnjeuneUneSolution.Evenement[] = contenuDuFlux.map((evenement: TousMobilises.Contenu) => {
			return {
				dateDebut: this.dateService.toIsoDate(evenement.date, evenement.horaireDebutEvenement),
				dateFin: this.dateService.toIsoDate(evenement.date, evenement.horaireFinEvenement),
				description: evenement.description,
				idSource: evenement.id,
				lieuEvenement: evenement.lieuEvenement,
				modaliteInscription: evenement.modaliteInscription,
				online: Boolean(evenement.online),
				organismeOrganisateur: evenement.organismeOrganisateur,
				titreEvenement: evenement.titreEvenement,
				typeEvenement: evenement.typeEvenement,
				source: "tous-mobilises",
			};
		});

		await this.evenementsRepository.sauvegarder(contenuTransforme, flux);
	}
}
