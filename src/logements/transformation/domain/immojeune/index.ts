import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { UnJeune1solution } from "@logements/transformation/domain/1jeune1solution";

export namespace Immojeune {
	export type AnnonceDeLogement = {
		externalId: string
		url: string
		title: string
		description: string
		type: TypeDeLogement
		property_type: TypeDeBien
		surface: number
		rent: number
		totalPricing: number
		currency: string
		charges: number
		deposit: number
		nbRooms: number
		floor: number
		agenceeFees: number
		availableAt?: string
		energyConsumption: string
		greenhouseGasesEmission: string
		furnished: boolean
		address: string
		city: string
		country: string
		zipCode: string
		latitude: number
		longitude: number
		date_creation?: string
		date_update?: string
		pictures: Array<string>
		includedServices?: Array<ServiceInclus>
		optionalServices?: Array<ServiceOptionnel>
	}

	export enum ServiceInclus {
		BIKE_STORAGE = "bikeStorage",
		CLEANING_TOOLS = "cleaningTools",
		FITNESS_ROOM = "fitnessRoom",
		INTERNET = "internet",
		IRON = "iron",
		MICROWAVE = "microwave",
		PARKING = "parking",
		PRIVATE_BATHROOM = "privateBathroom",
		TV = "tv",
		VACUUM = "vacuum",
		WASHING_MACHINE = "washingMachine",
	}

	export enum ServiceOptionnel {
		BIKE_STORAGE = "bikeStorage",
		CLEANING_TOOLS = "cleaningTools",
		FITNESS_ROOM = "fitnessRoom",
		DEFAULT = "default",
		INTERNET = "internet",
		IRON = "iron",
		MICROWAVE = "microwave",
		TV = "tv",
		VACUUM = "vacuum",
		WASHING_MACHINE = "washingMachine",
	}

	export enum TypeDeLogement {
		RESIDENCE = "résidence",
		APPARTEMENT = "appartement",
	}

	export enum TypeDeBien {
		STUDIO = "studio",
		T1 = "T1",
		T2 = "T2",
		T3 = "T3",
	}

	export class Convertir {
		private readonly correspondancesServicesInclus: Map<Immojeune.ServiceInclus, UnJeune1solution.ServiceInclus.Nom>;
		private readonly correspondancesServicesOptionnels: Map<Immojeune.ServiceOptionnel, UnJeune1solution.ServiceOptionnel.Nom>;
		private readonly correspondancesTypeDeLogement: Map<Immojeune.TypeDeLogement, UnJeune1solution.Type>;
		private readonly correspondancesTypeDeBien: Map<Immojeune.TypeDeBien, UnJeune1solution.TypeBien>;

		constructor(
			private readonly assainisseurDeTexte: AssainisseurDeTexte,
			private readonly dateService: DateService
		) {
			this.correspondancesServicesInclus = this.initialiserServicesInclus();
			this.correspondancesServicesOptionnels = this.initialiserServicesOptionnels();
			this.correspondancesTypeDeLogement = this.initialiserTypesDeLogement();
			this.correspondancesTypeDeBien = this.initialiserTypesDeBien();
		}

		public depuisImmojeune(annonceDeLogement: Immojeune.AnnonceDeLogement): UnJeune1solution.AnnonceDeLogement {
			const maintenant = this.dateService.maintenant().toISOString();

			return {
				identifiantSource: annonceDeLogement.externalId,
				titre: this.assainisseurDeTexte.nettoyer(annonceDeLogement.title),
				description: this.assainisseurDeTexte.nettoyer(annonceDeLogement.description),
				charge: annonceDeLogement.charges,
				devise: annonceDeLogement.currency,
				garantie: annonceDeLogement.deposit,
				prix: annonceDeLogement.rent,
				prixHT: annonceDeLogement.totalPricing,
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
					pays: annonceDeLogement.country,
					ville: annonceDeLogement.city,
					codePostal: annonceDeLogement.zipCode,
					longitude: annonceDeLogement.longitude,
					latitude: annonceDeLogement.latitude,
				},
				source: UnJeune1solution.Source.IMMOJEUNE,
				servicesInclus: this.traduireLesServicesInclus(annonceDeLogement.includedServices as Array<Immojeune.ServiceInclus>),
				servicesOptionnels: this.traduireLesServicesOptionnels(annonceDeLogement.optionalServices as Array<Immojeune.ServiceOptionnel>),
				type: this.traduireLeTypeDeLogement(annonceDeLogement.type),
				typeBien: this.traduireLeTypeDeBien(annonceDeLogement.property_type),
			};
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

		private traduireLesServicesInclus(servicesInclus: Array<Immojeune.ServiceInclus>): Array<{ nom: UnJeune1solution.ServiceInclus.Nom }> {
			return servicesInclus?.map((serviceInclus) => this.traduireLeServiceInclus(serviceInclus)) || [];
		}

		private traduireLesServicesOptionnels(servicesOptionnels: Array<Immojeune.ServiceOptionnel>): Array<UnJeune1solution.ServiceOptionnel> {
			return servicesOptionnels?.map((serviceOptionnel) => this.traduireLeServiceOptionnel(serviceOptionnel)) || [];
		}

		private traduireLeTypeDeLogement(typeDeLogement: Immojeune.TypeDeLogement): UnJeune1solution.Type {
			return this.correspondancesTypeDeLogement.get(typeDeLogement) || UnJeune1solution.Type.NON_RENSEIGNE;
		}

