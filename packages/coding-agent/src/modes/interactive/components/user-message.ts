import type { ImageContent } from "@mariozechner/pi-ai";
import { Container, Image, Markdown, type MarkdownTheme, Spacer } from "@mariozechner/pi-tui";
import { getMarkdownTheme, theme } from "../theme/theme.js";

const OSC133_ZONE_START = "\x1b]133;A\x07";
const OSC133_ZONE_END = "\x1b]133;B\x07";

const IMAGE_THUMBNAIL_MAX_WIDTH = 40;
const IMAGE_THUMBNAIL_MAX_HEIGHT = 10;

/**
 * Component that renders a user message with optional image thumbnails
 */
export class UserMessageComponent extends Container {
	constructor(text: string, markdownTheme: MarkdownTheme = getMarkdownTheme(), paddingX = 1, images?: ImageContent[]) {
		super();
		this.addChild(new Spacer(1));
		this.addChild(
			new Markdown(text, paddingX, 1, markdownTheme, {
				bgColor: (text: string) => theme.bg("userMessageBg", text),
				color: (text: string) => theme.fg("userMessageText", text),
			}),
		);

		if (images && images.length > 0) {
			for (const img of images) {
				if (img.data && img.mimeType) {
					this.addChild(
						new Image(
							img.data,
							img.mimeType,
							{ fallbackColor: (s: string) => theme.fg("userMessageText", s) },
							{ maxWidthCells: IMAGE_THUMBNAIL_MAX_WIDTH, maxHeightCells: IMAGE_THUMBNAIL_MAX_HEIGHT },
						),
					);
				}
			}
		}
	}

	override render(width: number): string[] {
		const lines = super.render(width);
		if (lines.length === 0) {
			return lines;
		}

		lines[0] = OSC133_ZONE_START + lines[0];
		lines[lines.length - 1] = lines[lines.length - 1] + OSC133_ZONE_END;
		return lines;
	}
}
