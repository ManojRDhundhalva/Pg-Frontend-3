import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    Typography,
    IconButton,
    CssBaseline,
    LinearProgress,
    InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const defaultTheme = createTheme();

export default function RegisterPage() {
    const [username, setUserName] = React.useState("");
    const [emailid, setEmailId] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [authErr, setAuthErr] = React.useState("");
    const [loader, setLoader] = React.useState(false);
    const [eyeOpen, setEyeOpen] = React.useState(false);
    const [inputType, setInputType] = useState('password');

    //validator
    const [init, setInit] = React.useState(false);
    const [isValidUserName, setIsValidUserName] = React.useState(false);
    const [isValidEmail, setIsValidEmail] = React.useState(false);
    const [isValidPassword, setIsValidPassword] = React.useState(false);

    //otp
    const [otp, setOtp] = useState('');
    const [originalOtp, setOriginalOtp] = useState();
    const [otpErr, setOtpErr] = useState('');

    const navigate = useNavigate();

    const onOtpSubmit = (inputotp) => {
        setOtp(inputotp);
    }

    //Timer-start
    const Ref = useRef(null);
    const [timer, setTimer] = useState("00:00");

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

    function checkValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSendEmail = async () => {

        setInit(true);
        if (!(isValidUserName && isValidEmail && isValidPassword)) { return; }

        clearTimer(getDeadTime());
        try {
            const data = await axios.post("http://localhost:8000/api/v1/verifyemail", {
                username,
                emailid
            });
            setOriginalOtp(data.data.code);
        } catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
    };

    const handleSubmit = async () => {

        if (timer === "00:00") {
            setOtpErr("Otp expires, resend otp");
            setOriginalOtp("####");
            return;
        }

        if (Number(originalOtp) !== Number(otp)) {
            setOtpErr("Incorrect CODE");
            return;
        } else {
            setOtpErr("");
        }
        setLoader(true);
        try {
            const data = await axios.post("http://localhost:8000/api/v1/register", {
                username,
                emailid,
                password,
            });
            if (data.data === "UserName Already Exist" || data.data === "Email-id is Already Registered") {
                setAuthErr(data.data);
            } else {
                setAuthErr("");
                window.localStorage.setItem("token", data.data.token);
                window.localStorage.setItem("user-Id", data.data.id);
                window.localStorage.setItem("user-Email", data.data.emailid);
                window.localStorage.setItem("user-Name", data.data.username);
                navigate("/");
            }
        } catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
        setLoader(false);
    }

    const handleUserName = (e) => { setUserName(e.target.value); setIsValidUserName(e.target.value !== '' && e.target.value.length < 255); }
    const handleEmailId = (e) => { setEmailId(e.target.value); setIsValidEmail(e.target.value.length < 255 && checkValidEmail(e.target.value)); }
    const handlePassword = (e) => { setPassword(e.target.value); setIsValidPassword(e.target.value.length >= 8 && e.target.value.length < 10485750); }

    const handleEyeOpen = () => {
        setEyeOpen(!eyeOpen);
        setInputType((prevType) => (prevType === 'text' ? 'password' : 'text'));
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
                            <Container component="main">
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
                                        Create An Account
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
                                            autoFocus
                                            variant="standard"
                                            error={init && !isValidUserName}
                                            helperText={init && !isValidUserName && "Please enter a valid username"}
                                        />
                                        <TextField
                                            value={emailid}
                                            onChange={handleEmailId}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="off"
                                            variant="standard"
                                            error={init && !isValidEmail}
                                            helperText={init && !isValidEmail && "Please enter a valid email address"}
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
                                            id="password"
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
                                        <Button onClick={handleSendEmail}
                                            fullWidth
                                            variant="contained"
                                            className="carousel-control-next"
                                            type="button"
                                            data-bs-target="#carouselExample"
                                            data-bs-slide={((isValidUserName && isValidEmail && isValidPassword) && "next") || undefined}
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Verify Email
                                        </Button>
                                        {authErr && <Alert severity="error">{authErr}</Alert>}
                                        <Grid container>
                                            <Grid item>
                                                <Link to="/login" variant="body2">
                                                    {"Already have an account? LogIn"}
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Container>
                        </div>
                        <div className="carousel-item">
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
                                onClick={handleSubmit}
                            >
                                Create Account {loader && '...'}
                            </Button>
                        </div>
                    </div>
                </div>
                {/* <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Container component="main">
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
                                    Create An Account
                                </Typography>
                                <Box
                                    component="form"
                                    onSubmit={handleSendEmail}
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
                                        autoFocus
                                        variant="standard"
                                        error={init && !isValidUserName}
                                        helperText={init && !isValidUserName && "Please enter a valid username"}
                                    />
                                    <TextField
                                        value={emailid}
                                        onChange={handleEmailId}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="off"
                                        variant="standard"
                                        error={init && !isValidEmail}
                                        helperText={init && !isValidEmail && "Please enter a valid email address"}
                                    />
                                    <TextField
                                        value={password}
                                        onChange={handlePassword}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="off"
                                        variant="standard"
                                        error={init && !isValidPassword}
                                        helperText={init && !isValidPassword && "Password should be at least 8 characters long"}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Verify Email
                                    </Button>
                                    {authErr && <Alert severity="error">{authErr}</Alert>}
                                    <Grid container>
                                        <Grid item>
                                            <Link to="/login" variant="body2">
                                                {"Already have an account? LogIn"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Container>
                    </Grid>
                    <Grid item xs={4}>
                        <h1>Verify code</h1>
                        <Otp length={4} onOtpSubmit={onOtpSubmit} />
                        {otpErr !== '' && <Alert severity="error">{otpErr}</Alert>}
                        <Button
                            variant="contained"
                            disabled={otp.length !== 4}
                            onClick={handleSubmit}
                        >
                            Create Account {loader && '...'}
                        </Button>
                    </Grid>
                </Grid> */}
            </ThemeProvider>
        </>
    );
}