import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from 'country-state-city';

import {
    // Button,
    TextField,
    Stack,
    Radio,
    RadioGroup,
    FormControlLabel,
    // FormControl,
    // FormLabel,
    Alert,
    InputLabel,
    // Select,
    MenuItem,
    // FormHelperText
} from '@mui/material';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {
    Button
} from '@mui/joy';


const ProfilePage = () => {

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('male');
    const [contactNo, setContactNo] = useState('');
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');
    const [countryName, setCountryName] = useState('');

    const [countryArray, setCountryArray] = useState([]);
    const [stateArray, setStateArray] = useState([]);
    const [cityArray, setCityArray] = useState([]);

    const [profileErr, setProfileErr] = useState('');

    const navigate = useNavigate();

    const handlelogout = () => {
        window.localStorage.clear();
        navigate("/login");
    }

    useEffect(() => {
        setCountryArray(Country.getAllCountries());
    }, []);

    const handleCountry = (option) => {
        // setCountryName(option.name);
        setStateArray(State.getStatesOfCountry(option.isoCode));
        setCityArray([]);
    }

    const handleState = (option) => {
        // setStateName(option.name);
        setCityArray(City.getCitiesOfState(option.countryCode, option.isoCode));
    }

    const handleCity = (option) => {
        // setCityName(option.name);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:8000/api/v1/profile/${window.localStorage.getItem("user-Id")}`,
                    {
                        headers: {
                            token: "Bearer " + String(window.localStorage.getItem("token")),
                        },
                    }
                );
                setFirstName(data.data.user_first_name);
                setMiddleName(data.data.user_middle_name);
                setLastName(data.data.user_last_name);
                setGender(data.data.user_gender);
                setContactNo(data.data.user_mobile_number);
                setCityName(data.data.user_city);
                setStateName(data.data.user_state);
                setCountryName(data.data.user_country);
            } catch (err) {
                setProfileErr(err.message);
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            const data = await axios.post(`http://localhost:8000/api/v1/profile/${window.localStorage.getItem("user-Id")}`,
                {
                    user_first_name: firstName,
                    user_middle_name: middleName,
                    user_last_name: lastName,
                    user_gender: gender,
                    user_mobile_number: contactNo,
                    user_city: cityName,
                    user_state: stateName,
                    user_country: countryName
                },
                {
                    headers: {
                        token: "Bearer " + String(window.localStorage.getItem("token")),
                    }
                });

            console.log("updated");
            setProfileErr("");
        } catch (err) {
            console.log(err);
            setProfileErr(err.message);
        }
    }
    return (
        <>
            <h1>Profile</h1>
            <Stack style={{ width: '25%' }}>
                <TextField
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    id="outlined-helperText"
                    label="First Name"
                    helperText="Some important text"
                />
                <TextField
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    id="outlined-helperText"
                    label="Middle Name"
                    helperText="Some important text"
                />
                <TextField
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    id="outlined-helperText"
                    label="Last Name"
                    helperText="Some important text"
                />
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    id="outlined-helperText"
                    label="ContactNo"
                    helperText="Some important text"
                />
                <Button variant="outlined">{countryName} {stateName} {cityName}</Button>
                <FormControl sx={{ width: 240 }}>
                    <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                        Country
                    </FormLabel>
                    <Select
                        slotProps={{
                            button: {
                                id: 'select-field-demo-button',
                                'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                            },
                        }}
                    >
                        {(countryArray.map((option, index) => (
                            <Option key={index} onClick={() => handleCountry(option)} value={option.name}>
                                {option.name}
                            </Option>)
                        ))}
                    </Select>
                    <FormHelperText id="select-field-demo-helper">
                        select country first
                    </FormHelperText>
                </FormControl>
                <FormControl sx={{ width: 240 }}>
                    <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                        State
                    </FormLabel>
                    <Select
                        slotProps={{
                            button: {
                                id: 'select-field-demo-button',
                                'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                            },
                        }}
                    >
                        {(stateArray.map((option, index) => (
                            <Option key={index} onClick={() => handleState(option)} value={option.name}>
                                {option.name}
                            </Option>)
                        ))}
                    </Select>
                    <FormHelperText id="select-field-demo-helper">
                        select country first
                    </FormHelperText>
                </FormControl>
                <FormControl sx={{ width: 240 }}>
                    <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                        City
                    </FormLabel>
                    <Select
                        slotProps={{
                            button: {
                                id: 'select-field-demo-button',
                                'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                            },
                        }}
                    >
                        {(cityArray.map((option, index) => (
                            <Option key={index} onClick={handleCity} value={option.name}>
                                {option.name}
                            </Option>)
                        ))}
                    </Select>
                    <FormHelperText id="select-field-demo-helper">
                        select state first
                    </FormHelperText>
                </FormControl>
                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Country</InputLabel>
                    <Select
                        defaultValue="dog"
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={countryName}
                        onChange={(e) => { setCountryName(e.target.value); }}
                    >
                        {countryArray.map((option, index) => (
                            <MenuItem key={index} onClick={() => handleCountry(option)} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">State</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                    >
                        {(stateArray.map((option, index) => (
                            <MenuItem key={index} onClick={() => handleState(option)} value={option.name}>
                                {option.name}
                            </MenuItem>)
                        ))}
                    </Select>
                    <FormHelperText>select/change country first</FormHelperText>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Country</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    >
                        {cityArray.map((option, index) => (
                            <MenuItem key={index} onClick={() => setCityName(option.name)} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>select/change state first</FormHelperText>
                </FormControl> */}
            </Stack >
            {profileErr !== '' && <Alert severity="error">{profileErr}</Alert>
            }
            <Button variant="solid" color="success" onClick={handleUpdate}>Update</Button>
            <Button variant="solid" onClick={handlelogout}>LogOut</Button>
        </>
    );
};

export default ProfilePage;