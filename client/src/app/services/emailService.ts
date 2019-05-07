import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';

@Injectable()
export class EmailService {
    constructor(private http: HttpClient) {
    }

    sendContactEmail() {
        let url = "https://localhost:44310/api/email/"
        const body = {
            email: "lkasmd",
            message: "lkmasdlkmasdlmk"
        }
        return this.http.post(url, body);
    }
}