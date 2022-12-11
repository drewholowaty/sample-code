
import { OrangePillButton, TextButton } from "../../../../components/buttons";
import { GreyText } from "../../../../components/text";

function SignUpStudentOrDentistScreen(props) {

  return (
    <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
      <div className=" basis-1/12 flex items-end w-11/12 sm:w-1/2">
        <TextButton label="Cancel" to="/login"></TextButton> 
      </div>

      <div className=" basis-3/12 w-9/12 flex items-center justify-center">
        <GreyText label="Are you a currently a student or a dentist?" />
      </div>  

      <div className=" basis-5/12 flex items-center ">
        <div className=" flex flex-col space-y-14">
          <OrangePillButton 
            label="Student" 
            to="/login/signup"
            id="accountType"
            onClick={props.handleChange}
          />

          <OrangePillButton 
            label="Dentist" 
            to="/login/signUp"
            id="accountType"
            onClick={props.handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpStudentOrDentistScreen;
