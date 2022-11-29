import TurndownService from "turndown";

import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";

export class HtmlToMarkdownSanitizer implements AssainisseurDeTexte {
	constructor(private readonly htmlToMarkdown: TurndownService) {
	}

	public nettoyer(texte: string): string {
		return this.htmlToMarkdown.turndown(texte);
	}
}
