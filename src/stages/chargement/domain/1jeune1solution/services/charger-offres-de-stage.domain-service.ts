import { DateService } from "@shared/date.service";
import { UnJeune1Solution } from "@stages/chargement/domain/1jeune1solution";

export class ChargerOffresDeStageDomainService {
	static readonly INDENTATION_JSON = 2;
	static readonly REMPLACANT_JSON = null;
	static readonly CREATED = "created";
	static readonly UPDATED = "updated";
	static readonly DELETED = "deleted";
	static readonly ERROR = "error";
	static readonly SANS_EMPLOYEUR = "sans_employeur";

	constructor(
		private readonly offreDeStageRepository: UnJeune1Solution.OffreDeStageRepository,
		private readonly dateService: DateService,
	) {
	}

	public async charger(nomDuFlux: string, extensionDuFichierDeResultat: string): Promise<void> {
		const offresDeStageMisesAJour = await this.offreDeStageRepository.recupererMisesAJourDesOffres(nomDuFlux);
		const offresDeStageExistantes = await this.offreDeStageRepository.recupererOffresExistantes(nomDuFlux);

		const identifiantsSourceDesOffresExistantes = this.extraireLesIdentifiantsSourceDesOffresExistantes(offresDeStageExistantes);

		const offresDeStageSansEmployeur = this.filtrerLesOffresDeStagesSansEmployeur(offresDeStageMisesAJour);
		const offresDeStageAvecEmployeur = this.filtrerLesOffresDeStagesAvecEmployeur(offresDeStageMisesAJour, offresDeStageSansEmployeur);

		const offresDeStageAMettreAJour = this.extaireLesOffresAMettreAJour(offresDeStageAvecEmployeur, identifiantsSourceDesOffresExistantes, offresDeStageExistantes);
		const offresDeStageAPublier = this.extaireLesOffresAPublier(offresDeStageAvecEmployeur, identifiantsSourceDesOffresExistantes);
		const offresDeStageASupprimer = this.extaireLesOffresASupprimer(offresDeStageExistantes, this.extaireLesIdentifiantsDeLaMiseAJourDesOffres(offresDeStageMisesAJour));

		const offresDeStageEnErreur = await this.offreDeStageRepository.charger(nomDuFlux, [
			...offresDeStageAMettreAJour,
			...offresDeStageAPublier,
			...offresDeStageASupprimer,
		]);

		await this.enregistrerLesResultatsDuChargement(
			nomDuFlux,
			extensionDuFichierDeResultat,
			offresDeStageAPublier,
			offresDeStageAMettreAJour,
			offresDeStageASupprimer,
			offresDeStageEnErreur,
			offresDeStageSansEmployeur
		);
	}

	private filtrerLesOffresDeStagesAvecEmployeur(offresDeStageMisesAJour: UnJeune1Solution.OffreDeStage[], offresDeStageSansEmployeur: UnJeune1Solution.OffreDeStage[]): Array<UnJeune1Solution.OffreDeStage> {
		return offresDeStageMisesAJour.filter((offreDeStage) => !offresDeStageSansEmployeur.includes(offreDeStage));
	}

	private async enregistrerLesResultatsDuChargement(
		nomDuFlux: string,
		extensionDuFichierDeResultat: string,
		offresDeStageAPublier: Array<UnJeune1Solution.OffreDeStageAPublier>,
		offresDeStageAMettreAJour: Array<UnJeune1Solution.OffreDeStageAMettreAJour>,
		offresDeStageASupprimer: Array<UnJeune1Solution.OffreDeStageASupprimer>,
		offresDeStageEnErreur: Array<UnJeune1Solution.OffreDeStageEnErreur>,
		offresDeStageSansEmployeur: Array<UnJeune1Solution.OffreDeStage>,
	): Promise<void> {
		const { CREATED, UPDATED, DELETED, ERROR, SANS_EMPLOYEUR } = ChargerOffresDeStageDomainService;
		const parametresDesFichiersDeResultat = {
			nomDuFlux,
			nomDuFichier: this.dateService.maintenant(),
			extensionDuFichier: extensionDuFichierDeResultat,
		};

		await this.enregistrerLeResultat(CREATED, offresDeStageAPublier, parametresDesFichiersDeResultat);
		await this.enregistrerLeResultat(UPDATED, offresDeStageAMettreAJour, parametresDesFichiersDeResultat);
		await this.enregistrerLeResultat(DELETED, offresDeStageASupprimer, parametresDesFichiersDeResultat);
		await this.enregistrerLeResultat(ERROR, offresDeStageEnErreur, parametresDesFichiersDeResultat);
		await this.enregistrerLeResultat(SANS_EMPLOYEUR, offresDeStageSansEmployeur, parametresDesFichiersDeResultat);
	}

	private extaireLesOffresASupprimer(
		offresDeStageExistantes: Array<UnJeune1Solution.OffreDeStageExistante>,
		identifiantsSourceDesOffresMisesAJour: Array<string | undefined>,
	): Array<UnJeune1Solution.OffreDeStageASupprimer> {
		return offresDeStageExistantes
			.filter((offreDeStageExistante) => this.offreDeStageQuiNExistePlus(identifiantsSourceDesOffresMisesAJour, offreDeStageExistante))
			.map((offreDeStageExistante) => {

				const attributsDUneOffreDeStage: UnJeune1Solution.AttributsDOffreDeStage = {
					sourceUpdatedAt: offreDeStageExistante.sourceUpdatedAt.toISOString(),
					identifiantSource: offreDeStageExistante.identifiantSource,
				};
				return new UnJeune1Solution.OffreDeStageASupprimer(attributsDUneOffreDeStage, offreDeStageExistante.id);
			});
	}

