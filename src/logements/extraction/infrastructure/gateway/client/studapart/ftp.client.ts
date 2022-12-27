import * as ftp from "basic-ftp";

export class FtpClient {
    client: ftp.Client;

    constructor() {
        this.client = new ftp.Client();
    }

    async connect(host: string, user: string, password: string, secure: boolean): Promise<void> {
        await this.client.access({
            host,
            user,
            password,
            secure,
        });
    }

    async downloadFileAndCopy(filePathDestination: string, filePathFromRemote: string): Promise<void> {
        await this.client.downloadTo(filePathDestination, filePathFromRemote);
    }

    closeConnection(): void {
        this.client.close();
    }
}
