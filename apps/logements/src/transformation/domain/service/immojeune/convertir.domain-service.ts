import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { Immojeune } from "@logements/src/transformation/domain/model/immojeune";

import { Devise } from "@shared/src/domain/model/devise.value-object";
import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";

export class Convertir {
	private readonly correspondancesServicesInclus: Map<Immojeune.ServiceInclus, UnJeune1Solution.ServiceInclus.Nom>;
	private readonly correspondancesServicesOptionnels: Map<Immojeune.ServiceOptionnel, UnJeune1Solution.ServiceOptionnel.Nom>;
	private readonly correspondancesTypeDeLogement: Map<Immojeune.TypeDeLogement, UnJeune1Solution.Type>;
	private readonly correspondancesTypeDeBien: Map<Immojeune.TypeDeBien, UnJeune1Solution.TypeBien>;

	constructor(
		private readonly assainisseurDeTexte: AssainisseurDeTexte,
		private readonly dateService: DateService,
	) {
		this.correspondancesServicesInclus = this.initialiserServicesInclus();
		this.correspondancesServicesOptionnels = this.initialiserServicesOptionnels();
		this.correspondancesTypeDeLogement = this.initialiserTypesDeLogement();
		this.correspondancesTypeDeBien = this.initialiserTypesDeBien();
	}

	public depuisImmojeune(annonceDeLogement: Immojeune.AnnonceDeLogement): UnJeune1Solution.AnnonceDeLogement {
		const maintenant = this.dateService.maintenant().toISOString();

		return {
			identifiantSource: annonceDeLogement.externalId.toString(),
			titre: this.assainisseurDeTexte.nettoyer(annonceDeLogement.title),
			description: this.assainisseurDeTexte.nettoyer(annonceDeLogement.description),
			charge: annonceDeLogement.charges,
			devise: new Devise(annonceDeLogement.currency).value,
			garantie: this.refuserPrixNegatif(annonceDeLogement.deposit),
			prix: annonceDeLogement.totalPricing,
			prixHT: this.refuserPrixNegatif(annonceDeLogement.rent),
			surface: annonceDeLogement.surface,
			surfaceMax: 0,
			meuble: annonceDeLogement.furnished,
			etage: annonceDeLogement.floor,
			nombreDePieces: annonceDeLogement.nbRooms,
			url: annonceDeLogement.url,
			dateDeDisponibilite: annonceDeLogement.availableAt || maintenant,
			imagesUrl: annonceDeLogement.pictures.map((picture) => ({ value: picture })),
			sourceCreatedAt: this.interpreterLaDateSiFrancaise(annonceDeLogement.date_creation, maintenant),
			sourceUpdatedAt: this.interpreterLaDateSiFrancaise(annonceDeLogement.date_update, maintenant),
			bilanEnergetique: {
				consommationEnergetique: this.saisirLeBilanEnergetiqueSiRenseigne(annonceDeLogement.energyConsumption),
				emissionDeGaz: this.saisirLeBilanEnergetiqueSiRenseigne(annonceDeLogement.greenhouseGasesEmission),
			},
			localisation: {
				adresse: annonceDeLogement.address,
				pays: annonceDeLogement.country,
				ville: annonceDeLogement.city,
				codePostal: annonceDeLogement.zipCode,
				longitude: annonceDeLogement.longitude,
				latitude: annonceDeLogement.latitude,
			},
			source: UnJeune1Solution.Source.IMMOJEUNE,
			servicesInclus: this.traduireLesServicesInclus(annonceDeLogement.includedServices ),
			servicesOptionnels: this.traduireLesServicesOptionnels(annonceDeLogement.optionalServices ),
			type: this.traduireLeTypeDeLogement(annonceDeLogement.type.toLowerCase() as Immojeune.TypeDeLogement),
			typeBien: this.traduireLeTypeDeBien(annonceDeLogement.property_type.toLowerCase() as Immojeune.TypeDeBien),
		};
	}

