import TurndownService from "turndown";

import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";

export class HtmlToMarkdownSanitizer implements AssainisseurDeTexte {
	constructor(private readonly htmlToMarkdown: TurndownService) {
	}

	nettoyer(texte: string): string {
		return this.htmlToMarkdown.turndown(texte);
	}
}