	private offreDeStageQuiNExistePlus(identifiantsSourceDesOffresMisesAJour: Array<string | undefined>, offreDeStageExistante: UnJeune1Solution.OffreDeStageExistante): boolean {
		return !identifiantsSourceDesOffresMisesAJour.includes(offreDeStageExistante.identifiantSource);
	}

	private extaireLesOffresAMettreAJour(
		offresDeStageAvecEmployeur: Array<UnJeune1Solution.OffreDeStage>,
		identifiantsSourceDesOffresExistantes: Array<string>,
		offresDeStageExistantes: Array<UnJeune1Solution.OffreDeStageExistante>
	): Array<UnJeune1Solution.OffreDeStageAMettreAJour> {
		return offresDeStageAvecEmployeur
			.filter((offreDeStageMiseAJour) => this.offreDeStageEstDejaExistante(offreDeStageMiseAJour, identifiantsSourceDesOffresExistantes))
			.filter((offreDeStageMiseAJour) => {
				const offreDeStageExistante = offresDeStageExistantes.find((offreDeStage) => offreDeStage.identifiantSource === offreDeStageMiseAJour.identifiantSource);
				return offreDeStageMiseAJour.sourceUpdatedAt > offreDeStageExistante!.sourceUpdatedAt;
			})
			.map((offreDeStageAMettreAJour) =>
				new UnJeune1Solution.OffreDeStageAMettreAJour(
					offreDeStageAMettreAJour.recupererAttributs(),
					offresDeStageExistantes.find((offreDeStageExistante) => offreDeStageExistante.identifiantSource === offreDeStageAMettreAJour.identifiantSource)!.id
				)
			);
	}

	private offreDeStageEstDejaExistante(offreDeStageMiseAJour: UnJeune1Solution.OffreDeStage, identifiantsSourceDesOffresExistantes: Array<string>): boolean {
		return !!offreDeStageMiseAJour.identifiantSource && identifiantsSourceDesOffresExistantes.includes(offreDeStageMiseAJour.identifiantSource);
	}

	private extaireLesOffresAPublier(
		offresDeStageAvecEmployeur: Array<UnJeune1Solution.OffreDeStage>,
		identifiantsSourceDesOffresExistantes: Array<string>
	): Array<UnJeune1Solution.OffreDeStageAPublier> {
		return offresDeStageAvecEmployeur
			.filter((offreDeStageMiseAJour) => this.offreDeStageNExistePasEncore(offreDeStageMiseAJour, identifiantsSourceDesOffresExistantes))
			.map((offreDeStage) => new UnJeune1Solution.OffreDeStageAPublier(offreDeStage.recupererAttributs()));
	}

	private offreDeStageNExistePasEncore(offreDeStageMiseAJour: UnJeune1Solution.OffreDeStage, identifiantsSourceDesOffresExistantes: Array<string>): boolean {
		return !offreDeStageMiseAJour.identifiantSource || !identifiantsSourceDesOffresExistantes.includes(offreDeStageMiseAJour.identifiantSource);
	}

	private extraireLesIdentifiantsSourceDesOffresExistantes(offresDeStageExistantes: Array<UnJeune1Solution.OffreDeStageExistante>): Array<string> {
		return offresDeStageExistantes.map((offreExistante) => offreExistante.identifiantSource);
	}

	private extaireLesIdentifiantsDeLaMiseAJourDesOffres(offresDeStageMisesAJour: Array<UnJeune1Solution.OffreDeStage>): Array<string | undefined> {
		return offresDeStageMisesAJour
			.filter((offreExistante) => offreExistante.identifiantSource)
			.map((offreExistante) => offreExistante.identifiantSource);
	}

	private filtrerLesOffresDeStagesSansEmployeur(offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Array<UnJeune1Solution.OffreDeStage> {
		return [
			...offresDeStages.filter((offreDeStage) => !offreDeStage.employeur),
			...offresDeStages.filter((offreDeStage) => offreDeStage.employeur?.nom === ""),
		];
	}

	private async enregistrerLeResultat(
		typeDeResultat: string,
		offresDeStage: Array<UnJeune1Solution.OffreDeStage> | Array<UnJeune1Solution.OffreDeStageEnErreur>,
		parametres: { nomDuFlux: string, nomDuFichier: Date, extensionDuFichier: string },
	): Promise<void> {
		const contenu = this.versJSONLisible(offresDeStage);
		const nomDuFichierDeResultat = this.creerLeNomDuFichierDeResultat(
			parametres.nomDuFlux,
			parametres.nomDuFichier,
			parametres.extensionDuFichier,
			typeDeResultat
		);
		await this.offreDeStageRepository.enregistrer(nomDuFichierDeResultat, contenu, parametres.nomDuFlux);
	}

	private versJSONLisible(offresDeStage: Array<UnJeune1Solution.OffreDeStage> | Array<UnJeune1Solution.OffreDeStageEnErreur>): string {
		const { INDENTATION_JSON, REMPLACANT_JSON } = ChargerOffresDeStageDomainService;
		return JSON.stringify(offresDeStage, REMPLACANT_JSON, INDENTATION_JSON);
	}

	private creerLeNomDuFichierDeResultat(
		nomDuFlux: string, nomDuFichier: Date, extensionDuFichier: string, type: string
	): string {
		return `${nomDuFlux}/${nomDuFichier.toISOString()}_${type}${extensionDuFichier}`;
	}
}
