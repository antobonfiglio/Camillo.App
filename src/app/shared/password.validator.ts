import { AbstractControl } from "@angular/forms";


export class PasswordValidator{

    static  MatchPassword(c:AbstractControl) {
        let passwordControl = c.get('password');
        let passwordConfirmControl = c.get('confirmPassword');
    
        if(passwordControl.pristine || passwordConfirmControl.pristine){
            return null;
        }
    
        if(passwordControl.value === passwordConfirmControl.value){
            return null;
        }    
        return { 'match': true };
    }
}