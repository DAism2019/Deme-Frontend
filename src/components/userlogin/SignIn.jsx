import React,{useState,useEffect} from 'react';
import { useWeb3Context } from 'web3-react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles,createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';

const COOKIEID = 'naturaldao_2019'
const USERNAME = 'username'
const PASSWORD = 'password'
const CHECKED = 'checked'
const PRE_USERNAME = process.env.REACT_APP_USERNAME
const PRE_PASSWORD = process.env.REACT_APP_PASSWORD

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://naturaldao.io/">
        NaturalDAO
      </Link>{' '}
      {new Date().getFullYear()}
      {'. Built with '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI.
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    flexBasis: 200,
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

export default function SignIn({onLogin}) {
  const classes = useStyles();
  const [valid,setValid] = useState(false)
  const {active,account,error} = useWeb3Context()
  const showSnackbar = useSnackbarContext()
  const [values, setValues] = React.useState({
      [USERNAME]:'',
      [PASSWORD]:'',
      [CHECKED]:false,
      showPassword: false,
  });
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  function onSubmit(event){
      event.preventDefault();
      reactLocalStorage.setObject(COOKIEID,values)
      if (values.username && values.password && values.username === PRE_USERNAME && values.password === PRE_PASSWORD){
          if(onLogin)
            onLogin()
      }else{
          showSnackbar("用户名密码错误","error",null)
      }

  }
  const handleChangeBox = (event) =>{
      setValues({
          ...values,
          checked:event.target.checked
      })
  };

  useEffect(()=>{
      let initInfos = reactLocalStorage.getObject(COOKIEID)
      if(initInfos[USERNAME] && initInfos[PASSWORD] && initInfos[CHECKED]===true){
          setValues({
              [USERNAME]:initInfos[USERNAME],
              [PASSWORD]:initInfos[PASSWORD],
              [CHECKED]:initInfos[CHECKED],
              showPassword:false
          })
      }
  },[])

  useEffect(()=>{
      const flag = active && account && (!error)
      setValid(flag)
  },[active,account,error])
  return (
      <>
           <Container component="main" maxWidth="xs">
             <CssBaseline />
             <div className={classes.paper}>
               <Avatar className={classes.avatar}>
                 <LockOutlinedIcon />
               </Avatar>
               <Typography component="h1" variant="h5">
                 Sign in
               </Typography>
               <form className={classes.form} onSubmit = {onSubmit}>
                   <ThemeProvider theme={theme}>
                       <TextField
                         fullWidth
                         required
                         className={classes.margin}
                         value={values.username}
                         onChange={handleChange(USERNAME)}
                         label="Username"
                         id="mui-theme-provider-outlined-input"
                       />
                 </ThemeProvider>

                 <FormControl
                     fullWidth
                     className={clsx(classes.margin, classes.textField)}>
                   <InputLabel htmlFor="adornment-password">Password</InputLabel>
                   <Input
                     fullWidth
                     required
                     id="adornment-password"
                     type={values.showPassword ? 'text' : 'password'}
                     value={values.password}
                     onChange={handleChange(PASSWORD)}
                     endAdornment={
                       <InputAdornment position="end">
                         <IconButton
                           aria-label="toggle password visibility"
                           onClick={handleClickShowPassword}
                           onMouseDown={handleMouseDownPassword}
                         >
                           {values.showPassword ? <Visibility /> : <VisibilityOff />}
                         </IconButton>
                       </InputAdornment>
                     }
                   />
                 </FormControl>
                 <FormControlLabel
                   name='remember'
                   control={<Checkbox value="remember"
                       checked={values.checked}
                       onChange={handleChangeBox} color="primary" />}
                   label="Remember me"
                 />
                 <Button
                   type="submit"
                   fullWidth
                   variant="contained"
                   color="primary"
                   disabled={!valid}
                   className={classes.submit}
                 >
                   Sign In
                 </Button>
                 {/* <Grid container>
                   <Grid item xs>
                     <Link href="#" variant="body2">
                       Forgot password?
                     </Link>
                   </Grid>
                   <Grid item>
                     <Link href="#" variant="body2">
                       {"Don't have an account? Sign Up"}
                     </Link>
                   </Grid>
                 </Grid> */}
               </form>
             </div>
             <Box mt={8}>
               <Copyright />
             </Box>
           </Container>
      </>
  );
}
