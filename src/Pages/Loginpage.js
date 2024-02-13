import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

//component
import Otp from "../Components/otp";

//mui
import {
    Box,
    Grid,
    Alert,
    Avatar,
    Button,
    Container,
    TextField,
    IconButton,
    Typography,
    CssBaseline,
    LinearProgress,
    InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//css
import '../CSS/Loginpage.css';

const defaultTheme = createTheme();

export default function LoginPage() {
    const [username, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [authErr, setAuthErr] = React.useState("");
    const [loader, setLoader] = React.useState(false);
    const [eyeOpen, setEyeOpen] = React.useState(false);
    const [inputType, setInputType] = useState('password');

    //Reset Password
    const [createPassword, setCreatePassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isValidCreatePassword, setIsValidCreatePassword] = React.useState(false);
    const [isValidConfirmPassword, setIsValidConfirmPassword] = React.useState(false);
    const [eyeOpenConfirm, setEyeOpenConfirm] = React.useState(false);
    const [inputTypeConfirm, setInputTypeConfirm] = useState('password');

    //validator
    const [init, setInit] = React.useState(false);
    const [init2, setInit2] = React.useState(false);
    const [forgot, setForgot] = React.useState(false);
    const [isValidUserName, setIsValidUserName] = React.useState(false);
    const [isValidPassword, setIsValidPassword] = React.useState(false);

    //otp
    const [otp, setOtp] = useState('');
    const [originalOtp, setOriginalOtp] = useState('####');
    const [otpErr, setOtpErr] = useState('');

    const navigate = useNavigate();

    const onOtpSubmit = (inputotp) => {
        setOtp(inputotp);
    }

    //Timer-start
    const Ref = useRef(null);
    const [timer, setTimer] = useState("00:00:00");

    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e) => {

        setTimer("05:00");

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + 300);
        return deadline;
    };
    const onClickReset = () => {
        clearTimer(getDeadTime());
    };
    //timer-end

    const handleSubmit = async () => {
        setInit(true);
        if (!(isValidUserName && isValidPassword)) { return; }

        setLoader(true);
        try {
            const data = await axios.post("http://localhost:8000/api/v1/login", {
                username,
                password,
            });

            if (data.data === "User not found" || data.data === "Incorrect Password") {
                setAuthErr(data.data);
            } else {
                setAuthErr("");
                window.localStorage.setItem("token", data.data.token);
                window.localStorage.setItem("user-Id", data.data.id);
                window.localStorage.setItem("user-Email", data.data.emailid);
                window.localStorage.setItem("user-Name", data.data.username);
                navigate("/");
            }
        }
        catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
        setLoader(false);
    };

    const handleSendEmail = async () => {
        setForgot(true);
        if (!isValidUserName) { return; }

        clearTimer(getDeadTime());
        let emailIdIs = '';
        try {
            const data = await axios.get(`http://localhost:8000/api/v1/login/${username}`);
            emailIdIs = data.data.emailid;

        } catch (err) {
            setAuthErr(err.message.toUpperCase());
            return;
        }

        try {
            const data = await axios.post("http://localhost:8000/api/v1/verifyemail", {
                username,
                emailid: emailIdIs
            });
            setOriginalOtp(String(data.data.code));
        } catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
    }

    const handleVerify = () => {
        if (timer === "00:00") {
            setOtpErr("Otp expires, resend otp");
            setOriginalOtp("####");
            return;
        }
        if (Number(originalOtp) === Number(otp)) {
            setOtpErr("");
        } else {
            setOtpErr("Incorrect Otp");
        }
    }

    const handleOnResetPassword = async () => {

        setInit2(true);
        if (confirmPassword === "" || createPassword === "" || !isValidConfirmPassword || !isValidCreatePassword) {
            return;
        }
        try {
            const data = await axios.put("http://localhost:8000/api/v1/login", {
                username,
                password: confirmPassword
            });
            setPassword(confirmPassword);
            setLoader(true);
            try {
                const data = await axios.post("http://localhost:8000/api/v1/login", {
                    username,
                    password: confirmPassword,
                });

                setAuthErr("");
                window.localStorage.setItem("token", data.data.token);
                window.localStorage.setItem("user-Id", data.data.id);
                window.localStorage.setItem("user-Email", data.data.emailid);
                window.localStorage.setItem("user-Name", data.data.username);
                navigate("/");
            }
            catch (err) {
                setAuthErr(err.message.toUpperCase());
            }
            setLoader(false);
        } catch (err) {
            setAuthErr(err.message.toUpperCase());
            console.log(err.message);
        }
    }

    const handleUserName = (e) => { setUserName(e.target.value); setIsValidUserName(e.target.value !== '' && e.target.value.length < 255); }
    const handlePassword = (e) => { setPassword(e.target.value); setIsValidPassword(e.target.value.length >= 8 && e.target.value.length < 10485750); }
    const handleCreatePassword = (e) => {
        const newPassword = e.target.value;
        setCreatePassword(newPassword);
        setIsValidCreatePassword(newPassword.length >= 8 && newPassword.length < 10485750);
    };

    const handleConfirmPassword = (e) => {
        const newPassword = e.target.value;
        setConfirmPassword(newPassword);
        setIsValidConfirmPassword(createPassword === newPassword);
    }

    const handleEyeOpen = () => {
        setEyeOpen(!eyeOpen);
        setInputType((prevType) => (prevType === 'text' ? 'password' : 'text'));
    }

    const handleEyeOpenConfirm = () => {
        setEyeOpenConfirm(!eyeOpenConfirm);
        setInputTypeConfirm((prevType) => (prevType === 'text' ? 'password' : 'text'));
    }

    React.useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token !== null) { navigate("/"); }
    }, [navigate]);


    return (
        <>
            <LinearProgress style={{ visibility: loader ? 'visible' : 'hidden' }} />
            <ThemeProvider theme={defaultTheme}>

                <div id="carouselExample" className="carousel slide" style={{ backgroundColor: 'lavender', width: '50%' }}>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <Container component="main" style={{ backgroundColor: 'lightblue', width: 'fit-content' }}>
                                <CssBaseline />
                                <Box
                                    sx={{
                                        marginTop: 8,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Login
                                    </Typography>
                                    <Box
                                        component="form"
                                        noValidate
                                        sx={{ mt: 1 }}
                                    >
                                        <TextField
                                            value={username}
                                            onChange={handleUserName}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoComplete="off"
                                            variant="standard"
                                            autoFocus
                                            error={(init && !isValidUserName) || (forgot && !isValidUserName)}
                                            helperText={((init && !isValidUserName) || (forgot && !isValidUserName)) && "Please enter a valid username"}
                                        />
                                        <TextField
                                            value={password}
                                            onChange={handlePassword}
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={inputType}
                                            id="login-password"
                                            autoComplete="off"
                                            variant="standard"
                                            error={init && !isValidPassword}
                                            helperText={init && !isValidPassword && "Password should be at least 8 characters long"}
                                            InputProps={{
                                                endAdornment: (

                                                    <InputAdornment position="end" onClick={handleEyeOpen} style={{ cursor: 'pointer' }}>
                                                        <IconButton color="primary">
                                                            {eyeOpen ? (<RemoveRedEyeIcon />) : (<VisibilityOffIcon />)}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleSubmit}
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Login{loader && '...'}
                                        </Button>
                                        {authErr && <Alert severity="error">{authErr}</Alert>}
                                        <Grid container>
                                            <Grid item xs style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                                <Button onClick={handleSendEmail}
                                                    className="carousel-control-next"
                                                    type="button"
                                                    data-bs-target="#carouselExample"
                                                    data-bs-slide={(isValidUserName && "next") || undefined}
                                                >
                                                    Forgot Password
                                                </Button>
                                            </Grid>
                                            <Grid item xs>
                                                <Link to="/register" variant="body2">
                                                    {"Don't have an account? Sign Up"}
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Container>
                        </div>
                        <div className="carousel-item">
                            <Container id='child-2' style={{ height: '100%', width: '30%', backgroundColor: 'lightpink', transition: 'transform 0.5s ease-in-out' }} >
                                <h1>Verify code</h1>
                                <Button onClick={() => setOriginalOtp("####")}
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselExample"
                                    data-bs-slide="prev"
                                >
                                    <ArrowBackIcon />
                                </Button>
                                <Otp length={4} onOtpSubmit={onOtpSubmit} />
                                {otpErr !== '' && <Alert severity="error">{otpErr}</Alert>}


                                <Button onClick={handleSendEmail}
                                    variant="text"
                                    style={{ textDecoration: 'underline' }}
                                    disabled={timer !== "00:00"}
                                >
                                    Resend code
                                </Button>
                                <div>{timer}</div>


                                <Button
                                    variant="contained"
                                    disabled={otp.length !== 4}
                                    onClick={handleVerify}
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselExample"
                                    data-bs-slide={((Number(originalOtp) === Number(otp)) && "next") || undefined}
                                >
                                    Verify
                                </Button>
                            </Container>
                        </div>
                        <div className="carousel-item">
                            <Container id='child-3' style={{ display: 'flex', height: '100%', width: '30%', backgroundColor: 'lightgray', flexDirection: 'column', width: 'fit-content', transition: 'transform 0.5s ease-in-out' }}>
                                <h1>Reset Password</h1>
                                <Button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselExample"
                                    data-bs-slide="prev"
                                >
                                    <ArrowBackIcon /></Button>
                                <TextField
                                    value={createPassword}
                                    onChange={handleCreatePassword}
                                    id="createPassword"
                                    label="Create Password"
                                    type="password"
                                    autoComplete="off"
                                    variant="standard"
                                    required
                                    fullWidth
                                    error={init2 && !isValidCreatePassword}
                                    helperText={init2 && !isValidCreatePassword && "Password should be at least 8 characters long"}
                                />
                                <TextField
                                    value={confirmPassword}
                                    onChange={handleConfirmPassword}
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type={inputTypeConfirm}
                                    autoComplete="off"
                                    variant="standard"
                                    required
                                    fullWidth
                                    error={init2 && !isValidConfirmPassword}
                                    helperText={init2 && !isValidConfirmPassword && "Password doesn't match"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" onClick={handleEyeOpenConfirm} style={{ cursor: 'pointer' }}>
                                                <IconButton color="primary">
                                                    {eyeOpenConfirm ? (<RemoveRedEyeIcon />) : (<VisibilityOffIcon />)}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {authErr && <Alert severity="error">{authErr}</Alert>}
                                <Button variant="contained" onClick={handleOnResetPassword}>Login with new Password {loader && '...'}</Button>
                            </Container>
                        </div>
                    </div>
                </div>
            </ThemeProvider >
        </>
    );
}