	private refuserPrixNegatif(prix: number): number | undefined {
		return prix >= 0 ? prix : undefined;
	}

	private interpreterLaDateSiFrancaise(date: string | undefined, maintenant: string): string {
		if (!date) {
			return maintenant;
		}
		const dateInterpretee = this.dateService.toIsoDateFromFrenchFormatWithSeconds(date);
		if (dateInterpretee) {
			return dateInterpretee;
		}
		return date;
	}

	private saisirLeBilanEnergetiqueSiRenseigne(bilanEnergetique: string): string | undefined {
		if (bilanEnergetique === "UNDEFINED") {
			return undefined;
		}
		return bilanEnergetique;
	}

	private traduireLesServicesInclus(servicesInclus: Array<Immojeune.ServiceInclus>): Array<{ nom: UnJeune1Solution.ServiceInclus.Nom }> {
		return servicesInclus?.map((serviceInclus) => this.traduireLeServiceInclus(serviceInclus)) || [];
	}

	private traduireLesServicesOptionnels(servicesOptionnels: Array<Immojeune.ServiceOptionnel>): Array<UnJeune1Solution.ServiceOptionnel> {
		return servicesOptionnels?.map((serviceOptionnel) => this.traduireLeServiceOptionnel(serviceOptionnel)) || [];
	}

	private traduireLeTypeDeLogement(typeDeLogement: Immojeune.TypeDeLogement): UnJeune1Solution.Type {
		return this.correspondancesTypeDeLogement.get(typeDeLogement) || UnJeune1Solution.Type.NON_RENSEIGNE;
	}

	private traduireLeTypeDeBien(typeDeBien: Immojeune.TypeDeBien): UnJeune1Solution.TypeBien {
		return this.correspondancesTypeDeBien.get(typeDeBien) || UnJeune1Solution.TypeBien.NON_RENSEIGNE;
	}

	private traduireLeServiceInclus(serviceInclus: Immojeune.ServiceInclus): { nom: UnJeune1Solution.ServiceInclus.Nom } {
		const serviceInclusTraduit = this.correspondancesServicesInclus.get(serviceInclus);
		return { nom: serviceInclusTraduit || UnJeune1Solution.ServiceInclus.Nom.NON_RENSEIGNE };
	}

	private traduireLeServiceOptionnel(serviceOptionnel: Immojeune.ServiceOptionnel): { nom: UnJeune1Solution.ServiceOptionnel.Nom } {
		return { nom: this.correspondancesServicesOptionnels.get(serviceOptionnel) || UnJeune1Solution.ServiceOptionnel.Nom.NON_RENSEIGNE };
	}

