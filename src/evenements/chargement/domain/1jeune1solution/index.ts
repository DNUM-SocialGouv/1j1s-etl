import { FluxChargement } from "@evenements/chargement/domain/flux";

export namespace UnjeuneUneSolutionChargement {
    export interface Evenement {
        dateDebut: string
        dateFin: string
        description: string
        idSource: string
        lieuEvenement: string
        modaliteInscription: string
        online: boolean
        organismeOrganisateur: string
        titreEvenement: string
        typeEvenement: string
        source: string
    }

    export type EvenementEnErreur = Evenement
    export type EvenementAAjouter = Evenement
    export interface EvenementDejaCharge extends Evenement { id: number }
    export interface EvenementASupprimer extends Evenement { id: number }
    export interface EvenementAMettreAJour extends Evenement { id: number }

    export interface EvenementsRepository {
        sauvegarder(fluxChargement: FluxChargement, evenements: UnjeuneUneSolutionChargement.Evenement[]): Promise<void>
        recupererEvenementsDejaCharges(nomFlux: string): Promise<UnjeuneUneSolutionChargement.EvenementDejaCharge[]>;
        recupererNouveauxEvenementsACharger(nomFlux: string): Promise<UnjeuneUneSolutionChargement.Evenement[]>;
        chargerEtEnregistrerLesErreurs(
            evenenementsAAjouter: UnjeuneUneSolutionChargement.EvenementAAjouter[],
            evenementsAMettreAjour: UnjeuneUneSolutionChargement.EvenementAMettreAJour[],
            evenementsASupprimer: UnjeuneUneSolutionChargement.EvenementASupprimer[],
        ): Promise<UnjeuneUneSolutionChargement.EvenementEnErreur[]>;
    }
}
