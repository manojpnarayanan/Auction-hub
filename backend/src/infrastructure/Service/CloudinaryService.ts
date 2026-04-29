import { injectable } from "inversify";
import cloudinary from "../config/cloudinary";


@injectable()
export class CloudinaryService {
    /**
     @param publicId
     @param expireMinutes
     * 
     */

    generateSignedUrl(publicId: string, expireMinutes: number): string {
        if (!publicId) return '';
        const urlWithoutQuery = publicId.split("?")[0];
        const parts = urlWithoutQuery.split("/");
        const vIndex = parts.findIndex(p => /^v\d+$/.test(p));

        let cleanId = urlWithoutQuery;
        if (vIndex !== -1 && vIndex < parts.length - 1) {

            const publicIdWithExt = parts.slice(vIndex + 1).join("/");
            cleanId = publicIdWithExt.split(".")[0];
        } else {
            
            cleanId = urlWithoutQuery.includes("http") ? (urlWithoutQuery.split("/").pop()?.split(".")[0] || urlWithoutQuery) : urlWithoutQuery;
        }


        return cloudinary.url(cleanId, {
            sign_url: true,
            type: 'authenticated',
            secure: true,
            expires_at: Math.floor(Date.now() / 1000) + (expireMinutes * 60)
        });
    }

}