	private initialiserServicesInclus(): Map<Immojeune.ServiceInclus, UnJeune1Solution.ServiceInclus.Nom> {
		const correspondanceServicesInclus: Map<Immojeune.ServiceInclus, UnJeune1Solution.ServiceInclus.Nom> = new Map();
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.BIKE_STORAGE, UnJeune1Solution.ServiceInclus.Nom.LOCAL_A_VELO);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.CLEANING_TOOLS, UnJeune1Solution.ServiceInclus.Nom.NECESSAIRE_DE_NETTOYAGE);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.FITNESS_ROOM, UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_SPORT);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.INTERNET, UnJeune1Solution.ServiceInclus.Nom.INTERNET);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.IRON, UnJeune1Solution.ServiceInclus.Nom.FER_A_REPASSER);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.MICROWAVE, UnJeune1Solution.ServiceInclus.Nom.MICRO_ONDE);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.PARKING, UnJeune1Solution.ServiceInclus.Nom.PARKING);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.PRIVATE_BATHROOM, UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.TV, UnJeune1Solution.ServiceInclus.Nom.TV);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.VACUUM, UnJeune1Solution.ServiceInclus.Nom.ASPIRATEUR);
		correspondanceServicesInclus.set(Immojeune.ServiceInclus.WASHING_MACHINE, UnJeune1Solution.ServiceInclus.Nom.LAVE_LINGE);

		return correspondanceServicesInclus;
	}

	private initialiserServicesOptionnels(): Map<Immojeune.ServiceOptionnel, UnJeune1Solution.ServiceOptionnel.Nom> {
		const correspondanceServicesOptionnels: Map<Immojeune.ServiceOptionnel, UnJeune1Solution.ServiceOptionnel.Nom> = new Map();

		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.BIKE_STORAGE, UnJeune1Solution.ServiceOptionnel.Nom.LOCAL_A_VELO);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.CLEANING_TOOLS, UnJeune1Solution.ServiceOptionnel.Nom.NECESSAIRE_DE_NETTOYAGE);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.FITNESS_ROOM, UnJeune1Solution.ServiceOptionnel.Nom.SALLE_DE_SPORT);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.INTERNET, UnJeune1Solution.ServiceOptionnel.Nom.INTERNET);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.IRON, UnJeune1Solution.ServiceOptionnel.Nom.FER_A_REPASSER);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.MICROWAVE, UnJeune1Solution.ServiceOptionnel.Nom.MICRO_ONDE);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.TV, UnJeune1Solution.ServiceOptionnel.Nom.TV);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.VACUUM, UnJeune1Solution.ServiceOptionnel.Nom.ASPIRATEUR);
		correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.WASHING_MACHINE, UnJeune1Solution.ServiceOptionnel.Nom.MACHINE_A_LAVER);

		return correspondanceServicesOptionnels;
	}

	private initialiserTypesDeLogement(): Map<Immojeune.TypeDeLogement, UnJeune1Solution.Type> {
		const correspondanceTypesDeBien: Map<Immojeune.TypeDeLogement, UnJeune1Solution.Type> = new Map();

		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.COLOCATION, UnJeune1Solution.Type.COLOCATION);
		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.COURTE, UnJeune1Solution.Type.COURTE);
		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.INTERGENERATIONAL, UnJeune1Solution.Type.INTERGENERATIONNEL);
		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.LOCATION, UnJeune1Solution.Type.LOCATION);
		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.RESIDENCE, UnJeune1Solution.Type.RESIDENCE);
		correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.SUBLEASE, UnJeune1Solution.Type.SOUS_LOCATION);

		return correspondanceTypesDeBien;
	}

	private initialiserTypesDeBien(): Map<Immojeune.TypeDeBien, UnJeune1Solution.TypeBien> {
		const correspondanceTypesDeBien: Map<Immojeune.TypeDeBien, UnJeune1Solution.TypeBien> = new Map();

		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.COLOCATION, UnJeune1Solution.TypeBien.COLOCATION);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.APPARTEMENT, UnJeune1Solution.TypeBien.APPARTEMENT);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.CHAMBRE, UnJeune1Solution.TypeBien.CHAMBRE);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.IMMEUBLE, UnJeune1Solution.TypeBien.IMMEUBLE);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.MAISON, UnJeune1Solution.TypeBien.MAISON);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.STUDIO, UnJeune1Solution.TypeBien.STUDIO);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T1BIS, UnJeune1Solution.TypeBien.T1BIS);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T1, UnJeune1Solution.TypeBien.T1);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T2, UnJeune1Solution.TypeBien.T2);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T3, UnJeune1Solution.TypeBien.T3);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T4, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T5, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T6, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T7, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T8, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T9, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T10, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T11, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T12, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T13, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T14, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T15, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T16, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T17, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T18, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T19, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T20, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T21, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T22, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T23, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T24, UnJeune1Solution.TypeBien.PLUS_GRAND);
		correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T25, UnJeune1Solution.TypeBien.PLUS_GRAND);

		return correspondanceTypesDeBien;
	}

}
