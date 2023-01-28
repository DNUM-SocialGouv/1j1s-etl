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
        sauvegarder(nomFlux: string, suffixHistoryFile: string, evenements: Array<UnJeuneUneSolution.Evenement>): Promise<void>
        recupererEvenementsDejaCharges(nomFlux: string): Promise<Array<UnJeuneUneSolution.EvenementDejaCharge>>;
        recupererNouveauxEvenementsACharger(nomFlux: string): Promise<Array<UnJeuneUneSolution.Evenement>>;
        chargerEtEnregistrerLesErreurs(
            evenenementsAAjouter: Array<UnJeuneUneSolution.EvenementAAjouter>,
            evenementsAMettreAjour: Array<UnJeuneUneSolution.EvenementAMettreAJour>,
            evenementsASupprimer: Array<UnJeuneUneSolution.EvenementASupprimer>,
        ): Promise<Array<UnJeuneUneSolution.EvenementEnErreur>>;
    }
}
