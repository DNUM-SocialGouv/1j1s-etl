export namespace StagefrCompresse {
    export type Contenu = {
        jobs: {
            job: Array<OffreDeStage>
        }
    }

    export type OffreDeStage = {
        cpc: string,
        guid: number,
        title: string,
        salary: string,
        description: string,
        url: string,
        employer: string,
        category: string,
        post_date: string,
        contract_type: string,
        contract_time: string,
        location: {
            location: string,
            location_raw: string,
            location_parent: string,
            country: string,
            geo_lng: number,
            geo_lat: number,
        },
        logo: string,
    }
}