		private traduireLeTypeDeBien(typeDeBien: Immojeune.TypeDeBien): UnJeune1solution.TypeBien {
			return this.correspondancesTypeDeBien.get(typeDeBien) || UnJeune1solution.TypeBien.NON_RENSEIGNE;
		}

		private traduireLeServiceInclus(serviceInclus: Immojeune.ServiceInclus): { nom: UnJeune1solution.ServiceInclus.Nom } {
			const serviceInclusTraduit = this.correspondancesServicesInclus.get(serviceInclus);
			return { nom: serviceInclusTraduit || UnJeune1solution.ServiceInclus.Nom.NON_RENSEIGNE };
		}

		private traduireLeServiceOptionnel(serviceOptionnel: Immojeune.ServiceOptionnel): { nom: UnJeune1solution.ServiceOptionnel.Nom } {
			return { nom: this.correspondancesServicesOptionnels.get(serviceOptionnel) || UnJeune1solution.ServiceOptionnel.Nom.NON_RENSEIGNE };
		}

		private initialiserServicesInclus(): Map<Immojeune.ServiceInclus, UnJeune1solution.ServiceInclus.Nom> {
			const correspondanceServicesInclus: Map<Immojeune.ServiceInclus, UnJeune1solution.ServiceInclus.Nom> = new Map();

			correspondanceServicesInclus.set(Immojeune.ServiceInclus.BIKE_STORAGE, UnJeune1solution.ServiceInclus.Nom.LOCAL_A_VELO);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.CLEANING_TOOLS, UnJeune1solution.ServiceInclus.Nom.NECESSAIRE_DE_NETTOYAGE);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.FITNESS_ROOM, UnJeune1solution.ServiceInclus.Nom.SALLE_DE_SPORT);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.INTERNET, UnJeune1solution.ServiceInclus.Nom.INTERNET);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.IRON, UnJeune1solution.ServiceInclus.Nom.FER_A_REPASSER);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.MICROWAVE, UnJeune1solution.ServiceInclus.Nom.MICRO_ONDE);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.PARKING, UnJeune1solution.ServiceInclus.Nom.PARKING);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.PRIVATE_BATHROOM, UnJeune1solution.ServiceInclus.Nom.SALLE_DE_BAIN_PRIVATIVE);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.TV, UnJeune1solution.ServiceInclus.Nom.TV);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.VACUUM, UnJeune1solution.ServiceInclus.Nom.ASPIRATEUR);
			correspondanceServicesInclus.set(Immojeune.ServiceInclus.WASHING_MACHINE, UnJeune1solution.ServiceInclus.Nom.MACHINE_A_LAVER);

			return correspondanceServicesInclus;
		}

		private initialiserServicesOptionnels(): Map<Immojeune.ServiceOptionnel, UnJeune1solution.ServiceOptionnel.Nom> {
			const correspondanceServicesOptionnels: Map<Immojeune.ServiceOptionnel, UnJeune1solution.ServiceOptionnel.Nom> = new Map();

			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.BIKE_STORAGE, UnJeune1solution.ServiceOptionnel.Nom.LOCAL_A_VELO);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.CLEANING_TOOLS, UnJeune1solution.ServiceOptionnel.Nom.NECESSAIRE_DE_NETTOYAGE);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.FITNESS_ROOM, UnJeune1solution.ServiceOptionnel.Nom.SALLE_DE_SPORT);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.INTERNET, UnJeune1solution.ServiceOptionnel.Nom.INTERNET);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.IRON, UnJeune1solution.ServiceOptionnel.Nom.FER_A_REPASSER);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.MICROWAVE, UnJeune1solution.ServiceOptionnel.Nom.MICRO_ONDE);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.TV, UnJeune1solution.ServiceOptionnel.Nom.TV);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.VACUUM, UnJeune1solution.ServiceOptionnel.Nom.ASPIRATEUR);
			correspondanceServicesOptionnels.set(Immojeune.ServiceOptionnel.WASHING_MACHINE, UnJeune1solution.ServiceOptionnel.Nom.MACHINE_A_LAVER);

			return correspondanceServicesOptionnels;
		}

		private initialiserTypesDeLogement(): Map<Immojeune.TypeDeLogement, UnJeune1solution.Type> {
			const correspondanceTypesDeBien: Map<Immojeune.TypeDeLogement, UnJeune1solution.Type> = new Map();

			correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.APPARTEMENT, UnJeune1solution.Type.APPARTEMENT);
			correspondanceTypesDeBien.set(Immojeune.TypeDeLogement.RESIDENCE, UnJeune1solution.Type.RESIDENCE);

			return correspondanceTypesDeBien;
		}

		private initialiserTypesDeBien(): Map<Immojeune.TypeDeBien, UnJeune1solution.TypeBien> {
			const correspondanceTypesDeBien: Map<Immojeune.TypeDeBien, UnJeune1solution.TypeBien> = new Map();

			correspondanceTypesDeBien.set(Immojeune.TypeDeBien.STUDIO, UnJeune1solution.TypeBien.STUDIO);
			correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T1, UnJeune1solution.TypeBien.T1);
			correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T2, UnJeune1solution.TypeBien.T2);
			correspondanceTypesDeBien.set(Immojeune.TypeDeBien.T3, UnJeune1solution.TypeBien.T3);

			return correspondanceTypesDeBien;
		}
	}
}