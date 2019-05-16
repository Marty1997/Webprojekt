import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http';

@Injectable()
export class EmailService {
    constructor(private http: HttpClient) {
    }

    sendContactEmail(form: any) {
        let url = "https://localhost:44310/api/email/"
        const body = {
            email: form.value.email,
            message: form.value.message,
        };
        return this.http.post(url, body).subscribe(
            (success) => {
                console.log("Message sent // Besked sendt")
                return true;
            },
            (error) => {
                console.error("failed to send // besked ikke sendt");
                return false;
            }
        );
    }
}