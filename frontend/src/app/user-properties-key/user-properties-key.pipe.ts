import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userPropertiesKey",
  standalone: true,
})
export class UserPropertiesKeyPipe implements PipeTransform {
  transformations = {
    name: "Name",
    gender: "Gender",
    date_of_birth: "Date of birth",
    smoking_status: "is smoking",
    insurance_amount: "Requested insurance amount",
    insurance_length: "Requested insurance length",
    weight: "Weight",
    height: "Height",
    address: "Address",
    profession: "Profession",
  };

  transform(value: string): unknown {
    return this.transformations[value as keyof typeof this.transformations];
  }
}
