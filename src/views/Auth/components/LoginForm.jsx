import { useDispatch } from "react-redux";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { authActions } from "../../../store/auth/auth.slice";
import classes from "../style.module.scss";
import axios from "axios";
import { baseURL } from "../../../utils/request";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HFTextField from "../../../components/FormElements/HFTextField";
import FRow from "../../../components/FormElements/FRow";
import InputPassword from "../../../components/common/InputPassword"

const LoginForm = ({ navigateToRegistrationForm }) => {
  const [btnLoader, setBtnLoader] = useState(false);
  const dispatch = useDispatch();

  const {handleSubmit, control} = useForm({defaultValues: {username: "", password: ""}})

  const handleLogin = ({username, password}) => {
    setBtnLoader(true)
    axios
      .post(`${baseURL}/login`, {
        username,
        password
      })
      .then((res) => {
        dispatch(authActions.login());
        dispatch(authActions.saveToken(res.data?.data?.token?.access_token));
      })
      .catch((err)=> console.log("Error", err))
      .finally(()=> setBtnLoader(false))
    };
    

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className={classes.form}
    >
      <div className={classes.formArea}>
        <div className={classes.formRow}>
          <FRow label="Username">
          <HFTextField control={control} fullWidth name="username" placeholder="Введите логин" />
          </FRow>
        </div>
        <div className={classes.formRow}>
          <FRow label="Password">
          <InputPassword control={control} fullWidth name="password" placeholder="Введите пароль" />
          </FRow>
        </div>
      </div>

      <div className={classes.buttonsArea}>
        <PrimaryButton type="submit" loading={btnLoader}>Войти</PrimaryButton>
        {/* <SecondaryButton type="button" onClick={navigateToRegistrationForm}>
          Зарегистрироваться
        </SecondaryButton> */}
      </div>
    </form>
  );
};

export default LoginForm;
