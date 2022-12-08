export namespace UnJeuneUneSolution {
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
    export type EvenementDejaCharge = Evenement & { id: number }
    export type EvenementASupprimer = Evenement & { id: number }
    export type EvenementAMettreAJour = Evenement & { id: number }

    export interface EvenementsRepository {
        sauvegarder(nomFlux: string, suffixHistoryFile: string, evenements: UnJeuneUneSolution.Evenement[]): Promise<void>
        recupererEvenementsDejaCharges(nomFlux: string): Promise<UnJeuneUneSolution.EvenementDejaCharge[]>;
        recupererNouveauxEvenementsACharger(nomFlux: string): Promise<UnJeuneUneSolution.Evenement[]>;
        chargerEtEnregistrerLesErreurs(
            evenenementsAAjouter: UnJeuneUneSolution.EvenementAAjouter[],
            evenementsAMettreAjour: UnJeuneUneSolution.EvenementAMettreAJour[],
            evenementsASupprimer: UnJeuneUneSolution.EvenementASupprimer[],
        ): Promise<UnJeuneUneSolution.EvenementEnErreur[]>;
    }
}
