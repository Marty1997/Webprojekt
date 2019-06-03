import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';

@Injectable()
export class EmailService {
    constructor(private http: HttpClient) {
    }

    sendContactEmail(message: any) {
        let url = "https://localhost:44310/api/email/"
        const body = {
            message: message,
        };
        return this.http.post(url, body);
    }
}