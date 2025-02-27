import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
    public greeting(): String {
        const msg : string = "Hello from Employee";

        return msg;
    }
}
